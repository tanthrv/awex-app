import { supabase } from '../lib/supabase';

export type ExperimentStatus = 'I did it' | 'I forgot' | 'Something got in the way';

export interface ExperimentLog {
  id: string;
  experiment_id: string;
  client_id: string;
  log_date: string;
  status: ExperimentStatus;
  note: string | null;
  created_at: string;
}

export interface Experiment {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  experiment_logs?: ExperimentLog[];
}

export async function createExperiment(
  clientId: string,
  name: string,
  description?: string
): Promise<{ experiment: Experiment | null; error: string | null }> {
  try {
    const payload: Record<string, unknown> = { client_id: clientId, name };
    if (description) payload.description = description;

    const { data, error } = await supabase
      .from('experiments')
      .insert(payload)
      .select()
      .single();

    if (error || !data) return { experiment: null, error: error?.message ?? 'Failed to create experiment' };
    return { experiment: data as Experiment, error: null };
  } catch (e: unknown) {
    return { experiment: null, error: e instanceof Error ? e.message : 'Failed to create experiment' };
  }
}

export async function fetchExperimentsForClient(clientId: string): Promise<Experiment[]> {
  try {
    const { data, error } = await supabase
      .from('experiments')
      .select('*, experiment_logs(*)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Experiment[];
  } catch {
    return [];
  }
}

export async function fetchActiveExperimentsForClient(clientId: string): Promise<Experiment[]> {
  try {
    const { data, error } = await supabase
      .from('experiments')
      .select('*, experiment_logs(*)')
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Experiment[];
  } catch {
    return [];
  }
}

export async function upsertExperimentLog(
  experimentId: string,
  clientId: string,
  status: ExperimentStatus,
  note?: string
): Promise<{ error: string | null }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('experiment_logs')
      .upsert(
        {
          experiment_id: experimentId,
          client_id: clientId,
          log_date: today,
          status,
          note: note ?? null,
        },
        { onConflict: 'experiment_id,client_id,log_date' }
      );

    if (error) return { error: error.message };
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to save log' };
  }
}
