require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const creditRoutes = require('./routes/creditRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
require('./jobs/reminderJob'); // starts the scheduled reminder job

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Basic API rate limiting — tune per-route limits separately for auth endpoints.
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use('/api/auth', authRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Keep error handler last so it catches errors from every route above.
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Credit Guide API listening on port ${PORT}`));

module.exports = app;
