import { useState } from 'react';
import { Experiment, ExperimentLog, ExperimentStatus, upsertExperimentLog } from '../../services/experiments';
import { useAuth } from '../../context/AuthContext';

interface Props {
  experiment: Experiment;
  onUpdated?: () => void;
}

export function ExperimentCard({ experiment, onUpdated }: Props) {
  const { clientUser } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const todayLog = experiment.experiment_logs?.find(l => l.log_date === today);
  const [status, setStatus] = useState<ExperimentStatus | null>((todayLog?.status as ExperimentStatus) ?? null);
  const [note, setNote] = useState(todayLog?.note ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleStatus = async (s: ExperimentStatus) => {
    if (!clientUser) return;
    setStatus(s);
    if (s !== 'Something got in the way') {
      setSaving(true);
      setError('');
      const { error: err } = await upsertExperimentLog(experiment.id, clientUser.id, s);
      setSaving(false);
      if (err) setError(err);
      else onUpdated?.();
    }
  };

  const handleSaveNote = async () => {
    if (!clientUser || !status) return;
    setSaving(true);
    setError('');
    const { error: err } = await upsertExperimentLog(experiment.id, clientUser.id, status, note);
    setSaving(false);
    if (err) setError(err);
    else onUpdated?.();
  };

  const formatLogDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const statusClass = (s: ExperimentStatus) => {
    if (s === 'I did it') return 'did';
    if (s === 'I forgot') return 'forgot';
    return 'giw';
  };

  const sortedLogs = [...(experiment.experiment_logs ?? [])].sort(
    (a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
  );

  return (
    <div className="experiment-card">
      <div className="exp-name">{experiment.name}</div>
      {experiment.description && <div className="exp-desc">{experiment.description}</div>}

      <span className="tracker-label">Today's check-in</span>
      <div className="tracker-btns">
        <button
          className={`tracker-btn${status === 'I did it' ? ' did-it' : ''}`}
          onClick={() => handleStatus('I did it')}
          disabled={saving}
        >
          I did it
        </button>
        <button
          className={`tracker-btn${status === 'I forgot' ? ' forgot' : ''}`}
          onClick={() => handleStatus('I forgot')}
          disabled={saving}
        >
          I forgot
        </button>
        <button
          className={`tracker-btn${status === 'Something got in the way' ? ' got-in-way' : ''}`}
          onClick={() => handleStatus('Something got in the way')}
          disabled={saving}
        >
          Something got in the way
        </button>
      </div>

      {status === 'Something got in the way' && (
        <div className="got-in-way-prompt show">
          <span className="giw-label">What got in the way? (optional)</span>
          <textarea
            className="giw-input"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Describe what happened…"
          />
          <button className="save-btn" onClick={handleSaveNote} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {sortedLogs.length > 0 && (
        <div className="log-history">
          {sortedLogs.map((log: ExperimentLog) => (
            <div key={log.id} className="log-item">
              <span className="log-date">{formatLogDate(log.log_date)}</span>
              <div>
                <span className={`log-status ${statusClass(log.status as ExperimentStatus)}`}>{log.status}</span>
                {log.note && <div className="log-note">{log.note}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
