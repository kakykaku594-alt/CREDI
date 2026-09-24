const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, hashOtp, otpExpiry, deliverOtp, MAX_ATTEMPTS } = require('../services/otpService');

const SALT_ROUNDS = 12;

async function register(req, res, next) {
  try {
    const { fullName, email, mobile, password, dateOfBirth, consent } = req.body;

    if (!consent) {
      return res.status(400).json({ error: 'Consent to the privacy policy is required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const otpCode = generateOtp();

    const user = await User.create({
      fullName, email, mobile, passwordHash, dateOfBirth,
      consentGivenAt: new Date(),
      otpCodeHash: hashOtp(otpCode),
      otpExpiresAt: otpExpiry(),
      otpAttempts: 0,
    });

    await deliverOtp(mobile, otpCode);

    res.status(201).json({ id: user.id, email: user.email, mobile: user.mobile });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.isVerified) return res.json({ success: true, alreadyVerified: true });

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'This code has expired. Please request a new one.' });
    }
    if (user.otpAttempts >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }
    if (hashOtp(code) !== user.otpCodeHash) {
      await user.update({ otpAttempts: user.otpAttempts + 1 });
      return res.status(400).json({ error: "That code doesn't match. Please try again." });
    }

    await user.update({
      isVerified: true, otpCodeHash: null, otpExpiresAt: null, otpAttempts: 0,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.isVerified) return res.json({ success: true, alreadyVerified: true });

    const otpCode = generateOtp();
    await user.update({ otpCodeHash: hashOtp(otpCode), otpExpiresAt: otpExpiry(), otpAttempts: 0 });
    await deliverOtp(user.mobile, otpCode);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your mobile number before logging in.' });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  // Stateless JWT — client discards the token. If session/refresh-token
  // storage is added later, revoke it here.
  res.json({ success: true });
}

module.exports = { register, login, logout, verifyOtp, resendOtp };
