const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  surname: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  middlename: { type: String, trim: true, default: '' },
  institution: { type: String, required: true, trim: true },
  department: { type: String, trim: true, default: '' },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  isPresenter: { type: String, enum: ['Yes', 'No'], required: true },
  certificateName: { type: String, required: true, trim: true },
  participationType: { type: String, enum: ['nigerian', 'international'], required: true },
  amountDue: { type: Number, required: true }, // in kobo (NGN) or cents (USD)
  currency: { type: String, enum: ['NGN', 'USD'], required: true },
  paymentStatus: { type: String, enum: ['pending_payment', 'pending_review', 'paid', 'rejected'], default: 'pending_payment' },
  proofUrl: { type: String, default: null },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

registrationSchema.index({ email: 1 });
registrationSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
