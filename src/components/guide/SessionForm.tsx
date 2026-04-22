import { useState } from 'react';
import { createSession, addReflectionQuestion } from '../../services/sessions';

interface Props {
  clientId: string;
  onCreated: () => void;
}

export function SessionForm({ clientId, onCreated }: Props) {
  const [notes, setNotes] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => setQuestions(q => [...q, '']);
  const removeQuestion = (i: number) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, val: string) =>
    setQuestions(q => q.map((v, idx) => (idx === i ? val : v)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    setLoading(true);
    setError('');

    const { session, error: sessionErr } = await createSession(clientId, notes.trim(), sessionDate || undefined);
    if (sessionErr || !session) {
      setError(sessionErr ?? 'Failed to create session');
      setLoading(false);
      return;
    }

    const validQuestions = questions.filter(q => q.trim());
    for (const q of validQuestions) {
      await addReflectionQuestion(session.id, clientId, q.trim());
    }

    setLoading(false);
    setNotes('');
    setSessionDate('');
    setQuestions(['']);
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="session-date">Session date (optional)</label>
      <input
        id="session-date"
        className="coach-text-input"
        type="date"
        value={sessionDate}
        onChange={e => setSessionDate(e.target.value)}
      />

      <label className="form-label" htmlFor="session-notes">Session notes</label>
      <textarea
        id="session-notes"
        className="coach-input"
        placeholder="Notes from this session…"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={4}
      />

      <div style={{ marginTop: 16 }}>
        <span className="form-label">Reflection questions</span>
        {questions.map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              className="coach-text-input"
              style={{ marginBottom: 0, flex: 1 }}
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q}
              onChange={e => updateQuestion(i, e.target.value)}
            />
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                style={{ background: 'none', border: '1px solid var(--mist)', padding: '0 10px', cursor: 'pointer', color: 'var(--sand)', fontSize: '0.8rem' }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button type="button" className="dashed-btn" onClick={addQuestion}>
          + Add question
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      <button className="save-btn" type="submit" disabled={loading || !notes.trim()}>
        {loading ? 'Saving…' : 'Save session'}
      </button>
    </form>
  );
}
