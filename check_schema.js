import pg from 'pg';

const { Client } = pg;
const connectionString = "postgresql://postgres.bpwrkrkbipqwxxgqpwni:Shriswamisamarth@1@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function checkColumns() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const tables = ['profiles', 'posts', 'post_likes', 'comments', 'follows'];
        for (const table of tables) {
            const res = await client.query(`
                SELECT column_name FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name = $1;
            `, [table]);
            const cols = res.rows.map(r => r.column_name);
            console.log(`Table: ${table}`);
            console.log(`Columns: ${cols.join(', ')}`);
            console.log('---');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkColumns();
