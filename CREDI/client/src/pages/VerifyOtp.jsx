import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/auth';

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const mobile = state?.mobile;

  const [digits, setDigits] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const onDigit = (i, val) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    if (clean && inputs.current[i + 1]) inputs.current[i + 1].focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && inputs.current[i - 1]) inputs.current[i - 1].focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) return setError('Enter all 6 digits.');

    setLoading(true);
    setError('');
    try {
      await verifyOtp({ email, code });
      navigate('/login', { state: { justVerified: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await resendOtp({ email });
      setSeconds(30);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="center">
      <div className="wrap">
        <div className="brand">Credit <span>Guide</span></div>
        <div className="panel">
          <h1>Verify your mobile</h1>
          <p className="sub">Enter the 6-digit code sent to <strong>{mobile}</strong></p>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            <div className="otp-boxes">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => onDigit(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                />
              ))}
            </div>
            <div className="link-row" style={{ marginBottom: 20 }}>
              {seconds > 0
                ? <span>Resend code in {seconds}s</span>
                : <>Didn't get it? <button type="button" className="switch" onClick={resend}>Resend code</button></>}
            </div>
            <button className="primary" disabled={loading}>{loading ? 'Verifying…' : 'Verify and continue'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
