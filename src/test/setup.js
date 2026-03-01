import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Manually cleanup after each test to ensure fresh DOM state
afterEach(() => {
    cleanup();
});
