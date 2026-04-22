import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  GENERIC_AUTH_ERROR,
  findClientByCredentials,
  storeClientSession,
  loadClientSession,
  clearClientSession,
  ClientUser,
} from './auth';

// ── Arbitraries ──────────────────────────────────────────────────────────────

const clientArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  access_code: fc.string({ minLength: 1, maxLength: 20 }),
});

// ── Property 1: Credential Verification Correctness ─────────────────────────
// Feature: awexapp-coaching-companion, Property 1
// Validates: Requirements 1.1

describe('Property 1: credential verification correctness', () => {
  it('returns a match iff both name and access_code match exactly one record', () => {
    // Feature: awexapp-coaching-companion, Property 1
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 30 }),
          access_code: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        fc.array(clientArbitrary, { minLength: 1, maxLength: 10 }),
        (submitted, clients) => {
          const result = findClientByCredentials(submitted, clients);
          const expected = clients.find(
            c => c.name === submitted.name && c.access_code === submitted.access_code
          );
          return (result === null) === (expected === undefined);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns null when no client matches', () => {
    // Feature: awexapp-coaching-companion, Property 1
    fc.assert(
      fc.property(
        fc.array(clientArbitrary, { minLength: 1, maxLength: 5 }),
        clients => {
          // Use credentials that definitely won't match any client
          const result = findClientByCredentials({ name: '\x00', access_code: '\x00' }, clients);
          return result === null;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 2: Generic Error Message on Auth Failure ────────────────────────
// Feature: awexapp-coaching-companion, Property 2
// Validates: Requirements 1.2

describe('Property 2: generic error message on auth failure', () => {
  it('GENERIC_AUTH_ERROR is always the same string regardless of input', () => {
    // Feature: awexapp-coaching-companion, Property 2
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (_name, _code) => {
          return GENERIC_AUTH_ERROR === "We couldn't find a match for those details.";
        }
      ),
      { numRuns: 100 }
    );
  });

  it('findClientByCredentials returns null (triggering generic error) for wrong credentials', () => {
    // Feature: awexapp-coaching-companion, Property 2
    fc.assert(
      fc.property(
        clientArbitrary,
        fc.string({ minLength: 1 }),
        (client, wrongCode) => {
          fc.pre(wrongCode !== client.access_code);
          const result = findClientByCredentials({ name: client.name, access_code: wrongCode }, [client]);
          // null result means the caller would show GENERIC_AUTH_ERROR
          return result === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('findClientByCredentials returns null for wrong name', () => {
    // Feature: awexapp-coaching-companion, Property 2
    fc.assert(
      fc.property(
        clientArbitrary,
        fc.string({ minLength: 1 }),
        (client, wrongName) => {
          fc.pre(wrongName !== client.name);
          const result = findClientByCredentials({ name: wrongName, access_code: client.access_code }, [client]);
          return result === null;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── Property 3: Session Persistence Round-Trip ───────────────────────────────
// Feature: awexapp-coaching-companion, Property 3
// Validates: Requirements 1.5

describe('Property 3: session persistence round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('storeClientSession then loadClientSession returns equivalent client', () => {
    // Feature: awexapp-coaching-companion, Property 3
    fc.assert(
      fc.property(clientArbitrary, (client: ClientUser) => {
        storeClientSession(client);
        const retrieved = loadClientSession();
        return (
          retrieved !== null &&
          retrieved.id === client.id &&
          retrieved.name === client.name &&
          retrieved.access_code === client.access_code
        );
      }),
      { numRuns: 100 }
    );
  });

  it('clearClientSession removes the stored session', () => {
    // Feature: awexapp-coaching-companion, Property 3
    fc.assert(
      fc.property(clientArbitrary, (client: ClientUser) => {
        storeClientSession(client);
        clearClientSession();
        return loadClientSession() === null;
      }),
      { numRuns: 100 }
    );
  });

  it('loadClientSession returns null when nothing is stored', () => {
    localStorage.clear();
    expect(loadClientSession()).toBeNull();
  });

  it('loadClientSession returns null for invalid JSON', () => {
    localStorage.setItem('awexapp_client_session', 'not-json');
    expect(loadClientSession()).toBeNull();
  });
});
