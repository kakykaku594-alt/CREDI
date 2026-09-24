const cron = require('node-cron');
const { Op } = require('sequelize');
const Payment = require('../models/Payment');
const { sendPaymentReminder } = require('../services/notificationService');

const REMINDER_WINDOWS_DAYS = [7, 5, 3, 1, 0]; // 0 = due date

function daysUntil(date) {
  const ms = new Date(date) - new Date(new Date().toDateString());
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Runs once a day. For larger scale, move this to a queue (BullMQ) so
// reminder generation doesn't block on a single process (PRD sec. 34).
cron.schedule('0 8 * * *', async () => {
  const upcoming = await Payment.findAll({ where: { userStatus: 'upcoming' } });

  for (const payment of upcoming) {
    const remaining = daysUntil(payment.dueDate);
    if (!REMINDER_WINDOWS_DAYS.includes(remaining)) continue;

    const body = remaining === 0
      ? 'Your payment is due today. Please verify your payment status.'
      : `Your payment of ₹${payment.amount} is due in ${remaining} day${remaining === 1 ? '' : 's'}.`;

    await sendPaymentReminder({
      userId: payment.userId,
      title: 'Upcoming payment',
      body,
      channel: 'in_app',
      relatedPaymentId: payment.id,
    });
  }
});

module.exports = {}; // side-effect module; imported for its cron.schedule call
