const express = require('express');
const Registration = require('../models/Registration');
const emailService = require('../services/emailService');

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'pharmapool-admin-token';

// Middleware — verify token
function auth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) return res.status(401).json({ ok: false, error: 'Unauthorized' });
  next();
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ ok: false, error: 'Invalid password' });
  res.json({ ok: true, token: ADMIN_TOKEN });
});

// GET /api/admin/registrations
router.get('/registrations', auth, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;
    if (type) filter.participationType = type;
    if (search) {
      filter.$or = [
        { surname: new RegExp(search, 'i') },
        { firstname: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { institution: new RegExp(search, 'i') },
      ];
    }
    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, registrations });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to fetch registrations' });
  }
});

// GET /api/admin/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const [total, paid, pending_payment, pending_review, rejected, nigerian, international] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ paymentStatus: 'paid' }),
      Registration.countDocuments({ paymentStatus: 'pending_payment' }),
      Registration.countDocuments({ paymentStatus: 'pending_review' }),
      Registration.countDocuments({ paymentStatus: 'rejected' }),
      Registration.countDocuments({ participationType: 'nigerian', paymentStatus: 'paid' }),
      Registration.countDocuments({ participationType: 'international', paymentStatus: 'paid' }),
    ]);
    res.json({ ok: true, stats: { total, paid, pending_payment, pending_review, rejected, nigerian, international } });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to fetch stats' });
  }
});

// POST /api/admin/registrations/:id/approve
router.post('/registrations/:id/approve', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ ok: false, error: 'Not found' });
    registration.paymentStatus = 'paid';
    registration.paidAt = new Date();
    await registration.save();
    emailService.sendConfirmation(registration).catch(err => console.error('Email error:', err));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to approve' });
  }
});

// POST /api/admin/registrations/:id/reject
router.post('/registrations/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ ok: false, error: 'Not found' });
    registration.paymentStatus = 'rejected';
    await registration.save();
    emailService.sendRejection(registration, reason).catch(err => console.error('Email error:', err));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Failed to reject' });
  }
});

module.exports = router;
