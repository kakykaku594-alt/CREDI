const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sourceType: { type: DataTypes.ENUM('credit_card', 'loan'), allowNull: false },
  sourceId: { type: DataTypes.UUID, allowNull: false }, // references CreditCard.id or Loan.id
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  // user-entered vs provider-verified are tracked separately per PRD sec. 18
  userStatus: { type: DataTypes.ENUM('upcoming', 'paid'), defaultValue: 'upcoming' },
  verifiedStatus: { type: DataTypes.ENUM('unverified', 'verified'), defaultValue: 'unverified' },
  paidAt: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'payments',
  timestamps: true,
});

Payment.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = Payment;
