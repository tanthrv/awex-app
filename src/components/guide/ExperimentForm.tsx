import { useState } from 'react';
import { createExperiment } from '../../services/experiments';

interface Props {
  clientId: string;
  onCreated: () => void;
}

export function ExperimentForm({ clientId, onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    const { error: err } = await createExperiment(clientId, name.trim(), description.trim() || undefined);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setName('');
      setDescription('');
      onCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="exp-name">Experiment name</label>
      <input
        id="exp-name"
        className="coach-text-input"
        type="text"
        placeholder="e.g. Morning gratitude practice"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label className="form-label" htmlFor="exp-desc">Description (optional)</label>
      <textarea
        id="exp-desc"
        className="coach-input"
        placeholder="Describe the experiment…"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
      />
      {error && <div className="error-msg">{error}</div>}
      <button className="save-btn" type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Saving…' : 'Add experiment'}
      </button>
    </form>
  );
}
