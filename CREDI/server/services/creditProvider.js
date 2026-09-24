// Abstraction over the credit-bureau/provider API so the rest of the app
// never talks to a specific vendor directly. Swap fetchScore's internals for
// a real authorized provider in Phase 2 (PRD sec. 39) without touching callers.
//
// IMPORTANT (PRD sec. 1): never claim a check is a soft inquiry unless the
// provider explicitly confirms it. Always pass through provider.inquiryType.

async function fetchScore(userId) {
  // Mock implementation for MVP. Replace with an authenticated call to the
  // authorized credit bureau/provider, using the user's consented credentials.
  return {
    score: 742,
    scoreMin: 300,
    scoreMax: 900,
    provider: 'mock-provider',
    inquiryType: 'soft', // only set to 'soft' when the provider confirms it
    reportReference: `MOCK-${userId}-${Date.now()}`,
    retrievalStatus: 'success',
    factors: {
      paymentHistory: 92,
      creditUtilization: 61,
      creditAge: 48,
      creditMix: 70,
      recentEnquiries: 80,
    },
  };
}

module.exports = { fetchScore };
