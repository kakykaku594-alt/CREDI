const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const {
  addCreditCard, addLoan, listUpcoming, markPaid,
} = require('../controllers/paymentController');

router.use(requireAuth);
router.post('/credit-cards', addCreditCard);
router.post('/loans', addLoan);
router.get('/upcoming', listUpcoming);
router.patch('/:id/mark-paid', markPaid);

module.exports = router;
