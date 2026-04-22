import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginGuide } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

export function GuideLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInGuide } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    const { guide, error: err } = await loginGuide(email.trim(), password);
    setLoading(false);
    if (err || !guide) {
      setError(err ?? 'Login failed');
      return;
    }
    signInGuide(guide);
    navigate('/guide');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 300 }}>
      <label className="field-label" htmlFor="guide-email">Email</label>
      <input
        id="guide-email"
        className="login-input"
        type="email"
        placeholder="guide@example.com"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <label className="field-label" htmlFor="guide-password">Password</label>
      <input
        id="guide-password"
        className="login-input"
        type="password"
        placeholder="Your password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <div className="login-error">{error}</div>}
      <button className="login-btn" type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in as guide'}
      </button>
    </form>
  );
}
