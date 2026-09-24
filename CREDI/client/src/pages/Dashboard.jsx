import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScore, refreshScore, getImprovementPlan } from '../api/credit';
import { getUpcomingPayments } from '../api/credit';

export default function Dashboard() {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [factors, setFactors] = useState(null);
  const [plan, setPlan] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let current;
        try {
          current = await getScore();
        } catch {
          // No score on file yet — fetch one from the provider.
          const result = await refreshScore();
          current = result.score;
          setFactors(result.factors);
        }
        setScore(current);

        const [planData, paymentsData] = await Promise.all([
          getImprovementPlan(),
          getUpcomingPayments(),
        ]);
        setPlan(planData);
        setPayments(paymentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem('cg_token');
    navigate('/login');
  };

  if (loading) return <div className="center"><p>Loading your dashboard…</p></div>;

  return (
    <>
      <header className="top">
        <div className="brand" style={{ marginBottom: 0 }}>Credit <span>Guide</span></div>
        <button className="switch" onClick={logout}>Log out</button>
      </header>
      <main className="dash">
        {error && <div className="error">{error}</div>}

        <div className="grid" style={{ marginBottom: 20 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ textAlign: 'left' }}>Your credit score</h2>
            <div className="score-num num">{score?.score ?? '—'}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              Range {score?.scoreMin ?? 300}–{score?.scoreMax ?? 900} · via {score?.provider}
            </div>
          </div>

          <div className="card">
            <h2>Credit health factors</h2>
            {factors ? Object.entries(factors).map(([key, val]) => (
              <div className="factor-row" key={key}>
                <span className="factor-name">{key.replace(/([A-Z])/g, ' $1')}</span>
                <div className="factor-track"><div className="factor-fill" style={{ width: `${val}%` }} /></div>
                <span className="num" style={{ width: 34, textAlign: 'right', fontSize: 13, color: 'var(--muted)' }}>{val}%</span>
              </div>
            )) : <p style={{ color: 'var(--muted)', fontSize: 13 }}>Factors load after your first score refresh.</p>}
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Upcoming payments</h2>
            {payments.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>No upcoming payments on file. Add a credit card or loan to start tracking.</p>}
            {payments.map((p) => (
              <div className="pay-item" key={p.id}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.sourceType === 'credit_card' ? 'Credit card' : 'Loan EMI'}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>Due {new Date(p.dueDate).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="num" style={{ fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2>Improvement plan</h2>
            {plan.map((item) => (
              <div key={item.factor} style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.factor} · {item.status}</div>
                <div style={{ fontSize: 14, marginTop: 3 }}>{item.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
