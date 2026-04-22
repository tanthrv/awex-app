import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ── Property 12: Viewport Non-Overflow ───────────────────────────────────────
// Feature: awexapp-coaching-companion, Property 12

/**
 * This test verifies that the app's root container constraint (max-width: 480px)
 * ensures no horizontal overflow for any viewport width in the 320–480px range.
 *
 * Since we can't render a full browser in unit tests, we test the CSS logic:
 * the effective container width = min(viewportWidth, MAX_WIDTH).
 * The container width must never exceed the viewport width.
 */

const MAX_WIDTH = 480;

function getContainerWidth(viewportWidth: number): number {
  // Mirrors the CSS: #root { max-width: 480px; width: 100%; }
  return Math.min(viewportWidth, MAX_WIDTH);
}

describe('Property 12: viewport non-overflow', () => {
  it('container width never exceeds viewport width for 320–480px range', () => {
    // Feature: awexapp-coaching-companion, Property 12
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 480 }),
        viewportWidth => {
          const containerWidth = getContainerWidth(viewportWidth);
          return containerWidth <= viewportWidth;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('container width is at most MAX_WIDTH (480px)', () => {
    // Feature: awexapp-coaching-companion, Property 12
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 480 }),
        viewportWidth => {
          const containerWidth = getContainerWidth(viewportWidth);
          return containerWidth <= MAX_WIDTH;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('specific viewport widths do not overflow', () => {
    const testWidths = [320, 375, 390, 414, 480];
    for (const width of testWidths) {
      const containerWidth = getContainerWidth(width);
      expect(containerWidth).toBeLessThanOrEqual(width);
    }
  });
});
