import { useState } from 'react';
import { SkipReason, upsertReflectionResponse } from '../../services/responses';
import { useAuth } from '../../context/AuthContext';

const SKIP_REASONS: SkipReason[] = ['Need more time', 'Not comfortable yet', 'Not resonating'];

interface Props {
  questionId: string;
  questionText: string;
  initialResponse?: string | null;
  initialSkipReason?: string | null;
}

export function ReflectionQuestionCard({ questionId, questionText, initialResponse, initialSkipReason }: Props) {
  const { clientUser } = useAuth();
  const [responseText, setResponseText] = useState(initialResponse ?? '');
  const [skipReason, setSkipReason] = useState<SkipReason | null>((initialSkipReason as SkipReason) ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleResponseChange = (val: string) => {
    setResponseText(val);
    if (val) setSkipReason(null);
  };

  const handleSkipReason = (reason: SkipReason) => {
    if (skipReason === reason) {
      setSkipReason(null);
    } else {
      setSkipReason(reason);
      setResponseText('');
    }
  };

  const handleSave = async () => {
    if (!clientUser) return;
    setSaving(true);
    setError('');
    const { error: err } = await upsertReflectionResponse(
      questionId,
      clientUser.id,
      responseText || null,
      skipReason
    );
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="question-card">
      <div className="question-text">{questionText}</div>
      <textarea
        className="response-input"
        placeholder="Write your reflection here…"
        value={responseText}
        onChange={e => handleResponseChange(e.target.value)}
        rows={4}
      />
      <div className="skip-row">
        <span className="skip-label">Skip:</span>
        {SKIP_REASONS.map(reason => (
          <span
            key={reason}
            className={`skip-chip show${skipReason === reason ? ' selected' : ''}`}
            onClick={() => handleSkipReason(reason)}
          >
            {reason}
          </span>
        ))}
      </div>
      {error && <div className="error-msg">{error}</div>}
      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  );
}
