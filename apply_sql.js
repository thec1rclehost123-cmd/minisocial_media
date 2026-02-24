import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const connectionString = "postgresql://postgres.bpwrkrkbipqwxxgqpwni:Shriswamisamarth@1@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function applySql() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected successfully.');

        const sqlPath = path.join(process.cwd(), 'DATABASE_MASTER.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying SQL script...');
        await client.query(sql);
        console.log('SQL script applied successfully!');

    } catch (err) {
        console.error('Error applying SQL Details:');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Position:', err.position);
        if (err.hint) console.error('Hint:', err.hint);
        if (err.where) console.error('Where:', err.where);
    } finally {
        await client.end();
    }
}

applySql();
