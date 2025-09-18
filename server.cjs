const express = require('express');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();

const DB_FILE = './database.json';

const readDb = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DB_FILE, JSON.stringify({ appointments: [], availability: {}, coupons: [], clients: [] }), 'utf8');
      return { appointments: [], availability: {}, coupons: [], clients: [] };
    }
    throw error;
  }
};

const writeDb = async (data) => {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// Debug middleware - Log all requests
app.use((req, res, next) => {
  console.log('--------------------');
  console.log('Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: req.headers,
    cookies: req.cookies
  });
  next();
});

// CORS must be before other middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 2 * 60 * 1000,
    sameSite: 'lax'
  },
  name: 'sessionId'
}));

// Log session middleware
app.use((req, res, next) => {
  console.log('Session data:', {
    id: req.sessionID,
    session: req.session,
    isAuthenticated: req.session.isAuthenticated
  });
  next();
});

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  console.log('Login attempt:', {
    body: req.body,
    session: req.session
  });

  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username };
    req.session.lastActivity = Date.now();
    
    console.log('Login successful, session:', req.session);
    
    // Save session before sending response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session error' });
      }
      res.json({ username });
    });
  } else {
    console.log('Login failed - invalid credentials');
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Verify endpoint
app.get('/api/admin/verify', (req, res) => {
  console.log('Verify request:', {
    session: req.session,
    isAuthenticated: req.session.isAuthenticated
  });

  if (req.session.isAuthenticated) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Heartbeat endpoint
app.post('/api/admin/heartbeat', (req, res) => {
  console.log('Heartbeat:', {
    session: req.session,
    isAuthenticated: req.session.isAuthenticated
  });

  if (req.session.isAuthenticated) {
    req.session.lastActivity = Date.now();
    res.json({ status: 'active' });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  console.log('Logout request');
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ message: 'Error during logout' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

// APPOINTMENTS API
app.get('/api/appointments/:id', async (req, res) => {
  const db = await readDb();
  const appointment = db.appointments.find(a => a.id == req.params.id);
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

app.get('/api/appointments', async (req, res) => {
  const db = await readDb();
  res.json(db.appointments);
});

app.post('/api/appointments', async (req, res) => {
  const db = await readDb();
  const newAppointment = { ...req.body, id: Date.now() };
  db.appointments.push(newAppointment);
  await writeDb(db);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', async (req, res) => {
  const db = await readDb();
  const { id } = req.params;
  const updatedAppointment = req.body;
  const index = db.appointments.findIndex(a => a.id == id);
  if (index !== -1) {
    db.appointments[index] = { ...db.appointments[index], ...updatedAppointment };
    await writeDb(db);
    res.json(db.appointments[index]);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  const db = await readDb();
  const { id } = req.params;
  const index = db.appointments.findIndex(a => a.id == id);
  if (index !== -1) {
    db.appointments.splice(index, 1);
    await writeDb(db);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// AVAILABILITY API
app.get('/api/availability', async (req, res) => {
  const db = await readDb();
  res.json(db.availability);
});

app.post('/api/availability', async (req, res) => {
  const db = await readDb();
  db.availability = req.body;
  await writeDb(db);
  res.json(db.availability);
});

// CLIENTS API
app.post('/api/clients', async (req, res) => {
  const db = await readDb();
  const { phone } = req.body;
  let client = db.clients.find(c => c.phone === phone);
  if (!client) {
    client = { id: Date.now(), ...req.body };
    db.clients.push(client);
    await writeDb(db);
  }
  res.json(client);
});

// COUPONS API
app.post('/api/coupons', async (req, res) => {
  const db = await readDb();
  const { clientId } = req.body;
  const coupon = {
    id: Date.now(),
    clientId,
    code: `PROMO${Date.now()}`,
    discount: Math.floor(Math.random() * 20) + 5, // 5-25% discount
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    used: false
  };
  db.coupons.push(coupon);
  await writeDb(db);
  res.status(201).json(coupon);
});

app.get('/api/coupons/:clientId', async (req, res) => {
  const db = await readDb();
  const { clientId } = req.params;
  const coupons = db.coupons.filter(c => c.clientId == clientId && !c.used);
  res.json(coupons);
});

app.post('/api/coupons/apply', async (req, res) => {
  const db = await readDb();
  const { code, appointmentId } = req.body;
  const coupon = db.coupons.find(c => c.code === code && !c.used);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found or already used' });
  }

  // If appointmentId is provided, it's the final application
  if (appointmentId) {
    const appointment = db.appointments.find(a => a.id == appointmentId);
    if (appointment) {
      appointment.discount = coupon.discount;
      appointment.couponCode = code;
      coupon.used = true;
      await writeDb(db);
      return res.json({ success: true, appointment });
    } else {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
  } else {
    // If no appointmentId, it's a validation request. Just return the discount.
    return res.json({ success: true, discount: coupon.discount });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin credentials for testing:`);
  console.log(`Username: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}); 