const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const User = require('./User');

const CreditCard = sequelize.define('CreditCard', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  cardName: { type: DataTypes.STRING, allowNull: false },
  issuer: { type: DataTypes.STRING, allowNull: false },
  lastFourDigits: { type: DataTypes.STRING(4), allowNull: false }, // never store full PAN/CVV
  creditLimit: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  statementBalance: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  minimumAmountDue: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  paymentDueDate: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  tableName: 'credit_cards',
  timestamps: true,
});

CreditCard.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = CreditCard;
