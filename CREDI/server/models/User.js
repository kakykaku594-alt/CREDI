const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mobile: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  mfaEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  consentGivenAt: { type: DataTypes.DATE, allowNull: true },
  otpCodeHash: { type: DataTypes.STRING, allowNull: true },
  otpExpiresAt: { type: DataTypes.DATE, allowNull: true },
  otpAttempts: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
