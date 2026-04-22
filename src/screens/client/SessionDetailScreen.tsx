import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Session, fetchSessionById } from '../../services/sessions';
import { fetchResponsesForSession } from '../../services/responses';
import { ReflectionQuestionCard } from '../../components/client/ReflectionQuestionCard';

export function SessionDetailScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { clientUser } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [responses, setResponses] = useState<Record<string, { response_text: string | null; skip_reason: string | null; updated_at: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientUser || !sessionId) return;
    Promise.all([
      fetchSessionById(sessionId, clientUser.id),
      fetchResponsesForSession(sessionId, clientUser.id),
    ]).then(([s, r]) => {
      setSession(s);
      setResponses(r);
      setLoading(false);
    });
  }, [clientUser, sessionId]);

  if (loading) return <div className="inner-body"><p className="empty-note">Loading…</p></div>;
  if (!session) return <div className="inner-body"><p className="empty-note">Session not found.</p></div>;

  const sessionDate = session.session_date ?? session.created_at;
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fade-in">
      <div className="inner-hero">
        <button className="back-link" onClick={() => navigate('/journey')}>← Journey Map</button>
        <div className="inner-title">{formattedDate}</div>
      </div>
      <div className="inner-body">
        <div className="session-block">
          <span className="session-tag">Session Notes</span>
          <div className="session-notes">
            <span className="notes-label">From your guide</span>
            <div className="notes-text">{session.notes}</div>
          </div>
        </div>

        {session.reflection_questions && session.reflection_questions.length > 0 && (
          <div className="session-block">
            <span className="reflections-label">Reflection Questions</span>
            {session.reflection_questions.map(q => (
              <ReflectionQuestionCard
                key={q.id}
                questionId={q.id}
                questionText={q.question}
                initialResponse={responses[q.id]?.response_text}
                initialSkipReason={responses[q.id]?.skip_reason}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
