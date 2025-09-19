const express = require('express');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs').promises;
const app = express();

const DB_FILE = './database.json';

// Helper functions to read and write to the JSON database
const readDb = async () => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with a default structure
    if (error.code === 'ENOENT') {
      const defaultData = { appointments: [], availability: {}, coupons: [], clients: [] };
      await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
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
    // Find the generated coupon for this appointment, if any
    if (appointment.generatedCouponCode) {
        const coupon = db.coupons.find(c => c.code === appointment.generatedCouponCode);
        if (coupon) {
            appointment.generatedCoupon = coupon;
        }
    }
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
  const { clientName, phone, ...appointmentData } = req.body;

  // Find or create client
  let client = db.clients.find(c => c.phone === phone);
  if (!client) {
    client = { id: Date.now(), name: clientName, phone };
    db.clients.push(client);
  }

  const newAppointment = { ...appointmentData, id: Date.now(), clientName, phone, clientId: client.id };

  // If a coupon was used, apply it
  if (newAppointment.couponCode) {
    const couponIndex = db.coupons.findIndex(c => c.code === newAppointment.couponCode && !c.used);
    if (couponIndex !== -1) {
      newAppointment.discount = db.coupons[couponIndex].discount;
      db.coupons[couponIndex].used = true;
    } else {
      newAppointment.couponCode = '';
      newAppointment.discount = 0;
    }
  }

  // If no coupon was used for this appointment, generate a new one
  if (!newAppointment.couponCode) {
    const couponTypes = [
        { type: 'discount', value: 15, description: '15% off your next service!' },
        { type: 'free_service', value: 'feet_gelish', description: 'Free Feet Gelish on your next visit!' },
        { type: 'free_service', value: 'manicure', description: 'Free Manicure on your next visit!' }
    ];
    const randomCouponType = couponTypes[Math.floor(Math.random() * couponTypes.length)];

    const coupon = {
      id: Date.now() + 1,
      clientId: client.id,
      code: `PROMO${Date.now()}`,
      description: randomCouponType.description,
      discount: randomCouponType.type === 'discount' ? randomCouponType.value : 0,
      type: randomCouponType.type,
      service: randomCouponType.type === 'free_service' ? randomCouponType.value : null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      used: false
    };
    db.coupons.push(coupon);
    newAppointment.generatedCouponCode = coupon.code;
    newAppointment.generatedCoupon = coupon;
  }

  db.appointments.push(newAppointment);
  await writeDb(db);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', async (req, res) => {
  const db = await readDb();
  const { id } = req.params;
  const updatedAppointmentData = req.body;
  const index = db.appointments.findIndex(a => a.id == id);
  if (index !== -1) {
    db.appointments[index] = { ...db.appointments[index], ...updatedAppointmentData };
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
app.get('/api/coupons', async (req, res) => {
    const db = await readDb();
    res.json(db.coupons.filter(c => !c.used));
});

app.post('/api/admin/coupons', async (req, res) => {
    const db = await readDb();
    const newCoupon = { ...req.body, id: Date.now(), used: false, clientId: null }; // Admin-created coupons are not tied to a client initially
    db.coupons.push(newCoupon);
    await writeDb(db);
    res.status(201).json(newCoupon);
});

app.post('/api/coupons/apply', async (req, res) => {
  const db = await readDb();
  const { code } = req.body;
  const coupon = db.coupons.find(c => c.code === code && !c.used);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found or already used' });
  }

  // For validation, just return the coupon details
  return res.json({ success: true, coupon });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin credentials for testing:`);
  console.log(`Username: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
}); 