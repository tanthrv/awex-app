-- Migration 002: experiments, experiment_logs, reflection_entries, reflection_prompts
-- Run this second in the Supabase SQL Editor (after 001).

-- Experiments assigned to a client
CREATE TABLE IF NOT EXISTS experiments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Daily experiment logs (one per experiment per client per calendar day)
CREATE TABLE IF NOT EXISTS experiment_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  log_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  status        TEXT NOT NULL CHECK (status IN ('I did it', 'I forgot', 'Something got in the way')),
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT one_log_per_day UNIQUE (experiment_id, client_id, log_date)
);

-- Free-form journal entries
CREATE TABLE IF NOT EXISTS reflection_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  entry_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Active reflection prompt per client (one at a time)
-- The UNIQUE constraint on client_id ensures only one prompt per client.
CREATE TABLE IF NOT EXISTS reflection_prompts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  prompt_text TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT one_prompt_per_client UNIQUE (client_id)
);
