import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Session, fetchSessionsForClient } from '../../services/sessions';

export function JourneyMapScreen() {
  const { clientUser } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientUser) return;
    fetchSessionsForClient(clientUser.id).then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, [clientUser]);

  const formatDate = (s: Session) => {
    const d = s.session_date ?? s.created_at;
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fade-in">
      <div className="inner-hero">
        <div className="inner-title">Journey <em>Map</em></div>
        <div className="inner-sub">Your session reflections</div>
      </div>
      <div className="inner-body">
        {loading && <p className="empty-note">Loading…</p>}
        {!loading && sessions.length === 0 && (
          <p className="empty-note">Your guide hasn't added any sessions yet.</p>
        )}
        {sessions.map(session => (
          <div
            key={session.id}
            className="path-card"
            onClick={() => navigate(`/journey/${session.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="path-dot" />
              <div>
                <div className="path-name">{formatDate(session)}</div>
                <div className="path-meta">
                  {session.notes.length > 60 ? session.notes.slice(0, 60) + '…' : session.notes}
                </div>
              </div>
            </div>
            <div className="path-arrow">›</div>
          </div>
        ))}
      </div>
    </div>
  );
}
