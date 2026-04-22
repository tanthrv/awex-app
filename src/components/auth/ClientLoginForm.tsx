import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginClient } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

export function ClientLoginForm() {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !accessCode.trim()) return;
    setLoading(true);
    setError('');
    const { client, error: err } = await loginClient(name.trim(), accessCode.trim());
    setLoading(false);
    if (err || !client) {
      setError(err ?? 'Login failed');
      return;
    }
    signIn(client);
    navigate('/welcome');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 300 }}>
      <label className="field-label" htmlFor="client-name">Your first name</label>
      <input
        id="client-name"
        className="login-input"
        type="text"
        placeholder="Enter your name"
        autoComplete="off"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label className="field-label" htmlFor="client-code">Access code</label>
      <input
        id="client-code"
        className="login-input"
        type="text"
        placeholder="Your personal code"
        autoComplete="off"
        value={accessCode}
        onChange={e => setAccessCode(e.target.value)}
      />
      {error && <div className="login-error">{error}</div>}
      <button className="login-btn" type="submit" disabled={loading}>
        {loading ? 'Checking…' : 'Begin your expedition'}
      </button>
    </form>
  );
}
