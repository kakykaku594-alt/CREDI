// Turns raw credit factors into plain-language recommendations.
// Per PRD sec. 20/41: never promise a specific future score.

function statusFromPercent(pct) {
  if (pct >= 80) return 'Good';
  if (pct >= 55) return 'Moderate';
  return 'Needs attention';
}

function buildImprovementPlan(factors) {
  const rules = [
    {
      key: 'paymentHistory',
      label: 'Payment history',
      recommend: (status) => status === 'Good'
        ? 'Continue paying before the due date — this is your strongest factor.'
        : 'Set up reminders so upcoming payments are never missed.',
    },
    {
      key: 'creditUtilization',
      label: 'Credit utilization',
      recommend: (status) => status === 'Good'
        ? 'Keep balances well below your limit.'
        : 'Consider reducing revolving balances below 30% of your limit.',
    },
    {
      key: 'creditAge',
      label: 'Credit age',
      recommend: () => 'Maintain older accounts in good standing rather than closing them.',
    },
    {
      key: 'creditMix',
      label: 'Credit mix',
      recommend: (status) => status === 'Good'
        ? 'Your mix of credit types looks healthy.'
        : 'A healthy mix of credit types can help over time — no need to force new accounts.',
    },
    {
      key: 'recentEnquiries',
      label: 'Recent enquiries',
      recommend: (status) => status === 'Good'
        ? 'Enquiry activity looks fine.'
        : 'Avoid unnecessary applications for new credit in the near term.',
    },
  ];

  return rules.map(rule => {
    const pct = factors[rule.key] ?? 0;
    const status = statusFromPercent(pct);
    return {
      factor: rule.label,
      status,
      recommendation: rule.recommend(status),
    };
  });
}

module.exports = { buildImprovementPlan };
