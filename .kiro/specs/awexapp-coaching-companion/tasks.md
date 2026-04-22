# Tasks

## Task List

- [x] 1. Project Setup and Infrastructure
  - [x] 1.1 Initialise Vite + React 18 project with TypeScript
  - [x] 1.2 Install dependencies: @supabase/supabase-js, react-router-dom, fast-check, vitest, @testing-library/react
  - [x] 1.3 Configure environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  - [x] 1.4 Create src/lib/supabase.ts with configured Supabase client
  - [x] 1.5 Port design tokens and global CSS from prototype index.html into src/styles/globals.css
  - [x] 1.6 Set up Supabase local development instance and apply database schema migrations

- [x] 2. Database Schema and RLS Policies
  - [x] 2.1 Create migration: clients, sessions, reflection_questions, reflection_responses tables
  - [x] 2.2 Create migration: experiments, experiment_logs, reflection_entries, reflection_prompts tables
  - [x] 2.3 Apply unique constraints: one_response_per_question, one_log_per_day, one_prompt_per_client
  - [x] 2.4 Implement RLS policies for client data isolation (clients read own data only)
  - [x] 2.5 Implement RLS policies for guide access (read/write all client data)

- [x] 3. Authentication — Client Login
  - [x] 3.1 Create src/services/auth.ts with loginClient(name, accessCode) function
  - [x] 3.2 Implement storeClientSession and loadClientSession using localStorage
  - [x] 3.3 Create AuthContext (src/context/AuthContext.tsx) with client/guide user state and signOut
  - [x] 3.4 Build ClientLoginForm component with name and access code fields
  - [x] 3.5 Wire login form to auth service; show generic error on failure (Requirement 1.2)
  - [x] 3.6 Implement session persistence so client stays logged in on page refresh (Requirement 1.5)
  - [x] 3.7 Write property tests for Properties 1, 2, 3 (credential verification, generic error, session round-trip)

- [x] 4. Authentication — Guide Login and Toggle
  - [x] 4.1 Add loginGuide(email, password) to auth service using supabase.auth.signInWithPassword
  - [x] 4.2 Build GuideLoginForm component with email and password fields
  - [x] 4.3 Implement login screen toggle between Client and Guide modes (Requirement 2.3)
  - [x] 4.4 Implement sign out for both roles (clear session, redirect to login) (Requirements 1.4, 2.4)

- [x] 5. Routing and Layout Shell
  - [x] 5.1 Set up React Router with routes: /, /welcome, /home, /journey, /journey/:sessionId, /experiments, /reflections, /about, /guide, /guide/:clientId
  - [x] 5.2 Create ClientLayout component with persistent bottom navigation bar (Requirement 12.1)
  - [x] 5.3 Create ProtectedRoute components for client-only and guide-only routes
  - [x] 5.4 Build WelcomeScreen component shown after successful client login (Requirement 1.3)

- [x] 6. Guide Dashboard — Client Management
  - [x] 6.1 Create src/services/clients.ts with listClients, createClient, getClientDetail functions
  - [x] 6.2 Build ClientListScreen showing all clients with name and access code (Requirement 3.2)
  - [x] 6.3 Build AddClientForm for creating new clients with name and access code (Requirement 3.1)
  - [x] 6.4 Build ClientDetailScreen shell with tabs/sections for Sessions, Experiments, Reflections (Requirement 3.3)
  - [x] 6.5 Write property tests for Properties 4 (data creation round-trip) and 11 (client list rendering)

- [x] 7. Journey Map — Guide Content Creation
  - [x] 7.1 Create src/services/sessions.ts with createSession, addReflectionQuestion, fetchSessionsForClient functions
  - [x] 7.2 Build SessionForm component for creating sessions with notes and optional date (Requirement 4.1)
  - [x] 7.3 Build ReflectionQuestionForm supporting multiple questions per session (Requirements 4.2, 4.3)
  - [x] 7.4 Wire session creation to immediately appear in client's Journey Map (Requirement 4.4)

- [x] 8. Journey Map — Client View and Responses
  - [x] 8.1 Build JourneyMapScreen listing sessions in reverse-chronological order (Requirement 5.1)
  - [x] 8.2 Build SessionDetailScreen showing notes and all reflection questions (Requirement 5.2)
  - [x] 8.3 Create src/services/responses.ts with upsertReflectionResponse function
  - [x] 8.4 Build ReflectionQuestionCard with text response textarea and save button (Requirement 5.3)
  - [x] 8.5 Implement upsert so existing responses are pre-filled and updatable (Requirement 5.4)
  - [x] 8.6 Implement skip reason chips (three options) that clear response text when selected (Requirement 5.5)
  - [x] 8.7 Write property tests for Properties 5 (ordering), 6 (upsert idempotence), 7 (skip reason exclusivity), 9 (completeness)

- [x] 9. Experiments — Guide Assignment
  - [x] 9.1 Create src/services/experiments.ts with createExperiment, fetchExperimentsForClient functions
  - [x] 9.2 Build ExperimentForm for creating experiments with name and description (Requirement 6.1)
  - [x] 9.3 Display all experiments (with logs) in ClientDetailScreen (Requirements 6.2, 6.3)

- [x] 10. Experiments — Client Tracking
  - [x] 10.1 Build ExperimentsScreen showing only active experiments (Requirement 7.1)
  - [x] 10.2 Create upsertExperimentLog function with one-per-day constraint (Requirements 7.2, 7.5)
  - [x] 10.3 Build ExperimentCard with three status buttons and conditional note field for "Something got in the way" (Requirements 7.2, 7.3)
  - [x] 10.4 Display log history per experiment with date and status (Requirement 7.4)
  - [x] 10.5 Pre-fill today's log if one exists and allow update (Requirement 7.6)
  - [x] 10.6 Write property tests for Properties 6 (upsert), 8 (active filter), 9 (completeness), 10 (timestamps)

- [x] 11. Reflections — Guide Prompt
  - [x] 11.1 Create src/services/reflections.ts with setReflectionPrompt, clearReflectionPrompt, fetchReflectionPrompt functions
  - [x] 11.2 Build ReflectionPromptForm in ClientDetailScreen for setting/clearing prompt (Requirements 8.1, 8.2)

- [x] 12. Reflections — Client Journal
  - [x] 12.1 Build ReflectionsScreen showing active prompt if set (Requirement 9.1)
  - [x] 12.2 Implement createReflectionEntry function saving entry text with timestamp (Requirement 9.2)
  - [x] 12.3 Display past entries in reverse-chronological order (Requirement 9.3)
  - [x] 12.4 Build ReflectionEntryDetail view showing full entry text on selection (Requirement 9.4)

- [x] 13. About AWE Page
  - [x] 13.1 Build static AboutAWEScreen with AWE acronym explanation and coaching philosophy (Requirements 10.1, 10.2)
  - [x] 13.2 Ensure About AWE is accessible from home screen nav card and bottom navigation

- [x] 14. Guide — View Client Responses
  - [x] 14.1 Display all reflection question responses in ClientDetailScreen with timestamps (Requirements 11.1, 11.4)
  - [x] 14.2 Display full experiment log history in ClientDetailScreen with timestamps (Requirements 11.2, 11.4)
  - [x] 14.3 Display all journal entries in ClientDetailScreen with timestamps (Requirements 11.3, 11.4)
  - [x] 14.4 Write property tests for Properties 9 (completeness) and 10 (timestamps)

- [x] 15. Responsive Layout and Design System
  - [x] 15.1 Verify bottom navigation bar is present and sticky on all client screens (Requirement 12.1)
  - [x] 15.2 Test layout at 320px, 375px, and 480px viewport widths (Requirement 12.2)
  - [x] 15.3 Apply Cormorant Garamond and DM Sans typefaces and earth-tone colour palette consistently (Requirement 12.3)
  - [x] 15.4 Write property test for Property 12 (viewport non-overflow)

- [x] 16. Security and Data Isolation
  - [x] 16.1 Integration test: verify client A cannot read client B's sessions, experiments, or journal entries (Requirements 13.1, 13.2)
  - [x] 16.2 Integration test: verify guide credentials can read/write all client data (Requirement 13.3)
  - [x] 16.3 Smoke test: verify RLS policies are enabled on all tables
