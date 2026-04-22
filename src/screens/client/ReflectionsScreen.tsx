import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ReflectionEntry,
  createReflectionEntry,
  fetchReflectionEntries,
  fetchReflectionPrompt,
} from '../../services/reflections';

export function ReflectionsScreen() {
  const { clientUser } = useAuth();
  const [prompt, setPrompt] = useState<string | null>(null);
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [entryText, setEntryText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    if (!clientUser) return;
    const [p, e] = await Promise.all([
      fetchReflectionPrompt(clientUser.id),
      fetchReflectionEntries(clientUser.id),
    ]);
    setPrompt(p);
    setEntries(e);
  };

  useEffect(() => { load(); }, [clientUser]);

  const handleSave = async () => {
    if (!clientUser || !entryText.trim()) return;
    setSaving(true);
    setError('');
    const { error: err } = await createReflectionEntry(clientUser.id, entryText.trim());
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      setEntryText('');
      load();
    }
  };

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fade-in">
      <div className="inner-hero">
        <div className="inner-title">Reflections</div>
        <div className="inner-sub">Your private journal</div>
      </div>
      <div className="inner-body">
        {prompt && (
          <div style={{ background: 'var(--cream)', border: '1px solid var(--mist)', borderLeft: '3px solid var(--gold)', padding: '14px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: 6 }}>Prompt from your guide</span>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: 'var(--bark)', lineHeight: 1.7, fontStyle: 'italic' }}>{prompt}</div>
          </div>
        )}

        <span className="journal-date">{today}</span>
        <textarea
          className="journal-input"
          placeholder="What's on your mind today…"
          value={entryText}
          onChange={e => setEntryText(e.target.value)}
        />
        {error && <div className="error-msg">{error}</div>}
        <button className="save-btn" onClick={handleSave} disabled={saving || !entryText.trim()}>
          {saving ? 'Saving…' : 'Save entry'}
        </button>

        {entries.length > 0 && (
          <>
            <span className="entries-label">Past entries</span>
            {entries.map(entry => (
              <div key={entry.id} className="journal-item" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                <div className="journal-item-date">{formatDate(entry.created_at)}</div>
                {expandedId === entry.id ? (
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'var(--bark)', lineHeight: 1.8, marginTop: 6 }}>
                    {entry.entry_text}
                  </div>
                ) : (
                  <div className="journal-item-preview">
                    {entry.entry_text.length > 80 ? entry.entry_text.slice(0, 80) + '…' : entry.entry_text}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
