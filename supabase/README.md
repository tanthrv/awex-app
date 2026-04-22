# Supabase Migrations

This directory contains SQL migration files for the AWExApp database schema.
Run them in order using the **Supabase SQL Editor** at
[https://supabase.com/dashboard](https://supabase.com/dashboard).

## How to run migrations

1. Open your Supabase project dashboard.
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Copy the contents of each migration file (in order) and paste into the editor.
5. Click **Run** for each file.

## Migration order

| File | Contents |
|------|----------|
| `001_clients_sessions.sql` | `clients`, `sessions`, `reflection_questions`, `reflection_responses` tables |
| `002_experiments_reflections.sql` | `experiments`, `experiment_logs`, `reflection_entries`, `reflection_prompts` tables |
| `003_rls_policies.sql` | Row Level Security policies + `set_client_id()` helper function |

Always run them in this order — later migrations depend on tables created by earlier ones.

## RLS approach

The app has two user roles with different authentication mechanisms:

**Guide** — authenticates via Supabase Auth (email + password). The Guide's requests
carry a valid Supabase JWT, so `auth.role()` returns `'authenticated'`. Guide policies
grant full SELECT/INSERT/UPDATE/DELETE on all tables.

**Client** — does NOT use Supabase Auth (clients have no email address). Clients
authenticate by querying the `clients` table with their name and access code. On a
successful match, the backend stores the client's UUID and uses the anon key for
subsequent requests.

Because clients use the anon role, RLS policies for clients filter rows using a
Postgres session variable:

```sql
current_setting('app.client_id', true)::uuid
```

The `set_client_id(client_uuid UUID)` function (created in migration 003) sets this
variable for the current session. The backend must call this function at the start of
every client request before querying any client-owned table.

Client policies allow:
- `SELECT` on their own rows across all tables
- `INSERT` / `UPDATE` on tables they write to (`reflection_responses`, `experiment_logs`, `reflection_entries`)

The Guide (authenticated role) bypasses all client-scoped filters and has unrestricted
access to every table.
