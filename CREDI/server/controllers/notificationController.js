const Notification = require('../models/Notification');

async function list(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found.' });

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead };
