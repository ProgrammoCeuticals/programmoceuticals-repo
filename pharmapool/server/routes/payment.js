const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const Registration = require('../models/Registration');
const emailService = require('../services/emailService');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'proof'));
    }
    cb(null, true);
  },
});

function uploadProof(req, res, next) {
  upload.single('proof')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'Proof file must be 5MB or smaller'
        : 'Proof must be a JPG, PNG, WEBP, GIF, or PDF file';
      return res.status(400).json({ ok: false, error: message });
    }
    return res.status(400).json({ ok: false, error: 'Invalid proof upload' });
  });
}

function uploadBufferToCloudinary(file, registrationId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'pharmapool/proofs',
        public_id: `${registrationId}-${Date.now()}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

// POST /api/payment/proof
// Receives proof file and uploads it to Cloudinary from the server.
router.post('/proof', uploadProof, async (req, res) => {
  const { registrationId } = req.body;
  if (!registrationId || !req.file) {
    return res.status(400).json({ ok: false, error: 'registrationId and proof file are required' });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ ok: false, error: 'Cloudinary is not configured' });
  }

  try {
    const registration = await Registration.findById(registrationId);
    if (!registration) return res.status(404).json({ ok: false, error: 'Registration not found' });
    if (registration.paymentStatus === 'paid') {
      return res.status(400).json({ ok: false, error: 'Already paid' });
    }

    const uploadResult = await uploadBufferToCloudinary(req.file, registration._id.toString());

    registration.proofUrl = uploadResult.secure_url;
    registration.paymentStatus = 'pending_review';
    await registration.save();

    emailService.sendProofReceived(registration).catch(err => console.error('Email error:', err));
    emailService.sendAdminNotification(registration).catch(err => console.error('Email error:', err));

    res.json({ ok: true });
  } catch (err) {
    console.error('Proof upload error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to save proof' });
  }
});

module.exports = router;
