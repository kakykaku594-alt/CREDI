const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const {
  getCurrentScore, refreshScore, getHistory, getImprovementPlan,
} = require('../controllers/creditController');

router.use(requireAuth);
router.get('/score', getCurrentScore);
router.post('/score/refresh', refreshScore);
router.get('/score/history', getHistory);
router.get('/improvement-plan', getImprovementPlan);

module.exports = router;
