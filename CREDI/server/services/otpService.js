const crypto = require('crypto');

const OTP_TTL_MINUTES = 5;
const MAX_ATTEMPTS = 5;

function generateOtp() {
  return String(crypto.randomInt(100000, 999999)); // 6 digits
}

function hashOtp(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function otpExpiry() {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

// Sends the OTP via SMS/email provider. Swap this for a real provider
// (e.g. Twilio, MSG91) — never log the raw code in production.
async function deliverOtp(mobile, code) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[dev] OTP for ${mobile}: ${code}`);
  }
  // TODO: integrate SMS provider here.
}

module.exports = { generateOtp, hashOtp, otpExpiry, deliverOtp, MAX_ATTEMPTS };
