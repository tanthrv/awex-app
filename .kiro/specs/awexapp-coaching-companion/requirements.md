# Requirements Document

## Introduction

AWExApp is a coaching companion web application built with React and Supabase. It supports two user roles: a **Guide** (coach) and **Clients**. Clients log in with their name and a personal access code. The app provides four sections for clients — Journey Map, Experiments, Reflections, and About AWE — and a dashboard for the Guide to manage clients and content. The app is designed to support the AWE (Awareness, Wonder, Embodied Alignment) coaching methodology.

---

## Glossary

- **AWExApp**: The coaching companion web application.
- **Guide**: The coach who manages clients, creates content, and reviews responses.
- **Client**: A person enrolled in coaching who logs in with their name and access code.
- **Access_Code**: A unique alphanumeric code assigned to each Client by the Guide, used for authentication.
- **Journey_Map**: The section of the app where the Guide posts session notes and reflection questions, and Clients submit written responses.
- **Session**: A coaching session record created by the Guide, containing notes and optional reflection questions.
- **Reflection_Question**: A question authored by the Guide and attached to a Session, to be answered by the Client.
- **Experiment**: A daily habit or practice assigned to a Client by the Guide, tracked with one of three status options.
- **Experiment_Log**: A daily record of a Client's response to an Experiment.
- **Reflection_Entry**: A free-form journal entry written by a Client in the Reflections section.
- **Reflection_Prompt**: An optional prompt set by the Guide to guide a Client's journal entry.
- **Guide_Dashboard**: The administrative interface used by the Guide to manage clients and content.
- **Supabase**: The backend-as-a-service platform used for the database and authentication.

---

## Requirements

### Requirement 1: Client Authentication

**User Story:** As a Client, I want to log in with my name and access code, so that I can access my personal coaching content securely.

#### Acceptance Criteria

1. WHEN a Client submits a name and access code, THE AWExApp SHALL verify the credentials against the Supabase database.
2. IF the submitted access code does not match a Client record, THEN THE AWExApp SHALL display an error message without revealing whether the name or code was incorrect.
3. WHEN a Client is successfully authenticated, THE AWExApp SHALL display a welcome screen before navigating to the home screen.
4. WHEN a Client selects "Sign out", THE AWExApp SHALL clear the session and return to the login screen.
5. THE AWExApp SHALL store the authenticated Client session so that the Client remains logged in on page refresh.

---

### Requirement 2: Guide Authentication

**User Story:** As a Guide, I want to sign in with my own credentials, so that I can access the Guide Dashboard securely.

#### Acceptance Criteria

1. WHEN a Guide submits valid credentials, THE AWExApp SHALL authenticate the Guide via Supabase and navigate to the Guide Dashboard.
2. IF a Guide submits invalid credentials, THEN THE AWExApp SHALL display an error message.
3. THE AWExApp SHALL present a toggle on the login screen that switches between Client login and Guide login modes.
4. WHEN a Guide selects "Sign out", THE AWExApp SHALL clear the session and return to the login screen.

---

### Requirement 3: Client Management

**User Story:** As a Guide, I want to add and manage clients, so that I can organise my coaching practice.

#### Acceptance Criteria

1. WHEN the Guide creates a new Client, THE Guide_Dashboard SHALL save the Client's name and a unique Access_Code to the Supabase database.
2. THE Guide_Dashboard SHALL display a list of all Clients with their name and access code visible.
3. WHEN the Guide selects a Client from the list, THE Guide_Dashboard SHALL display that Client's detail view, including all their Sessions, Experiment logs, and Reflection entries.

---

### Requirement 4: Journey Map — Guide Content Creation

**User Story:** As a Guide, I want to write session notes and add reflection questions for each client, so that clients can review and respond to them between sessions.

#### Acceptance Criteria

1. WHEN the Guide creates a Session for a Client, THE Guide_Dashboard SHALL save the session notes and an optional date to the Supabase database.
2. WHEN the Guide adds a Reflection_Question to a Session, THE Guide_Dashboard SHALL associate the question with that Session and Client in the database.
3. THE Guide_Dashboard SHALL allow the Guide to add multiple Reflection_Questions to a single Session.
4. WHEN a Session is saved, THE AWExApp SHALL make it immediately visible to the associated Client in their Journey Map.

---

### Requirement 5: Journey Map — Client View and Response

**User Story:** As a Client, I want to read my session notes and answer reflection questions from my Guide, so that I can deepen my self-awareness between sessions.

#### Acceptance Criteria

1. WHEN a Client navigates to the Journey Map, THE AWExApp SHALL display all Sessions created by the Guide for that Client, ordered with the most recent first.
2. WHEN a Client opens a Session, THE AWExApp SHALL display the session notes and all associated Reflection_Questions.
3. WHEN a Client submits a written response to a Reflection_Question, THE AWExApp SHALL save the response to the Supabase database linked to that Client and question.
4. WHEN a Client has already answered a Reflection_Question, THE AWExApp SHALL display the saved response and allow the Client to update it.
5. IF a Client does not wish to answer a Reflection_Question, THE AWExApp SHALL allow the Client to select a skip reason ("Need more time", "Not comfortable yet", "Not resonating") instead of a written response.

---

### Requirement 6: Experiments — Guide Assignment

**User Story:** As a Guide, I want to assign experiments (daily habits) to clients, so that clients can practise AWE principles between sessions.

#### Acceptance Criteria

1. WHEN the Guide creates an Experiment for a Client, THE Guide_Dashboard SHALL save the experiment name and description to the Supabase database.
2. THE Guide_Dashboard SHALL allow the Guide to assign multiple active Experiments to a single Client simultaneously.
3. WHEN the Guide views a Client's detail, THE Guide_Dashboard SHALL display all Experiments assigned to that Client along with their Experiment_Log history.

---

### Requirement 7: Experiments — Client Tracking

**User Story:** As a Client, I want to log my daily progress on each experiment, so that I can track my habits and share them with my Guide.

#### Acceptance Criteria

1. WHEN a Client navigates to the Experiments section, THE AWExApp SHALL display all active Experiments assigned to that Client.
2. WHEN a Client logs a response for an Experiment, THE AWExApp SHALL record one of three statuses: "I did it", "I forgot", or "Something got in the way".
3. WHEN a Client selects "Something got in the way", THE AWExApp SHALL display an optional text field for the Client to describe what happened.
4. THE AWExApp SHALL display the log history for each Experiment, showing the date and status of each past entry.
5. THE AWExApp SHALL allow the Client to log only one response per Experiment per calendar day.
6. IF a Client has already logged a response for an Experiment today, THEN THE AWExApp SHALL display the existing response and allow the Client to update it.

---

### Requirement 8: Reflections — Guide Prompt

**User Story:** As a Guide, I want to set an optional journal prompt for a client, so that I can guide their free-form reflection.

#### Acceptance Criteria

1. WHEN the Guide sets a Reflection_Prompt for a Client, THE Guide_Dashboard SHALL save the prompt text to the Supabase database linked to that Client.
2. THE Guide_Dashboard SHALL allow the Guide to update or clear the active Reflection_Prompt for a Client at any time.

---

### Requirement 9: Reflections — Client Journal

**User Story:** As a Client, I want to write free-form journal entries, so that I can capture my thoughts and reflections throughout my coaching journey.

#### Acceptance Criteria

1. WHEN a Client navigates to the Reflections section, THE AWExApp SHALL display the active Reflection_Prompt if one has been set by the Guide.
2. WHEN a Client submits a journal entry, THE AWExApp SHALL save the Reflection_Entry with the entry text and a timestamp to the Supabase database.
3. THE AWExApp SHALL display a list of the Client's past Reflection_Entries in reverse chronological order.
4. WHEN a Client selects a past Reflection_Entry, THE AWExApp SHALL display the full text of that entry.

---

### Requirement 10: About AWE Page

**User Story:** As a Client, I want to read about the AWE philosophy, so that I can understand the principles behind my coaching programme.

#### Acceptance Criteria

1. THE AWExApp SHALL display a static About AWE page accessible from the client home screen and bottom navigation.
2. THE About AWE page SHALL present the meaning of the AWE acronym (Awareness, Wonder, Embodied Alignment) and the coaching philosophy.

---

### Requirement 11: Guide — View Client Responses

**User Story:** As a Guide, I want to see all client responses in one place, so that I can prepare for sessions and track client progress.

#### Acceptance Criteria

1. WHEN the Guide opens a Client's detail view, THE Guide_Dashboard SHALL display all Reflection_Question responses submitted by that Client.
2. WHEN the Guide opens a Client's detail view, THE Guide_Dashboard SHALL display the full Experiment_Log history for that Client.
3. WHEN the Guide opens a Client's detail view, THE Guide_Dashboard SHALL display all Reflection_Entries submitted by that Client.
4. THE Guide_Dashboard SHALL display the date and timestamp for each Client response.

---

### Requirement 12: Navigation and Layout

**User Story:** As a Client, I want clear and consistent navigation, so that I can move between sections of the app easily.

#### Acceptance Criteria

1. THE AWExApp SHALL display a persistent bottom navigation bar on all client-facing screens (Home, Journey Map, Experiments, Reflections).
2. THE AWExApp SHALL render correctly on mobile viewport widths from 320px to 480px.
3. THE AWExApp SHALL apply the AWExApp visual design system (Cormorant Garamond and DM Sans typefaces, warm earth-tone colour palette) consistently across all screens.

---

### Requirement 13: Data Persistence and Security

**User Story:** As a Guide and as a Client, I want my data to be stored securely, so that coaching content and personal responses remain private.

#### Acceptance Criteria

1. THE AWExApp SHALL store all application data in Supabase using row-level security policies so that Clients can only read and write their own data.
2. THE AWExApp SHALL ensure that a Client cannot access another Client's sessions, experiments, or journal entries.
3. THE Guide SHALL have read and write access to all Client data within the Supabase row-level security policies.
