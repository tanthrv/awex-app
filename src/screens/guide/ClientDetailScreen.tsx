import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClientDetail } from '../../services/clients';
import { ClientUser } from '../../services/auth';
import { SessionForm } from '../../components/guide/SessionForm';
import { ExperimentForm } from '../../components/guide/ExperimentForm';
import { ReflectionPromptForm } from '../../components/guide/ReflectionPromptForm';

type Tab = 'sessions' | 'experiments' | 'reflections';

interface SessionData {
  id: string;
  notes: string;
  session_date: string | null;
  created_at: string;
  reflection_questions?: Array<{
    id: string;
    question: string;
    reflection_responses?: Array<{
      response_text: string | null;
      skip_reason: string | null;
      updated_at: string;
    }>;
  }>;
}

interface ExperimentData {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  experiment_logs?: Array<{
    id: string;
    log_date: string;
    status: string;
    note: string | null;
    created_at: string;
  }>;
}

interface EntryData {
  id: string;
  entry_text: string;
  created_at: string;
}

interface PromptData {
  prompt_text: string | null;
}

export function ClientDetailScreen() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientUser | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [experiments, setExperiments] = useState<ExperimentData[]>([]);
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('sessions');
  const [loading, setLoading] = useState(true);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);

  const load = async () => {
    if (!clientId) return;
    const detail = await getClientDetail(clientId);
    setClient(detail.client);
    setSessions(detail.sessions as SessionData[]);
    setExperiments(detail.experiments as ExperimentData[]);
    setEntries(detail.reflectionEntries as EntryData[]);
    setPromptData(detail.reflectionPrompt as PromptData | null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [clientId]);

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatDateTime = (ts: string) =>
    new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="inner-body"><p className="empty-note">Loading…</p></div>;

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      <div className="detail-back">
        <button className="back-link" onClick={() => navigate('/guide')}>← Guide Dashboard</button>
      </div>
      <div className="detail-client-name">{client?.name}</div>
      <div className="detail-client-code">Access code: {client?.access_code}</div>

      <div className="exp-tabs">
        {(['sessions', 'experiments', 'reflections'] as Tab[]).map(tab => (
          <div
            key={tab}
            className={`exp-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="exp-panel active">
          <button className="dashed-btn" onClick={() => setShowSessionForm(f => !f)}>
            {showSessionForm ? '— Cancel' : '+ Add Session'}
          </button>
          {showSessionForm && (
            <div style={{ marginTop: 16 }}>
              <SessionForm clientId={clientId!} onCreated={() => { setShowSessionForm(false); load(); }} />
            </div>
          )}
          {sessions.length === 0 && <p className="empty-note" style={{ marginTop: 16 }}>No sessions yet.</p>}
          {sessions.map(session => (
            <div key={session.id} style={{ marginTop: 16, borderBottom: '1px solid var(--mist)', paddingBottom: 16 }}>
              <span className="session-tag">{formatDate(session.session_date ?? session.created_at)}</span>
              <div className="session-notes">
                <span className="notes-label">Notes</span>
                <div className="notes-text">{session.notes}</div>
              </div>
              {session.reflection_questions && session.reflection_questions.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <span className="reflections-label">Reflection Questions &amp; Responses</span>
                  {session.reflection_questions.map(q => (
                    <div key={q.id} className="response-card" style={{ marginBottom: 8 }}>
                      <div className="response-q">{q.question}</div>
                      {q.reflection_responses && q.reflection_responses.length > 0 ? (
                        q.reflection_responses.map((r, i) => (
                          <div key={i}>
                            {r.response_text && <div className="response-a">{r.response_text}</div>}
                            {r.skip_reason && <div className="response-a" style={{ fontStyle: 'italic', opacity: 0.6 }}>Skipped: {r.skip_reason}</div>}
                            <div className="response-date">{formatDateTime(r.updated_at)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="no-response">No response yet</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experiments Tab */}
      {activeTab === 'experiments' && (
        <div className="exp-panel active">
          <button className="dashed-btn" onClick={() => setShowExpForm(f => !f)}>
            {showExpForm ? '— Cancel' : '+ Add Experiment'}
          </button>
          {showExpForm && (
            <div style={{ marginTop: 16 }}>
              <ExperimentForm clientId={clientId!} onCreated={() => { setShowExpForm(false); load(); }} />
            </div>
          )}
          {experiments.length === 0 && <p className="empty-note" style={{ marginTop: 16 }}>No experiments yet.</p>}
          {experiments.map(exp => (
            <div key={exp.id} style={{ marginTop: 16, borderBottom: '1px solid var(--mist)', paddingBottom: 16 }}>
              <div className="exp-name">{exp.name}</div>
              {exp.description && <div className="exp-desc">{exp.description}</div>}
              <div style={{ fontSize: '0.68rem', color: exp.is_active ? 'var(--moss)' : 'var(--sand)', marginBottom: 8 }}>
                {exp.is_active ? 'Active' : 'Inactive'}
              </div>
              {exp.experiment_logs && exp.experiment_logs.length > 0 && (
                <div className="log-history">
                  <span className="tracker-label">Log history</span>
                  {exp.experiment_logs.map(log => (
                    <div key={log.id} className="log-item">
                      <span className="log-date">{formatDate(log.log_date)}</span>
                      <div>
                        <span className="log-status">{log.status}</span>
                        {log.note && <div className="log-note">{log.note}</div>}
                        <div style={{ fontSize: '0.62rem', color: 'var(--sand)', marginTop: 2 }}>{formatDateTime(log.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reflections Tab */}
      {activeTab === 'reflections' && (
        <div className="exp-panel active">
          <ReflectionPromptForm
            clientId={clientId!}
            currentPrompt={promptData?.prompt_text ?? null}
            onUpdated={load}
          />
          <div style={{ marginTop: 24 }}>
            <span className="coach-section-title">Journal Entries</span>
            {entries.length === 0 && <p className="empty-note">No journal entries yet.</p>}
            {entries.map(entry => (
              <div key={entry.id} className="response-card" style={{ marginBottom: 8 }}>
                <div className="response-date">{formatDateTime(entry.created_at)}</div>
                <div className="response-a">{entry.entry_text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
