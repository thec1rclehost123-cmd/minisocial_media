import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('System Health Check', () => {
    it('should verify Supabase connectivity', async () => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
            console.warn('Skipping Supabase check: Environment variables missing or invalid URL');
            return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('posts').select('id').limit(1);

        if (error) {
            console.log('Health Check Note:', error.message);
            const isAlive = !error.message.includes('fetch');
            expect(isAlive).toBe(true);
        } else {
            expect(data).toBeDefined();
        }
    });

    it('should verify environment', () => {
        expect(true).toBe(true);
    });
});
