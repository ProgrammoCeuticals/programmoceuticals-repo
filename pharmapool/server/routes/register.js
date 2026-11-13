const express = require('express');
const { body, validationResult } = require('express-validator');
const Registration = require('../models/Registration');

const router = express.Router();

const NIGERIAN_AMOUNT = 3000000;  // ₦30,000 in kobo
const INTERNATIONAL_AMOUNT = 5000; // $50 in cents

const validation = [
  body('surname').trim().notEmpty().withMessage('Surname is required'),
  body('firstname').trim().notEmpty().withMessage('First name is required'),
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('isPresenter').isIn(['Yes', 'No']).withMessage('Invalid value'),
  body('certificateName').trim().notEmpty().withMessage('Certificate name is required'),
  body('participationType').isIn(['nigerian', 'international']).withMessage('Invalid participation type'),
];

// POST /api/register
router.post('/', validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { surname, firstname, middlename, institution, department, email, phone, isPresenter, certificateName, participationType } = req.body;

  const isNigerian = participationType === 'nigerian';
  const amountDue = isNigerian ? NIGERIAN_AMOUNT : INTERNATIONAL_AMOUNT;
  const currency = isNigerian ? 'NGN' : 'USD';

  try {
    const registration = await Registration.create({
      surname, firstname, middlename: middlename || '',
      institution, department: department || '',
      email, phone, isPresenter, certificateName,
      participationType, amountDue, currency,
    });

    res.status(201).json({
      ok: true,
      registrationId: registration._id,
      email,
      amount: amountDue,
      currency,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ ok: false, error: 'Registration failed' });
  }
});

module.exports = router;
