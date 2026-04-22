import { useState } from 'react';
import { createClient } from '../../services/clients';

interface Props {
  onCreated: () => void;
}

export function AddClientForm({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !accessCode.trim()) return;
    setLoading(true);
    setError('');
    const { error: err } = await createClient(name.trim(), accessCode.trim());
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setName('');
      setAccessCode('');
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label className="form-label" htmlFor="new-client-name">Client name</label>
      <input
        id="new-client-name"
        className="coach-text-input"
        type="text"
        placeholder="Client's first name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label className="form-label" htmlFor="new-client-code">Access code</label>
      <input
        id="new-client-code"
        className="coach-text-input"
        type="text"
        placeholder="Unique access code"
        value={accessCode}
        onChange={e => setAccessCode(e.target.value)}
      />
      {error && <div className="error-msg">{error}</div>}
      <button className="save-btn" type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Add client'}
      </button>
    </form>
  );
}
