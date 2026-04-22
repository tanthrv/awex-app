import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ClientRoute: redirects to /login if role !== 'client' and not loading
export function ClientRoute({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useAuth();
  if (isLoading) return <div />;
  if (role !== 'client') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// GuideRoute: redirects to /login if role !== 'guide' and not loading
export function GuideRoute({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useAuth();
  if (isLoading) return <div />;
  if (role !== 'guide') return <Navigate to="/login" replace />;
  return <>{children}</>;
}
