import { describe, it } from 'vitest';
import * as fc from 'fast-check';

// ── Types ────────────────────────────────────────────────────────────────────

type SkipReason = 'Need more time' | 'Not comfortable yet' | 'Not resonating';

interface ReflectionEntry {
  id: string;
  entry_text: string;
  created_at: string;
}

// ── Arbitraries ──────────────────────────────────────────────────────────────

const sessionArbitrary = fc.record({
  id: fc.uuid(),
  created_at: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }).map(d => d.toISOString()),
});

const reflectionEntryArbitrary = fc.record({
  id: fc.uuid(),
  entry_text: fc.string({ minLength: 1, maxLength: 200 }),
  created_at: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') }).map(d => d.toISOString()),
});

// ── Pure helpers ─────────────────────────────────────────────────────────────

function sortByCreatedAtDesc<T extends { created_at: string }>(records: T[]): T[] {
  return [...records].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function buildResponse(opts: { skipReason?: SkipReason; responseText?: string }) {
  if (opts.skipReason) {
    return { skip_reason: opts.skipReason, response_text: null };
  }
  return { skip_reason: null, response_text: opts.responseText ?? null };
}

// Simulate upsert: store only one record per key
function createMockStore() {
  const map = new Map<string, string>();
  return {
    upsert: (key: string, value: string) => map.set(key, value),
    get: (key: string) => map.get(key),
    get size() { return map.size; },
  };
}

function renderEntryList(entries: ReflectionEntry[]): string {
  return entries.map(e => e.id + '|' + e.entry_text).join('\n');
}

// ── Property 5: Reverse-Chronological Ordering ───────────────────────────────
// Feature: awexapp-coaching-companion, Property 5

describe('Property 5: reverse-chronological ordering', () => {
  it('sortByCreatedAtDesc returns records with most recent first', () => {
    // Feature: awexapp-coaching-companion, Property 5
    fc.assert(
      fc.property(
        fc.array(sessionArbitrary, { minLength: 2, maxLength: 20 }),
        sessions => {
          const sorted = sortByCreatedAtDesc(sessions);
          for (let i = 0; i < sorted.length - 1; i++) {
            if (new Date(sorted[i].created_at) < new Date(sorted[i + 1].created_at)) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('single-element array is already sorted', () => {
    fc.assert(
      fc.property(sessionArbitrary, session => {
        const sorted = sortByCreatedAtDesc([session]);
        return sorted.length === 1 && sorted[0].id === session.id;
      }),
      { numRuns: 50 }
    );
  });
});

// ── Property 6: Upsert Idempotence ───────────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 6

describe('Property 6: upsert idempotence', () => {
  it('upserting twice results in exactly one record with the latest value', () => {
    // Feature: awexapp-coaching-companion, Property 6
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (key, firstValue, secondValue) => {
          const store = createMockStore();
          store.upsert(key, firstValue);
          store.upsert(key, secondValue);
          return store.get(key) === secondValue && store.size === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 7: Skip Reason Exclusivity ──────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 7

describe('Property 7: skip reason exclusivity', () => {
  it('when skip reason is set, response_text is null', () => {
    // Feature: awexapp-coaching-companion, Property 7
    fc.assert(
      fc.property(
        fc.constantFrom<SkipReason>('Need more time', 'Not comfortable yet', 'Not resonating'),
        skipReason => {
          const response = buildResponse({ skipReason });
          return response.skip_reason === skipReason && response.response_text === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('when response_text is set, skip_reason is null', () => {
    // Feature: awexapp-coaching-companion, Property 7
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        responseText => {
          const response = buildResponse({ responseText });
          return response.response_text === responseText && response.skip_reason === null;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 9: Completeness of Record Display ───────────────────────────────
// Feature: awexapp-coaching-companion, Property 9

describe('Property 9: completeness of record display', () => {
  it('rendered entry list includes all entry IDs', () => {
    // Feature: awexapp-coaching-companion, Property 9
    fc.assert(
      fc.property(
        fc.array(reflectionEntryArbitrary, { minLength: 0, maxLength: 20 }),
        entries => {
          const rendered = renderEntryList(entries);
          return entries.every(e => rendered.includes(e.id));
        }
      ),
      { numRuns: 100 }
    );
  });
});
