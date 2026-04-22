import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function HomeScreen() {
  const { clientUser } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fade-in">
      <div className="home-letter">
        <span className="home-eyebrow">{today}</span>
        <div className="home-greeting">
          Hello, <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{clientUser?.name}</em>
        </div>
      </div>

      <span className="section-eyebrow">Your expedition</span>

      <div className="nav-card" onClick={() => navigate('/journey')}>
        <div className="nav-icon-wrap">👣</div>
        <div>
          <div className="nav-card-title">Journey Map</div>
          <div className="nav-card-sub">Your session reflections</div>
        </div>
      </div>

      <div className="nav-card" onClick={() => navigate('/experiments')}>
        <div className="nav-icon-wrap">🌱</div>
        <div>
          <div className="nav-card-title">Experiments</div>
          <div className="nav-card-sub">AWE in Action</div>
        </div>
      </div>

      <div className="nav-card" onClick={() => navigate('/reflections')}>
        <div className="nav-icon-wrap">✏️</div>
        <div>
          <div className="nav-card-title">Reflections</div>
          <div className="nav-card-sub">Anything related to your journey today?</div>
        </div>
      </div>

      <div className="nav-card quiet" onClick={() => navigate('/about')} style={{ marginTop: 8, borderStyle: 'dashed' }}>
        <div className="nav-icon-wrap" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 300, color: 'var(--sand)' }}>✦</div>
        <div>
          <div className="nav-card-title" style={{ fontSize: '0.82rem', opacity: 0.7 }}>About AWE</div>
          <div className="nav-card-sub">Your expedition philosophy</div>
        </div>
      </div>
    </div>
  );
}
