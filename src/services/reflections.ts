import { supabase } from '../lib/supabase';

export interface ReflectionEntry {
  id: string;
  client_id: string;
  entry_text: string;
  created_at: string;
}

export async function setReflectionPrompt(
  clientId: string,
  promptText: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('reflection_prompts')
      .upsert(
        { client_id: clientId, prompt_text: promptText, updated_at: new Date().toISOString() },
        { onConflict: 'client_id' }
      );
    if (error) return { error: error.message };
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to set prompt' };
  }
}

export async function clearReflectionPrompt(clientId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('reflection_prompts')
      .upsert(
        { client_id: clientId, prompt_text: null, updated_at: new Date().toISOString() },
        { onConflict: 'client_id' }
      );
    if (error) return { error: error.message };
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to clear prompt' };
  }
}

export async function fetchReflectionPrompt(clientId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('reflection_prompts')
      .select('prompt_text')
      .eq('client_id', clientId)
      .single();
    if (error || !data) return null;
    return data.prompt_text ?? null;
  } catch {
    return null;
  }
}

export async function createReflectionEntry(
  clientId: string,
  entryText: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('reflection_entries')
      .insert({ client_id: clientId, entry_text: entryText });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Failed to save entry' };
  }
}

export async function fetchReflectionEntries(clientId: string): Promise<ReflectionEntry[]> {
  try {
    const { data, error } = await supabase
      .from('reflection_entries')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as ReflectionEntry[];
  } catch {
    return [];
  }
}
