import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { db } from './db.cjs';
import { nanoid } from 'nanoid';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const port = 3001;

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// WebSocket connection handling
const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Broadcast function to send updates to all clients
function broadcast(message) {
  console.log('Broadcasting message:', message);
  for (const client of clients) {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  }
}


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'a-very-secret-key-that-should-be-in-env',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax' }
}));

// Middleware to load instance data
const loadInstance = (req, res, next) => {
  const { instanceId } = req.params;
  if (!instanceId) {
    return res.status(400).json({ message: 'Instance ID is required.' });
  }

  const instance = db.data.instances[instanceId];
  if (!instance) {
    return res.status(404).json({ message: 'Instance not found.' });
  }

  req.instance = instance;
  next();
};

// Middleware for admin authentication
const requireAdmin = (req, res, next) => {
  if (req.session.user?.instanceId === req.params.instanceId && req.session.user?.role === 'admin') {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};


// --- Instance/Auth Routes ---
app.post('/api/instances/:instanceId/login', loadInstance, async (req, res) => {
  const { username, password } = req.body;
  const admin = req.instance.admin;

  if (username === admin.username && await bcrypt.compare(password, admin.passwordHash)) {
    req.session.user = {
      username: admin.username,
      instanceId: req.instance.id,
      role: 'admin'
    };
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- Availability Routes ---
app.get('/api/:instanceId/availability/dates', loadInstance, (req, res) => {
    const availableDates = Object.keys(req.instance.availability || {}).filter(dateString => {
        const day = req.instance.availability[dateString];
        return day.slots && day.slots.length > 0;
    });
    res.json(availableDates);
});

app.get('/api/:instanceId/availability/slots/:date', loadInstance, (req, res) => {
    const { date } = req.params;
    const dayAvailability = req.instance.availability ? req.instance.availability[date] : undefined;
    if (dayAvailability && dayAvailability.slots) {
        res.json(dayAvailability.slots);
    } else {
        res.json([]);
    }
});

app.post('/api/:instanceId/availability', loadInstance, requireAdmin, async (req, res) => {
    const { date, slots } = req.body;
    if (!req.instance.availability) {
        req.instance.availability = {};
    }
    req.instance.availability[date] = { slots };
    await db.write();
    broadcast({ type: 'availability_updated' });
    res.json(req.instance.availability);
});

// --- Appointment Routes ---
app.get('/api/:instanceId/appointments', loadInstance, (req, res) => {
    res.json(req.instance.appointments || []);
});

app.post('/api/:instanceId/appointments', loadInstance, async (req, res) => {
    const { date, time, clientName, phone } = req.body;
    if (!date || !time || !clientName || !phone) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const newAppointment = {
        id: nanoid(),
        startTime: `${date}T${time}`,
        clientName,
        phone,
        status: 'scheduled',
    };
    req.instance.appointments.push(newAppointment);

    const day = req.instance.availability[date];
    if (day && day.slots) {
        const slotIndex = day.slots.indexOf(time);
        if (slotIndex > -1) {
            day.slots.splice(slotIndex, 1);
        }
    }

    await db.write();
    broadcast({ type: 'appointments_updated' });
    res.status(201).json(newAppointment);
});

app.delete('/api/:instanceId/appointments/:id', loadInstance, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const appointmentIndex = req.instance.appointments.findIndex(a => a.id === id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    const [appointment] = req.instance.appointments.splice(appointmentIndex, 1);

    const [date, time] = appointment.startTime.split('T');
    if (req.instance.availability[date]) {
        req.instance.availability[date].slots.push(time);
        req.instance.availability[date].slots.sort();
    }

    await db.write();
    broadcast({ type: 'appointments_updated' });
    res.status(200).json({ message: 'Appointment cancelled' });
});

// --- Coupon Routes ---
app.get('/api/:instanceId/coupons', loadInstance, requireAdmin, (req, res) => {
    res.json(req.instance.coupons);
});

app.post('/api/:instanceId/coupons', loadInstance, requireAdmin, async (req, res) => {
    const { code, discount } = req.body;
    const newCoupon = { id: nanoid(), code, discount };
    req.instance.coupons.push(newCoupon);
    await db.write();
    broadcast({ type: 'coupons_updated' });
    res.status(201).json(newCoupon);
});

app.delete('/api/:instanceId/coupons/:id', loadInstance, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const initialLength = req.instance.coupons.length;
    req.instance.coupons = req.instance.coupons.filter(c => c.id !== id);
    if (req.instance.coupons.length < initialLength) {
        await db.write();
        broadcast({ type: 'coupons_updated' });
        res.status(200).json({ message: 'Coupon deleted' });
    } else {
        res.status(404).json({ message: 'Coupon not found' });
    }
});


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});