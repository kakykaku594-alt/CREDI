const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const User = require('./User');

const CreditScore = sequelize.define('CreditScore', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  score: { type: DataTypes.INTEGER, allowNull: false },
  scoreMin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 300 },
  scoreMax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 900 },
  provider: { type: DataTypes.STRING, allowNull: false }, // e.g. CIBIL, Experian, mock-provider
  inquiryType: { type: DataTypes.ENUM('soft', 'hard'), allowNull: false, defaultValue: 'soft' },
  reportReference: { type: DataTypes.STRING, allowNull: true },
  retrievalStatus: { type: DataTypes.ENUM('success', 'failed', 'pending'), defaultValue: 'success' },
  retrievedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'credit_scores',
  timestamps: true,
});

CreditScore.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = CreditScore;
