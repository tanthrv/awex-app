import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { clientUser } = useAuth();

  return (
    <div
      className="screen-welcome fade-in"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <div className="welcome-mark">AWE</div>

      <div className="welcome-title">
        Welcome{clientUser ? `, ${clientUser.name}` : ''} to Awareness &amp;<br />
        Alignment™ Coaching
      </div>

      <div className="welcome-body">
        <p>Congratulations on taking the first step on your <strong>AWExpedition</strong>.</p>
        <br />
        <p><strong>AWE</strong> is a wellbeing paradigm that stands for:</p>
      </div>

      <div className="welcome-awe" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%', maxWidth: 340, marginBottom: 24, fontFamily: 'inherit', fontSize: 'inherit', fontStyle: 'normal' }}>
        {[
          { letter: 'A', name: 'Awareness' },
          { letter: 'W', name: 'Wonder' },
          { letter: 'E', name: 'Embodied\nAlignment' },
        ].map(p => (
          <div
            key={p.letter}
            className="awe-pillar"
          >
            <span className="awe-pillar-letter">{p.letter}</span>
            <span className="awe-pillar-name" style={{ whiteSpace: 'pre-line' }}>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="welcome-body">
        <p>Wonder embraces <em>Why, Open, Novelty, Discovery, Experimentation &amp; Reflection.</em></p>
        <br />
        <p>
          This app is meant to help you hone your awareness and practice in between sessions.
          If you do not want to answer any particular question — just note whether you want more time,
          you're not comfortable answering, or you don't think the question is helpful to your journey.
        </p>
        <br />
        <p><strong>There are no wrong answers — only awareness.</strong></p>
      </div>

      <div className="welcome-awe">
        "I'm AWEsome" means I have awareness, wonder &amp; embodied alignment — on any kind of day.
      </div>

      <button className="welcome-btn" onClick={() => navigate('/home')}>
        Begin my expedition →
      </button>
    </div>
  );
}
