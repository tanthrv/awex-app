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
    // Fetch sessions first
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('sessions')
      .select('id, client_id, notes, session_date, created_at')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (sessionsError || !sessionsData || sessionsData.length === 0) return [];

    // Fetch all reflection questions for this client in one query
    const sessionIds = sessionsData.map(s => s.id);
    const { data: questionsData } = await supabase
      .from('reflection_questions')
      .select('id, session_id, client_id, question, created_at')
      .in('session_id', sessionIds);

    const questions = questionsData ?? [];

    // Attach questions to their sessions
    return sessionsData.map(session => ({
      ...session,
      reflection_questions: questions.filter(q => q.session_id === session.id),
    })) as Session[];
  } catch {
    return [];
  }
}

export async function fetchSessionById(sessionId: string, clientId: string): Promise<Session | null> {
  try {
    // Fetch the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('id, client_id, notes, session_date, created_at')
      .eq('id', sessionId)
      .eq('client_id', clientId)
      .single();

    if (sessionError || !sessionData) return null;

    // Fetch reflection questions for this session separately
    const { data: questionsData } = await supabase
      .from('reflection_questions')
      .select('id, session_id, client_id, question, created_at')
      .eq('session_id', sessionId);

    return {
      ...sessionData,
      reflection_questions: questionsData ?? [],
    } as Session;
  } catch {
    return null;
  }
}
