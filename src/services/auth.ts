import { supabase } from '../lib/supabase';

export const GENERIC_AUTH_ERROR = "We couldn't find a match for those details.";

export interface ClientUser {
  id: string;
  name: string;
  access_code: string;
}

export interface GuideUser {
  id: string;
  email: string;
}

// Pure helper: find client by credentials (used in property tests)
export function findClientByCredentials(
  submitted: { name: string; access_code: string },
  clients: ClientUser[]
): ClientUser | null {
  return clients.find(c => c.name === submitted.name && c.access_code === submitted.access_code) ?? null;
}

// Task 3.1: loginClient
export async function loginClient(
  name: string,
  accessCode: string
): Promise<{ client: ClientUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, access_code')
      .eq('name', name)
      .eq('access_code', accessCode)
      .single();

    if (error || !data) {
      return { client: null, error: GENERIC_AUTH_ERROR };
    }

    return { client: data as ClientUser, error: null };
  } catch {
    return { client: null, error: GENERIC_AUTH_ERROR };
  }
}

// Task 3.2: session persistence
const CLIENT_SESSION_KEY = 'awexapp_client_session';

export function storeClientSession(client: ClientUser): void {
  localStorage.setItem(CLIENT_SESSION_KEY, JSON.stringify(client));
}

export function loadClientSession(): ClientUser | null {
  try {
    const raw = localStorage.getItem(CLIENT_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.name && parsed.access_code) {
      return parsed as ClientUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearClientSession(): void {
  localStorage.removeItem(CLIENT_SESSION_KEY);
}

// Task 4.1: loginGuide
export async function loginGuide(
  email: string,
  password: string
): Promise<{ guide: GuideUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { guide: null, error: error?.message ?? 'Login failed' };
    }
    return {
      guide: { id: data.user.id, email: data.user.email ?? email },
      error: null,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Login failed';
    return { guide: null, error: msg };
  }
}
