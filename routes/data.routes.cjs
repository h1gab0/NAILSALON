const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows us to access :instanceId from the parent router
const { db, getInstanceData } = require('../db.cjs');

const requireAdmin = (req, res, next) => {
    if (req.session.isAuthenticated) { next(); }
    else { res.status(401).json({ message: 'Unauthorized' }); }
};

// Middleware to get instance data and attach to request
const instanceMiddleware = async (req, res, next) => {
    req.instanceData = await getInstanceData(req.params.instanceId);
    next();
};

router.use(instanceMiddleware);

// --- Coupon Management ---
router.get('/coupons', requireAdmin, (req, res) => {
    res.json(req.instanceData.coupons);
});

router.post('/coupons', requireAdmin, async (req, res) => {
    const { code, discount, usesLeft, expiresAt } = req.body;
    if (!code || !discount || !usesLeft || !expiresAt) {
        return res.status(400).json({ message: 'All coupon fields are required' });
    }
    const newCoupon = { code, discount: parseInt(discount), usesLeft: parseInt(usesLeft), expiresAt };
    req.instanceData.coupons.push(newCoupon);
    await db.write();
    res.status(201).json(newCoupon);
});

router.put('/coupons/:code', requireAdmin, async (req, res) => {
    const { code } = req.params;
    const { usesLeft, expiresAt } = req.body;
    const couponIndex = req.instanceData.coupons.findIndex(c => c.code === code);

    if (couponIndex === -1) return res.status(404).json({ message: 'Coupon not found' });

    if (usesLeft !== undefined) {
        const newUses = parseInt(usesLeft);
        if (newUses < 0) return res.status(400).json({ message: 'Coupon uses cannot be negative.' });
        req.instanceData.coupons[couponIndex].usesLeft = newUses;
    }
    if (expiresAt) req.instanceData.coupons[couponIndex].expiresAt = expiresAt;

    await db.write();
    res.json(req.instanceData.coupons[couponIndex]);
});

router.delete('/coupons/:code', requireAdmin, async (req, res) => {
    const { code } = req.params;
    req.instanceData.coupons = req.instanceData.coupons.filter(coupon => coupon.code !== code);
    await db.write();
    res.status(204).send();
});

// --- Availability ---
router.get('/availability/dates', (req, res) => {
    const availableDates = Object.keys(req.instanceData.availability).filter(date => {
        const slots = req.instanceData.availability[date].availableSlots;
        return Object.values(slots).some(isAvailable => isAvailable);
    });
    res.json(availableDates);
});

router.get('/availability/slots/:date', (req, res) => {
    const { date } = req.params;
    if (req.instanceData.availability[date]) {
        const availableSlots = Object.entries(req.instanceData.availability[date].availableSlots)
            .filter(([_, isAvailable]) => isAvailable)
            .map(([time, _]) => time);
        res.json(availableSlots);
    } else {
        res.json([]);
    }
});

router.post('/availability', requireAdmin, async (req, res) => {
    const { date, time } = req.body;
    if (!date || !time) return res.status(400).json({ message: 'Date and time are required' });

    if (!req.instanceData.availability[date]) {
        req.instanceData.availability[date] = { isAvailable: true, availableSlots: {} };
    }
    req.instanceData.availability[date].availableSlots[time] = true;
    await db.write();
    res.status(201).json({ date, time });
});

// --- Appointments ---
router.get('/appointments', requireAdmin, (req, res) => {
    res.json(req.instanceData.appointments);
});

router.get('/appointments/:id', (req, res) => {
    const { id } = req.params;
    const appointment = req.instanceData.appointments.find(appt => appt.id == id);
    if (appointment) {
        res.json(appointment);
    } else {
        res.status(404).json({ message: 'Appointment not found' });
    }
});

router.post('/appointments', async (req, res) => {
    const { date, time, clientName, phone, status, image, couponCode } = req.body;

    if (!date || !time || !clientName || !phone) {
        return res.status(400).json({ message: 'Missing required appointment data' });
    }

    if (couponCode) {
        const couponIndex = req.instanceData.coupons.findIndex(c => c.code === couponCode);
        if (couponIndex === -1) return res.status(400).json({ message: 'Invalid coupon code' });

        const coupon = req.instanceData.coupons[couponIndex];
        if (new Date() > new Date(coupon.expiresAt)) return res.status(400).json({ message: 'Coupon has expired' });
        if (coupon.usesLeft <= 0) return res.status(400).json({ message: 'Coupon has already been used' });

        req.instanceData.coupons[couponIndex].usesLeft -= 1;
    }

    const newAppointment = { id: Date.now(), date, time, clientName, phone, status, image, couponCode, notes: [] };
    req.instanceData.appointments.push(newAppointment);

    if (req.instanceData.availability[date] && req.instanceData.availability[date].availableSlots[time]) {
        req.instanceData.availability[date].availableSlots[time] = false;
    }

    await db.write();
    res.status(201).json(newAppointment);
});

router.delete('/appointments/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const appointmentIndex = req.instanceData.appointments.findIndex(appt => appt.id == id);

    if (appointmentIndex === -1) return res.status(404).json({ message: 'Appointment not found' });

    const [deletedAppointment] = req.instanceData.appointments.splice(appointmentIndex, 1);
    if (req.instanceData.availability[deletedAppointment.date] && req.instanceData.availability[deletedAppointment.date].availableSlots[deletedAppointment.time] === false) {
        req.instanceData.availability[deletedAppointment.date].availableSlots[deletedAppointment.time] = true;
    }
    await db.write();
    res.status(204).send();
});

module.exports = router;
