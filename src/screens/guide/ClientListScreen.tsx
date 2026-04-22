import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClientUser } from '../../services/auth';
import { listClients } from '../../services/clients';
import { AddClientForm } from '../../components/guide/AddClientForm';

export function ClientListScreen() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const load = () => {
    listClients().then(data => {
      setClients(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>
      <div className="coach-hero" style={{ background: 'var(--bark)', padding: '28px 20px 20px' }}>
        <span className="coach-eyebrow">AWExpedition™</span>
        <div className="coach-title">Guide <em>Dashboard</em></div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <span className="coach-section-title">Clients</span>

        {loading && <p className="empty-note">Loading…</p>}

        {clients.map(client => (
          <div
            key={client.id}
            className="client-card"
            onClick={() => navigate(`/guide/${client.id}`)}
          >
            <div className="client-name">{client.name}</div>
            <div className="client-meta">Code: {client.access_code}</div>
          </div>
        ))}

        {!loading && clients.length === 0 && (
          <p className="empty-note">No clients yet. Add your first client below.</p>
        )}

        <button
          className="dashed-btn"
          onClick={() => setShowAddForm(f => !f)}
          style={{ marginTop: 16 }}
        >
          {showAddForm ? '— Cancel' : '+ Add Client'}
        </button>

        {showAddForm && (
          <AddClientForm onCreated={() => { setShowAddForm(false); load(); }} />
        )}
      </div>

      <div className="coach-actions">
        <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
      </div>
    </div>
  );
}
