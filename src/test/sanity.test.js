import { describe, it, expect } from 'vitest';

describe('Initial Project Check', () => {
    it('should pass a basic sanity check', () => {
        expect(1 + 1).toBe(2);
    });

    it('should have environment variables configured', () => {
        // Just verify Vite is loading correctly
        expect(import.meta.env).toBeDefined();
    });
});
