import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// We'll use a test that checks if the Supabase service is reachable
describe('System Health Check', () => {
    it('should verify Supabase connectivity', async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('Skipping Supabase check: Environment variables missing');
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Simple request to check if service is up
        const { data, error } = await supabase.from('posts').select('id').limit(1);

        // We don't necessarily need data, just no circular connection error or authentication error (unless RLS blocks anon)
        // If the table exists and DB is up, this should respond.
        if (error) {
            console.log('Health Check Note:', error.message);
            // We allow RLS errors as they mean the DB is alive but protected
            const isAlive = !error.message.includes('fetch');
            expect(isAlive).toBe(true);
        } else {
            expect(data).toBeDefined();
        }
    });

    it('should verify build environment', () => {
        expect(process.env.NODE_ENV).toBeDefined();
    });
});
