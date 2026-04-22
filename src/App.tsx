import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClientLayout } from './components/layout/ClientLayout';
import { ClientRoute, GuideRoute } from './components/routing/ProtectedRoute';
import { LoginScreen } from './screens/LoginScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/client/HomeScreen';
import { JourneyMapScreen } from './screens/client/JourneyMapScreen';
import { SessionDetailScreen } from './screens/client/SessionDetailScreen';
import { ExperimentsScreen } from './screens/client/ExperimentsScreen';
import { ReflectionsScreen } from './screens/client/ReflectionsScreen';
import { AboutAWEScreen } from './screens/client/AboutAWEScreen';
import { ClientListScreen } from './screens/guide/ClientListScreen';
import { ClientDetailScreen } from './screens/guide/ClientDetailScreen';

function RootRedirect() {
  const { role, isLoading } = useAuth();
  if (isLoading) return <div />;
  if (role === 'client') return <Navigate to="/home" replace />;
  if (role === 'guide') return <Navigate to="/guide" replace />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />

      {/* Client-only: welcome (no layout) */}
      <Route path="/welcome" element={<ClientRoute><WelcomeScreen /></ClientRoute>} />

      {/* Client-only: wrapped in ClientLayout */}
      <Route element={<ClientRoute><ClientLayout /></ClientRoute>}>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/journey" element={<JourneyMapScreen />} />
        <Route path="/journey/:sessionId" element={<SessionDetailScreen />} />
        <Route path="/experiments" element={<ExperimentsScreen />} />
        <Route path="/reflections" element={<ReflectionsScreen />} />
        <Route path="/about" element={<AboutAWEScreen />} />
      </Route>

      {/* Guide-only */}
      <Route path="/guide" element={<GuideRoute><ClientListScreen /></GuideRoute>} />
      <Route path="/guide/:clientId" element={<GuideRoute><ClientDetailScreen /></GuideRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
