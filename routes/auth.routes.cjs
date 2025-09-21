const express = require('express');
const router = express.Router();
const { db, getInstanceData } = require('../db.cjs');

// --- Auth ---
const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const LONG_SESSION = 24 * 60 * 60 * 1000;
const SHORT_SESSION = 5 * 60 * 1000;

// Super Admin Login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username, isSuperAdmin: true };
    req.session.cookie.maxAge = LONG_SESSION;
    res.json({ username, isSuperAdmin: true });
  } else {
    res.status(401).json({ message: 'Invalid super admin credentials' });
  }
});

// Instance Admin Login
router.post('/:instanceId/login', async (req, res) => {
    const instanceData = await getInstanceData(req.params.instanceId);
    const { username, password } = req.body;
    const adminUser = instanceData.admins.find(admin => admin.username === username && admin.password === password);

    if (adminUser) {
        req.session.isAuthenticated = true;
        req.session.user = { username, isSuperAdmin: false, instanceId: req.params.instanceId };
        req.session.cookie.maxAge = LONG_SESSION;
        res.json({ username, isSuperAdmin: false, instanceId: req.params.instanceId });
    } else {
        res.status(401).json({ message: 'Invalid credentials for this instance.' });
    }
});

router.get('/admin/verify', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/admin/heartbeat', (req, res) => {
    if (req.session.isAuthenticated) {
        req.session.cookie.maxAge = LONG_SESSION;
        res.json({ status: 'session extended' });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

router.post('/admin/session/expire-soon', (req, res) => {
    if (req.session.isAuthenticated) {
        req.session.cookie.maxAge = SHORT_SESSION;
        res.json({ status: 'session will expire soon' });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

router.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) { res.status(500).json({ message: 'Error during logout' }); }
    else { res.json({ message: 'Logged out successfully' }); }
  });
});

module.exports = router;
