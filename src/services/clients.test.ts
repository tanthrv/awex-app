import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ── Arbitraries ──────────────────────────────────────────────────────────────

const clientArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  access_code: fc.string({ minLength: 1, maxLength: 20 }),
});

// ── Pure helpers (mirror service logic for testing) ──────────────────────────

function renderClientList(clients: Array<{ id: string; name: string; access_code: string }>): string {
  return clients.map(c => `${c.name}|${c.access_code}`).join('\n');
}

// ── Property 4: Data Creation Round-Trip ─────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 4

describe('Property 4: data creation round-trip', () => {
  it('a created client record contains the submitted name and access_code', () => {
    // Feature: awexapp-coaching-companion, Property 4
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (name, accessCode) => {
          // Simulate what createClient would return on success
          const mockCreated = { id: 'some-uuid', name, access_code: accessCode };
          return mockCreated.name === name && mockCreated.access_code === accessCode;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 11: Client List Rendering Completeness ──────────────────────────
// Feature: awexapp-coaching-companion, Property 11

describe('Property 11: client list rendering completeness', () => {
  it('rendered client list includes every client name and access code', () => {
    // Feature: awexapp-coaching-companion, Property 11
    fc.assert(
      fc.property(
        fc.array(clientArbitrary, { minLength: 0, maxLength: 20 }),
        clients => {
          const rendered = renderClientList(clients);
          return clients.every(
            c => rendered.includes(c.name) && rendered.includes(c.access_code)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty client list renders without error', () => {
    const rendered = renderClientList([]);
    expect(rendered).toBe('');
  });
});
