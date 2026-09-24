const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const User = require('./User');

const Loan = sequelize.define('Loan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  loanType: { type: DataTypes.STRING, allowNull: false }, // personal, vehicle, education, home, other
  lender: { type: DataTypes.STRING, allowNull: false },
  emiAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  emiDueDate: { type: DataTypes.DATEONLY, allowNull: false },
  frequency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'monthly' },
  tenureMonths: { type: DataTypes.INTEGER, allowNull: true },
  remainingInstallments: { type: DataTypes.INTEGER, allowNull: true },
  loanReference: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'loans',
  timestamps: true,
});

Loan.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

module.exports = Loan;
