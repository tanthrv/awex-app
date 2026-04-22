import { supabase } from '../lib/supabase';

export interface Session {
  id: string;
  client_id: string;
  notes: string;
  session_date: string | null;
  created_at: string;
  reflection_questions?: ReflectionQuestion[];
}

export interface ReflectionQuestion {
  id: string;
  session_id: string;
  client_id: string;
  question: string;
  created_at: string;
  response?: ReflectionResponse;
}

export interface ReflectionResponse {
  id: string;
  question_id: string;
  response_text: string | null;
  skip_reason: string | null;
  updated_at: string;
}

export async function createSession(
  clientId: string,
  notes: string,
  sessionDate?: string
): Promise<{ session: Session | null; error: string | null }> {
  try {
    const payload: Record<string, unknown> = { client_id: clientId, notes };
    if (sessionDate) payload.session_date = sessionDate;

    const { data, error } = await supabase
      .from('sessions')
      .insert(payload)
      .select()
      .single();

    if (error || !data) return { session: null, error: error?.message ?? 'Failed to create session' };
    return { session: data as Session, error: null };
  } catch (e: unknown) {
    return { session: null, error: e instanceof Error ? e.message : 'Failed to create session' };
  }
}

export async function addReflectionQuestion(
  sessionId: string,
  clientId: string,
  question: string
): Promise<{ question: ReflectionQuestion | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('reflection_questions')
      .insert({ session_id: sessionId, client_id: clientId, question })
      .select()
      .single();

    if (error || !data) return { question: null, error: error?.message ?? 'Failed to add question' };
    return { question: data as ReflectionQuestion, error: null };
  } catch (e: unknown) {
    return { question: null, error: e instanceof Error ? e.message : 'Failed to add question' };
  }
}

export async function fetchSessionsForClient(clientId: string): Promise<Session[]> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, reflection_questions(*)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Session[];
  } catch {
    return [];
  }
}

export async function fetchSessionById(sessionId: string, clientId: string): Promise<Session | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, reflection_questions(*)')
      .eq('id', sessionId)
      .eq('client_id', clientId)
      .single();

    if (error || !data) return null;
    return data as Session;
  } catch {
    return null;
  }
}
