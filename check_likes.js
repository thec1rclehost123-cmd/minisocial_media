import pg from 'pg';

const { Client } = pg;
const connectionString = "postgresql://postgres.bpwrkrkbipqwxxgqpwni:Shriswamisamarth@1@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function checkLikes() {
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_likes'");
        console.log('post_likes columns:', res.rows.map(r => r.column_name));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkLikes();
