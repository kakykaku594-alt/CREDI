const Notification = require('../models/Notification');

// Creates an in-app notification record and (for now) logs channel dispatch.
// Wire real email/web-push providers here in Phase 2 (PRD sec. 17).
async function sendPaymentReminder({ userId, title, body, channel = 'in_app', relatedPaymentId }) {
  const notification = await Notification.create({
    userId, title, body, channel, relatedPaymentId, sentAt: new Date(),
  });

  if (channel === 'email') {
    // TODO: integrate transactional email provider
  }
  if (channel === 'browser') {
    // TODO: integrate Web Push
  }

  return notification;
}

module.exports = { sendPaymentReminder };
