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

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

function broadcast(message) {
  for (const client of clients) {
    if (client.readyState === 1) client.send(JSON.stringify(message));
  }
}

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'a-very-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const loadInstance = (req, res, next) => {
  const { instanceId } = req.params;
  req.instance = db.data.instances[instanceId];
  if (!req.instance) return res.status(404).json({ message: 'Instance not found.' });
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.session.user?.instanceId === req.params.instanceId && req.session.user?.role === 'admin') return next();
  res.status(401).json({ message: 'Unauthorized' });
};

const requireSuperAdmin = (req, res, next) => {
    if (req.session.user?.role === 'superadmin') return next();
    res.status(401).json({ message: 'Unauthorized' });
};

// --- AUTH ---
app.post('/api/super-admin/login', async (req, res) => {
    const { username, password } = req.body;
    const superAdmin = db.data.superAdmins[username];
    if (superAdmin && await bcrypt.compare(password, superAdmin.passwordHash)) {
        req.session.user = { username, role: 'superadmin' };
        res.json({ message: 'Super admin login successful' });
    } else {
        res.status(401).json({ message: 'Invalid super admin credentials' });
    }
});

app.post('/api/instances/:instanceId/login', loadInstance, async (req, res) => {
  const { username, password } = req.body;
  const admin = req.instance.admin;
  if (username === admin.username && await bcrypt.compare(password, admin.passwordHash)) {
    req.session.user = { username, instanceId: req.instance.id, role: 'admin' };
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// --- SUPER ADMIN ---
app.get('/api/instances', requireSuperAdmin, (req, res) => {
    res.json(Object.values(db.data.instances));
});

app.post('/api/instances', requireSuperAdmin, async (req, res) => {
    const { id, name, adminUsername, adminPassword } = req.body;
    if (db.data.instances[id]) return res.status(400).json({ message: 'Instance ID already exists.' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    db.data.instances[id] = { id, name, admin: { username: adminUsername, passwordHash }, appointments: [], availability: {}, coupons: [], services: [], inventory: [] };
    await db.write();
    res.status(201).json(db.data.instances[id]);
});


// --- DATA ROUTES (Appointments, Availability, etc.) ---
app.get('/api/:instanceId/availability', loadInstance, (req, res) => res.json(req.instance.availability || {}));
app.post('/api/:instanceId/availability', loadInstance, requireAdmin, async (req, res) => {
    const { date, slots } = req.body;
    if (!req.instance.availability) req.instance.availability = {};
    req.instance.availability[date] = { slots };
    await db.write();
    broadcast({ type: 'availability_updated' });
    res.json(req.instance.availability);
});

app.get('/api/:instanceId/appointments', loadInstance, (req, res) => res.json(req.instance.appointments || []));
app.post('/api/:instanceId/appointments', loadInstance, async (req, res) => {
    const { date, time, clientName, phone } = req.body;
    const newAppointment = { id: nanoid(), startTime: `${date}T${time}`, clientName, phone, status: 'scheduled' };
    req.instance.appointments.push(newAppointment);
    const day = req.instance.availability[date];
    if (day?.slots) {
        const slotIndex = day.slots.indexOf(time);
        if (slotIndex > -1) day.slots.splice(slotIndex, 1);
    }
    await db.write();
    broadcast({ type: 'appointments_updated' });
    res.status(201).json(newAppointment);
});

app.delete('/api/:instanceId/appointments/:id', loadInstance, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const apptIndex = req.instance.appointments.findIndex(a => a.id === id);
    if (apptIndex === -1) return res.status(404).json({ message: 'Appointment not found' });
    const [appointment] = req.instance.appointments.splice(apptIndex, 1);
    const [date, time] = appointment.startTime.split('T');
    if (req.instance.availability[date]) {
        req.instance.availability[date].slots.push(time);
        req.instance.availability[date].slots.sort();
    }
    await db.write();
    broadcast({ type: 'appointments_updated' });
    res.status(200).json({ message: 'Appointment cancelled' });
});

// --- INVENTORY, SERVICES, COUPONS (CRUD) ---
const createCrudEndpoints = (entityName) => {
    app.get(`/api/:instanceId/${entityName}`, loadInstance, (req, res) => res.json(req.instance[entityName]));
    app.post(`/api/:instanceId/${entityName}`, loadInstance, requireAdmin, async (req, res) => {
        const newItem = { id: nanoid(), ...req.body };
        req.instance[entityName].push(newItem);
        await db.write();
        broadcast({ type: `${entityName}_updated` });
        res.status(201).json(newItem);
    });
    app.delete(`/api/:instanceId/${entityName}/:id`, loadInstance, requireAdmin, async (req, res) => {
        const { id } = req.params;
        const initialLength = req.instance[entityName].length;
        req.instance[entityName] = req.instance[entityName].filter(item => item.id !== id);
        if (req.instance[entityName].length < initialLength) {
            await db.write();
            broadcast({ type: `${entityName}_updated` });
            res.status(200).json({ message: 'Deleted' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    });
};
createCrudEndpoints('services');
createCrudEndpoints('inventory');
createCrudEndpoints('coupons');

// --- Mark as Complete ---
app.post('/api/:instanceId/appointments/:id/complete', loadInstance, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { serviceId, finalPrice, materialsUsed } = req.body; // [{ itemId, quantity }]

    const appointment = req.instance.appointments.find(a => a.id === id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const service = req.instance.services.find(s => s.id === serviceId);
    if (!service) return res.status(400).json({ message: 'Service not found' });

    let totalCost = 0;
    if (materialsUsed) {
        for (const used of materialsUsed) {
            const item = req.instance.inventory.find(i => i.id === used.itemId);
            if (!item || item.quantity < used.quantity) return res.status(400).json({ message: `Not enough stock for ${item.name}`});
            item.quantity -= used.quantity;
            totalCost += item.cost * used.quantity;
        }
    }

    appointment.status = 'completed';
    appointment.serviceId = serviceId;
    appointment.finalPrice = finalPrice || service.price;
    appointment.totalCost = totalCost;
    appointment.profit = appointment.finalPrice - totalCost;
    appointment.materialsUsed = materialsUsed;

    await db.write();
    broadcast({ type: 'appointments_updated' });
    res.json(appointment);
});


server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});