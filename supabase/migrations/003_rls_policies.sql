-- Migration 003: Row Level Security policies
-- Run this third in the Supabase SQL Editor (after 001 and 002).
--
-- RLS approach:
--   Guide  → uses Supabase Auth (email/password); identified by auth.role() = 'authenticated'
--   Client → does NOT use Supabase Auth; identified by the anon key + a session variable
--             app.client_id set via the set_client_id() helper below.
--
-- The backend calls set_client_id(client_uuid) at the start of each client request
-- so that RLS policies can filter rows by current_setting('app.client_id', true)::uuid.

-- ══════════════════════════════════════════════════════════════
-- Helper function: set_client_id
-- Call this at the start of a client session to establish identity.
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION set_client_id(client_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM set_config('app.client_id', client_uuid::text, false);
END;
$$;

-- ══════════════════════════════════════════════════════════════
-- Enable RLS on all tables
-- ══════════════════════════════════════════════════════════════
ALTER TABLE clients             ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_prompts  ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════
-- GUIDE POLICIES (authenticated role — full access to all tables)
-- ══════════════════════════════════════════════════════════════

CREATE POLICY "guide_all_clients" ON clients
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_sessions" ON sessions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_questions" ON reflection_questions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_responses" ON reflection_responses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_experiments" ON experiments
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_logs" ON experiment_logs
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_entries" ON reflection_entries
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "guide_all_prompts" ON reflection_prompts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════
-- CLIENT POLICIES (anon role — own rows only, via app.client_id)
-- ══════════════════════════════════════════════════════════════

-- clients: read own record
CREATE POLICY "client_read_own" ON clients
  FOR SELECT TO anon
  USING (id = current_setting('app.client_id', true)::uuid);

-- sessions: read own sessions
CREATE POLICY "client_read_own_sessions" ON sessions
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

-- reflection_questions: read own questions
CREATE POLICY "client_read_own_questions" ON reflection_questions
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

-- reflection_responses: read, insert, and update own responses
CREATE POLICY "client_read_own_responses" ON reflection_responses
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

CREATE POLICY "client_insert_own_responses" ON reflection_responses
  FOR INSERT TO anon
  WITH CHECK (client_id = current_setting('app.client_id', true)::uuid);

CREATE POLICY "client_update_own_responses" ON reflection_responses
  FOR UPDATE TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid)
  WITH CHECK (client_id = current_setting('app.client_id', true)::uuid);

-- experiments: read own experiments
CREATE POLICY "client_read_own_experiments" ON experiments
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

-- experiment_logs: read, insert, and update own logs
CREATE POLICY "client_read_own_logs" ON experiment_logs
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

CREATE POLICY "client_insert_own_logs" ON experiment_logs
  FOR INSERT TO anon
  WITH CHECK (client_id = current_setting('app.client_id', true)::uuid);

CREATE POLICY "client_update_own_logs" ON experiment_logs
  FOR UPDATE TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid)
  WITH CHECK (client_id = current_setting('app.client_id', true)::uuid);

-- reflection_entries: read and insert own entries
CREATE POLICY "client_read_own_entries" ON reflection_entries
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);

CREATE POLICY "client_insert_own_entries" ON reflection_entries
  FOR INSERT TO anon
  WITH CHECK (client_id = current_setting('app.client_id', true)::uuid);

-- reflection_prompts: read own prompt
CREATE POLICY "client_read_own_prompt" ON reflection_prompts
  FOR SELECT TO anon
  USING (client_id = current_setting('app.client_id', true)::uuid);
