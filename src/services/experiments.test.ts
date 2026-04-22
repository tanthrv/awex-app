import { describe, it } from 'vitest';
import * as fc from 'fast-check';

// ── Types ────────────────────────────────────────────────────────────────────

type ExperimentStatus = 'I did it' | 'I forgot' | 'Something got in the way';

interface Experiment {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  experiment_logs?: ExperimentLog[];
}

interface ExperimentLog {
  id: string;
  experiment_id: string;
  log_date: string;
  status: ExperimentStatus;
  note: string | null;
  created_at: string;
}

// ── Arbitraries ──────────────────────────────────────────────────────────────

const experimentLogArbitrary = fc.record({
  id: fc.uuid(),
  experiment_id: fc.uuid(),
  log_date: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString().split('T')[0]),
  status: fc.constantFrom<ExperimentStatus>('I did it', 'I forgot', 'Something got in the way'),
  note: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  created_at: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString()),
});

const experimentArbitrary = fc.record({
  id: fc.uuid(),
  client_id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
  is_active: fc.boolean(),
  created_at: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }).map(d => d.toISOString()),
  experiment_logs: fc.array(experimentLogArbitrary, { minLength: 0, maxLength: 5 }),
});

// ── Pure helpers ─────────────────────────────────────────────────────────────

function filterActiveExperiments(experiments: Experiment[]): Experiment[] {
  return experiments.filter(e => e.is_active === true);
}

function renderExperimentList(experiments: Experiment[]): string {
  return experiments.map(e => e.id + '|' + e.name).join('\n');
}

// Simulate upsert store
function createMockStore() {
  const map = new Map<string, string>();
  return {
    upsert: (key: string, value: string) => map.set(key, value),
    get: (key: string) => map.get(key),
    get size() { return map.size; },
  };
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderLog(log: ExperimentLog): string {
  return `${formatDate(log.log_date)}|${log.status}|${formatDate(log.created_at)}`;
}

// ── Property 6: Upsert Idempotence ───────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 6

describe('Property 6: upsert idempotence (experiments)', () => {
  it('upserting experiment log twice results in one record with latest value', () => {
    // Feature: awexapp-coaching-companion, Property 6
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.constantFrom<ExperimentStatus>('I did it', 'I forgot', 'Something got in the way'),
        fc.constantFrom<ExperimentStatus>('I did it', 'I forgot', 'Something got in the way'),
        (key, firstStatus, secondStatus) => {
          const store = createMockStore();
          store.upsert(key, firstStatus);
          store.upsert(key, secondStatus);
          return store.get(key) === secondStatus && store.size === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 8: Active-Only Experiment Filter ────────────────────────────────
// Feature: awexapp-coaching-companion, Property 8

describe('Property 8: active-only experiment filter', () => {
  it('filterActiveExperiments returns only experiments with is_active = true', () => {
    // Feature: awexapp-coaching-companion, Property 8
    fc.assert(
      fc.property(
        fc.array(experimentArbitrary, { minLength: 1, maxLength: 20 }),
        experiments => {
          const active = filterActiveExperiments(experiments);
          return active.every(e => e.is_active === true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('no inactive experiments appear in filtered result', () => {
    // Feature: awexapp-coaching-companion, Property 8
    fc.assert(
      fc.property(
        fc.array(experimentArbitrary, { minLength: 0, maxLength: 20 }),
        experiments => {
          const active = filterActiveExperiments(experiments);
          const inactiveCount = experiments.filter(e => !e.is_active).length;
          return active.length === experiments.length - inactiveCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 9: Completeness ─────────────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 9

describe('Property 9: completeness (experiments)', () => {
  it('rendered experiment list includes all experiment IDs', () => {
    // Feature: awexapp-coaching-companion, Property 9
    fc.assert(
      fc.property(
        fc.array(experimentArbitrary, { minLength: 0, maxLength: 20 }),
        experiments => {
          const rendered = renderExperimentList(experiments);
          return experiments.every(e => rendered.includes(e.id));
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 10: Timestamps Present ──────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 10

describe('Property 10: timestamps present in rendered output (experiments)', () => {
  it('rendered log includes a human-readable date derived from created_at', () => {
    // Feature: awexapp-coaching-companion, Property 10
    fc.assert(
      fc.property(experimentLogArbitrary, log => {
        const rendered = renderLog(log);
        const expectedDate = formatDate(log.created_at);
        return rendered.includes(expectedDate);
      }),
      { numRuns: 100 }
    );
  });
});
