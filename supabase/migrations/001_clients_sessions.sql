-- Migration 001: clients, sessions, reflection_questions, reflection_responses
-- Run this first in the Supabase SQL Editor.

-- Clients table (managed by Guide, not Supabase Auth)
CREATE TABLE IF NOT EXISTS clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Sessions (created by Guide for a specific Client)
CREATE TABLE IF NOT EXISTS sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  notes        TEXT NOT NULL,
  session_date DATE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Reflection questions attached to a session
CREATE TABLE IF NOT EXISTS reflection_questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  question   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client responses to reflection questions
-- skip_reason values match the three options presented in the UI
CREATE TABLE IF NOT EXISTS reflection_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   UUID NOT NULL REFERENCES reflection_questions(id) ON DELETE CASCADE,
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  response_text TEXT,
  skip_reason   TEXT CHECK (skip_reason IN ('Need more time', 'Not comfortable yet', 'Not resonating')),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT one_response_per_question UNIQUE (question_id, client_id)
);
