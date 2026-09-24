import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', password: '', dateOfBirth: '' });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!consent) return setError('Please accept the terms and privacy policy to continue.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');

    setLoading(true);
    try {
      await register({ ...form, consent });
      navigate('/verify-otp', { state: { email: form.email, mobile: form.mobile } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <div className="wrap">
        <div className="brand">Credit <span>Guide</span></div>
        <div className="panel">
          <h1>Create your account</h1>
          <p className="sub">Takes about a minute. We'll verify your mobile next.</p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Full name</label>
              <input value={form.fullName} onChange={update('fullName')} placeholder="As per your credit report" required />
            </div>
            <div className="row2">
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label>Mobile number</label>
                <input type="tel" value={form.mobile} onChange={update('mobile')} placeholder="98765 43210" required />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={update('password')} placeholder="At least 8 characters" required />
            </div>
            <div className="field">
              <label>Date of birth</label>
              <input type="date" value={form.dateOfBirth} onChange={update('dateOfBirth')} />
            </div>
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to the Terms and Privacy Policy, and consent to Credit Guide retrieving my credit information through an authorized provider.</span>
            </label>
            <button className="primary" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          </form>
          <div className="link-row">Already have an account? <button className="switch" onClick={() => navigate('/login')}>Log in</button></div>
        </div>
      </div>
    </div>
  );
}
