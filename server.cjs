const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { add, isAfter } = require('date-fns');
const app = express();

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

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

let coupons = [
    { code: 'SAVE10', discount: 10, createdAt: new Date(), usesLeft: 1 },
    { code: 'NAILS20', discount: 20, createdAt: new Date(), usesLeft: 1 }
];

let appointments = [];
let availability = {};

// Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username };
    req.session.lastActivity = Date.now();
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session error' });
      }
      res.json({ username });
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Verify endpoint
app.get('/api/admin/verify', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Error during logout' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

// Middleware to protect admin routes
const requireAdmin = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Coupon Management Endpoints
app.get('/api/coupons', requireAdmin, (req, res) => {
    res.json(coupons);
});

app.post('/api/coupons', requireAdmin, (req, res) => {
    const { code, discount } = req.body;
    if (!code || !discount) {
        return res.status(400).json({ message: 'Coupon code and discount are required' });
    }
    const newCoupon = {
        code,
        discount: parseInt(discount),
        createdAt: new Date(),
        usesLeft: 1
    };
    coupons.push(newCoupon);
    res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:code', requireAdmin, (req, res) => {
    const { code } = req.params;
    coupons = coupons.filter(coupon => coupon.code !== code);
    res.status(204).send();
});

// Availability and Appointment Endpoints
app.get('/api/availability', requireAdmin, (req, res) => {
    res.json(availability);
});

// PUBLIC: Get all dates that have at least one available slot
app.get('/api/availability/dates', (req, res) => {
    const availableDates = Object.keys(availability).filter(date => {
        const slots = availability[date].availableSlots;
        return Object.values(slots).some(isAvailable => isAvailable);
    });
    res.json(availableDates);
});

// PUBLIC: Get all available slots for a specific date
app.get('/api/availability/slots/:date', (req, res) => {
    const { date } = req.params;
    if (availability[date]) {
        const availableSlots = Object.entries(availability[date].availableSlots)
            .filter(([_, isAvailable]) => isAvailable)
            .map(([time, _]) => time);
        res.json(availableSlots);
    } else {
        res.json([]);
    }
});

app.post('/api/availability', requireAdmin, (req, res) => {
    const { date, time } = req.body;
    if (!date || !time) {
        return res.status(400).json({ message: 'Date and time are required' });
    }

    if (!availability[date]) {
        availability[date] = { isAvailable: true, availableSlots: {} };
    }

    availability[date].availableSlots[time] = true;
    res.status(201).json({ date, time });
});

app.delete('/api/availability', requireAdmin, (req, res) => {
    const { date, time } = req.body;
    if (!date || !time) {
        return res.status(400).json({ message: 'Date and time are required' });
    }

    if (availability[date] && availability[date].availableSlots[time]) {
        delete availability[date].availableSlots[time];
    }

    res.status(204).send();
});

app.get('/api/appointments', requireAdmin, (req, res) => {
    res.json(appointments);
});

app.post('/api/appointments', (req, res) => {
    const { date, time, clientName, phone, status, image, couponCode } = req.body;

    if (!date || !time || !clientName || !phone) {
        return res.status(400).json({ message: 'Missing required appointment data' });
    }

    if (couponCode) {
        const couponIndex = coupons.findIndex(c => c.code === couponCode);
        if (couponIndex === -1) {
            return res.status(400).json({ message: 'Invalid coupon code' });
        }

        const coupon = coupons[couponIndex];

        const expirationDate = add(coupon.createdAt, { weeks: 1 });
        if (isAfter(new Date(), expirationDate)) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.usesLeft <= 0) {
            return res.status(400).json({ message: 'Coupon has already been used' });
        }

        coupons[couponIndex].usesLeft -= 1;
    }

    const newAppointment = { id: Date.now(), date, time, clientName, phone, status, image, couponCode, notes: [] };
    appointments.push(newAppointment);

    if (availability[date] && availability[date].availableSlots[time]) {
        availability[date].availableSlots[time] = false;
    }

    res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const { clientName, status, profit, materials, notes } = req.body;
    const appointmentIndex = appointments.findIndex(appt => appt.id == id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    if (clientName) appointments[appointmentIndex].clientName = clientName;
    if (status) appointments[appointmentIndex].status = status;
    if (profit) appointments[appointmentIndex].profit = profit;
    if (materials) appointments[appointmentIndex].materials = materials;
    if (notes) appointments[appointmentIndex].notes = notes;

    res.json(appointments[appointmentIndex]);
});

app.delete('/api/appointments/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const appointmentIndex = appointments.findIndex(appt => appt.id == id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    const [deletedAppointment] = appointments.splice(appointmentIndex, 1);

    if (availability[deletedAppointment.date] && availability[deletedAppointment.date].availableSlots[deletedAppointment.time] === false) {
        availability[deletedAppointment.date].availableSlots[deletedAppointment.time] = true;
    }

    res.status(204).send();
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
