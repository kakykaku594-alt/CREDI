const CreditScore = require('../models/CreditScore');
const creditProvider = require('../services/creditProvider');
const { buildImprovementPlan } = require('../services/scoringAnalysis');

async function getCurrentScore(req, res, next) {
  try {
    const latest = await CreditScore.findOne({
      where: { userId: req.user.id },
      order: [['retrievedAt', 'DESC']],
    });

    if (!latest) {
      return res.status(404).json({ error: 'No credit score on file yet. Connect your credit provider to retrieve one.' });
    }

    res.json(latest);
  } catch (err) {
    next(err);
  }
}

async function refreshScore(req, res, next) {
  try {
    const result = await creditProvider.fetchScore(req.user.id);

    if (result.retrievalStatus !== 'success') {
      return res.status(502).json({ error: "We couldn't retrieve your latest credit information. Please try again later." });
    }

    const record = await CreditScore.create({
      userId: req.user.id,
      score: result.score,
      scoreMin: result.scoreMin,
      scoreMax: result.scoreMax,
      provider: result.provider,
      inquiryType: result.inquiryType,
      reportReference: result.reportReference,
      retrievalStatus: result.retrievalStatus,
      retrievedAt: new Date(),
    });

    res.status(201).json({ score: record, factors: result.factors });
  } catch (err) {
    next(err);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await CreditScore.findAll({
      where: { userId: req.user.id },
      order: [['retrievedAt', 'ASC']],
    });
    res.json(history);
  } catch (err) {
    next(err);
  }
}

async function getImprovementPlan(req, res, next) {
  try {
    // In a full implementation, factors would be read from the latest
    // stored credit report rather than re-fetched here.
    const result = await creditProvider.fetchScore(req.user.id);
    const plan = buildImprovementPlan(result.factors);
    res.json(plan);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrentScore, refreshScore, getHistory, getImprovementPlan };
