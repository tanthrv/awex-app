import { useState } from 'react';
import { setReflectionPrompt, clearReflectionPrompt } from '../../services/reflections';

interface Props {
  clientId: string;
  currentPrompt: string | null;
  onUpdated: () => void;
}

export function ReflectionPromptForm({ clientId, currentPrompt, onUpdated }: Props) {
  const [promptText, setPromptText] = useState(currentPrompt ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setLoading(true);
    setError('');
    const { error: err } = await setReflectionPrompt(clientId, promptText.trim());
    setLoading(false);
    if (err) setError(err);
    else onUpdated();
  };

  const handleClear = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await clearReflectionPrompt(clientId);
    setLoading(false);
    if (err) setError(err);
    else {
      setPromptText('');
      onUpdated();
    }
  };

  return (
    <div>
      {currentPrompt && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--mist)', borderLeft: '3px solid var(--gold)', padding: '12px 14px', marginBottom: 12 }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 4 }}>Current prompt</span>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--bark)', fontStyle: 'italic' }}>{currentPrompt}</div>
        </div>
      )}
      <form onSubmit={handleSet}>
        <label className="form-label" htmlFor="prompt-text">Reflection prompt</label>
        <textarea
          id="prompt-text"
          className="coach-input"
          placeholder="Set a prompt for this client's journal…"
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          rows={3}
        />
        {error && <div className="error-msg">{error}</div>}
        <div className="btn-row">
          <button className="btn-sm btn-primary-sm" type="submit" disabled={loading || !promptText.trim()}>
            Set Prompt
          </button>
          {currentPrompt && (
            <button
              className="btn-sm"
              type="button"
              onClick={handleClear}
              disabled={loading}
              style={{ background: 'var(--mist)', color: 'var(--bark)' }}
            >
              Clear Prompt
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
