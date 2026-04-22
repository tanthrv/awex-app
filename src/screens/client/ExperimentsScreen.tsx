import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Experiment, fetchActiveExperimentsForClient } from '../../services/experiments';
import { ExperimentCard } from '../../components/client/ExperimentCard';

export function ExperimentsScreen() {
  const { clientUser } = useAuth();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!clientUser) return;
    fetchActiveExperimentsForClient(clientUser.id).then(data => {
      setExperiments(data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [clientUser]);

  return (
    <div className="fade-in">
      <div className="inner-hero">
        <div className="inner-title">Experiments</div>
        <div className="inner-sub">AWE in Action</div>
      </div>
      <div className="inner-body">
        {loading && <p className="empty-note">Loading…</p>}
        {!loading && experiments.length === 0 && (
          <p className="empty-note">Your guide hasn't assigned any experiments yet.</p>
        )}
        {experiments.map(exp => (
          <ExperimentCard key={exp.id} experiment={exp} onUpdated={load} />
        ))}
      </div>
    </div>
  );
}
