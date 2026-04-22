import { describe, it } from 'vitest';
import * as fc from 'fast-check';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReflectionEntry {
  id: string;
  entry_text: string;
  created_at: string;
}

interface ExperimentLog {
  id: string;
  log_date: string;
  status: string;
  note: string | null;
  created_at: string;
}

// ── Arbitraries ──────────────────────────────────────────────────────────────

const entryArbitrary = fc.record({
  id: fc.uuid(),
  entry_text: fc.string({ minLength: 1, maxLength: 200 }),
  created_at: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString()),
});

const logArbitrary = fc.record({
  id: fc.uuid(),
  log_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString().split('T')[0]),
  status: fc.constantFrom('I did it', 'I forgot', 'Something got in the way'),
  note: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  created_at: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString()),
});

// ── Pure helpers ─────────────────────────────────────────────────────────────

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderEntries(entries: ReflectionEntry[]): string {
  return entries.map(e => `${e.id}|${e.entry_text}|${formatDate(e.created_at)}`).join('\n');
}

function renderLogs(logs: ExperimentLog[]): string {
  return logs.map(l => `${l.id}|${l.status}|${formatDate(l.created_at)}`).join('\n');
}

// ── Property 9: Completeness ─────────────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 9

describe('Property 9: completeness (guide view)', () => {
  it('rendered journal entries include all entry IDs', () => {
    // Feature: awexapp-coaching-companion, Property 9
    fc.assert(
      fc.property(
        fc.array(entryArbitrary, { minLength: 0, maxLength: 20 }),
        entries => {
          const rendered = renderEntries(entries);
          return entries.every(e => rendered.includes(e.id));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('rendered experiment logs include all log IDs', () => {
    // Feature: awexapp-coaching-companion, Property 9
    fc.assert(
      fc.property(
        fc.array(logArbitrary, { minLength: 0, maxLength: 20 }),
        logs => {
          const rendered = renderLogs(logs);
          return logs.every(l => rendered.includes(l.id));
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 10: Timestamps Present ──────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 10

describe('Property 10: timestamps present in rendered output (guide view)', () => {
  it('rendered journal entry includes human-readable date from created_at', () => {
    // Feature: awexapp-coaching-companion, Property 10
    fc.assert(
      fc.property(entryArbitrary, entry => {
        const rendered = renderEntries([entry]);
        return rendered.includes(formatDate(entry.created_at));
      }),
      { numRuns: 100 }
    );
  });

  it('rendered experiment log includes human-readable date from created_at', () => {
    // Feature: awexapp-coaching-companion, Property 10
    fc.assert(
      fc.property(logArbitrary, log => {
        const rendered = renderLogs([log]);
        return rendered.includes(formatDate(log.created_at));
      }),
      { numRuns: 100 }
    );
  });
});
