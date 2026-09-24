import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await login({ email, password });
      localStorage.setItem('cg_token', token);
      navigate('/dashboard');
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
          <h1>Welcome back</h1>
          <p className="sub">Log in to check your score and upcoming payments.</p>
          {state?.justVerified && <div className="notice">Mobile verified — you can log in now.</div>}
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="primary" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
          </form>
          <div className="link-row">New here? <button className="switch" onClick={() => navigate('/register')}>Create an account</button></div>
        </div>
        <div className="foot-note">Checking your own score through an authorized soft-inquiry method does not affect it.</div>
      </div>
    </div>
  );
}
