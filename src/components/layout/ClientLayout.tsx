import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/home', icon: '⌂', label: 'Home' },
  { path: '/journey', icon: '👣', label: 'Journey' },
  { path: '/experiments', icon: '🌱', label: 'Experiments' },
  { path: '/reflections', icon: '✏️', label: 'Reflections' },
];

export function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientUser, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-logo">AW<span>Expedition</span>™</div>
        <div className="topbar-right">
          <div className="topbar-name">{clientUser?.name}</div>
          <div className="topbar-logout" onClick={handleSignOut}>Sign out</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <Outlet />
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.map(item => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/journey' && location.pathname.startsWith('/journey'));
          return (
            <div
              key={item.path}
              className={`bnav-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="bnav-icon">{item.icon}</div>
              {item.label}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
