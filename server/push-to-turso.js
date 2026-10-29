// Copy every collection from the local kwaaba.db into the Turso database in server/.env.
// Usage: npm run db:push   (safe to re-run — rows are replaced, not duplicated)
import './setup.js';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { COLLECTIONS, getDb, initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'kwaaba.db');

if (!process.env.TURSO_DATABASE_URL) {
  console.error('TURSO_DATABASE_URL is not set in server/.env — nothing to push to.');
  process.exit(1);
}

const local = createClient({ url: pathToFileURL(LOCAL_PATH).href });
const remote = getDb();
await initDb();

for (const collection of COLLECTIONS) {
  const table = '"' + collection + '"';
  const { rows } = await local.execute(`SELECT id, data, order_index, created_at, updated_at FROM ${table}`);
  for (let i = 0; i < rows.length; i += 200) {
    await remote.batch(rows.slice(i, i + 200).map((r) => ({
      sql: `INSERT OR REPLACE INTO ${table} (id, data, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [r.id, r.data, r.order_index, r.created_at, r.updated_at],
    })), 'write');
  }
  const { rows: [{ n }] } = await remote.execute(`SELECT count(*) AS n FROM ${table}`);
  console.log(`${collection.padEnd(12)} local ${String(rows.length).padStart(5)}  →  turso ${String(n).padStart(5)}`);
}
console.log('\nDone.');
