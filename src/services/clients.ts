import { supabase } from '../lib/supabase';
import { ClientUser } from './auth';

export async function listClients(): Promise<ClientUser[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, access_code')
      .order('name', { ascending: true });
    if (error || !data) return [];
    return data as ClientUser[];
  } catch {
    return [];
  }
}

export async function createClient(
  name: string,
  accessCode: string
): Promise<{ client: ClientUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({ name, access_code: accessCode })
      .select('id, name, access_code')
      .single();
    if (error || !data) return { client: null, error: error?.message ?? 'Failed to create client' };
    return { client: data as ClientUser, error: null };
  } catch (e: unknown) {
    return { client: null, error: e instanceof Error ? e.message : 'Failed to create client' };
  }
}

export async function getClientDetail(clientId: string): Promise<{
  client: ClientUser | null;
  sessions: unknown[];
  experiments: unknown[];
  reflectionEntries: unknown[];
  reflectionPrompt: unknown | null;
}> {
  try {
    const [clientRes, sessionsRes, experimentsRes, entriesRes, promptRes] = await Promise.all([
      supabase.from('clients').select('id, name, access_code').eq('id', clientId).single(),
      supabase.from('sessions').select('*, reflection_questions(*, reflection_responses(*))').eq('client_id', clientId).order('created_at', { ascending: false }),
      supabase.from('experiments').select('*, experiment_logs(*)').eq('client_id', clientId).order('created_at', { ascending: false }),
      supabase.from('reflection_entries').select('*').eq('client_id', clientId).order('created_at', { ascending: false }),
      supabase.from('reflection_prompts').select('*').eq('client_id', clientId).single(),
    ]);

    return {
      client: clientRes.data as ClientUser | null,
      sessions: sessionsRes.data ?? [],
      experiments: experimentsRes.data ?? [],
      reflectionEntries: entriesRes.data ?? [],
      reflectionPrompt: promptRes.data ?? null,
    };
  } catch {
    return { client: null, sessions: [], experiments: [], reflectionEntries: [], reflectionPrompt: null };
  }
}
