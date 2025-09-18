const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

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