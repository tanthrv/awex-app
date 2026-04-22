import { supabase } from '../lib/supabase';

export type SkipReason = 'Need more time' | 'Not comfortable yet' | 'Not resonating';

export async function upsertReflectionResponse(
  questionId: string,
  clientId: string,
  responseText: string | null,
  skipReason: SkipReason | null
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('reflection_responses')
      .upsert(
        {
          question_id: questionId,
          client_id: clientId,
          response_text: responseText,
          skip_reason: skipReason,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'question_id,client_id' }
      );

    if (error) return { error: error.message };
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to save response' };
  }
}

export async function fetchResponsesForSession(
  sessionId: string,
  clientId: string
): Promise<Record<string, { response_text: string | null; skip_reason: string | null; updated_at: string }>> {
  try {
    // First get question IDs for this session
    const { data: questions } = await supabase
      .from('reflection_questions')
      .select('id')
      .eq('session_id', sessionId)
      .eq('client_id', clientId);

    if (!questions || questions.length === 0) return {};

    const questionIds = questions.map((q: { id: string }) => q.id);

    const { data: responses } = await supabase
      .from('reflection_responses')
      .select('question_id, response_text, skip_reason, updated_at')
      .in('question_id', questionIds)
      .eq('client_id', clientId);

    if (!responses) return {};

    const map: Record<string, { response_text: string | null; skip_reason: string | null; updated_at: string }> = {};
    for (const r of responses) {
      map[r.question_id] = {
        response_text: r.response_text,
        skip_reason: r.skip_reason,
        updated_at: r.updated_at,
      };
    }
    return map;
  } catch {
    return {};
  }
}
