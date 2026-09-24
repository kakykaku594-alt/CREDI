const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  channel: { type: DataTypes.ENUM('in_app', 'browser', 'email'), allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  relatedPaymentId: { type: DataTypes.UUID, allowNull: true },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  sentAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'notifications',
  timestamps: true,
});

Notification.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = Notification;
