const { Sequelize } = require('sequelize');

// Connection is read from DATABASE_URL (Postgres). Keep pool modest for a
// small deployment and raise it as usage grows (see PRD sec. 34, scalability).
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 10, min: 0, idle: 10000 },
});

module.exports = sequelize;
