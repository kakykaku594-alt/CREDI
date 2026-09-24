const CreditCard = require('../models/CreditCard');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

async function addCreditCard(req, res, next) {
  try {
    const card = await CreditCard.create({ ...req.body, userId: req.user.id });
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

async function addLoan(req, res, next) {
  try {
    const loan = await Loan.create({ ...req.body, userId: req.user.id });
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
}

async function listUpcoming(req, res, next) {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id, userStatus: 'upcoming' },
      order: [['dueDate', 'ASC']],
    });
    res.json(payments);
  } catch (err) {
    next(err);
  }
}

async function markPaid(req, res, next) {
  try {
    const payment = await Payment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });

    payment.userStatus = 'paid';
    payment.paidAt = new Date();
    await payment.save();

    res.json(payment);
  } catch (err) {
    next(err);
  }
}

module.exports = { addCreditCard, addLoan, listUpcoming, markPaid };
