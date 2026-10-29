import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// With TURSO_DATABASE_URL set (production) the data lives in Turso.
// Without it (local dev) the same code reads the local SQLite file; DB_PATH overrides its location.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'kwaaba.db');

export const COLLECTIONS = [
  'slides', 'stats', 'programs', 'board', 'team',
  'events', 'posts', 'gallery', 'newsletters', 'quotes',
  'about', 'founder', 'settings', 'photoAlbums', 'photos'
];

let _db = null;

function safeName(name) {
  return '"' + name.replace(/"/g, '""') + '"';
}

const UPSERT = (collection) =>
  `INSERT INTO ${safeName(collection)} (id, data, order_index, updated_at) VALUES (?, ?, ?, datetime('now'))
   ON CONFLICT(id) DO UPDATE SET data=excluded.data, order_index=excluded.order_index, updated_at=datetime('now')`;

export function getDb() {
  if (!_db) {
    _db = process.env.TURSO_DATABASE_URL
      ? createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN })
      : createClient({ url: pathToFileURL(DB_PATH).href });
  }
  return _db;
}

export function describeDb() {
  return process.env.TURSO_DATABASE_URL ? `Turso (${process.env.TURSO_DATABASE_URL})` : DB_PATH;
}

export async function initDb() {
  const db = getDb();
  await db.batch(COLLECTIONS.flatMap((collection) => [
    `CREATE TABLE IF NOT EXISTS ${safeName(collection)} (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_${collection}_order ON ${safeName(collection)} (order_index)`,
  ]), 'write');
  console.log('Database initialized at', describeDb());
}

export async function upsertItem(collection, id, data, orderIndex = 0) {
  const result = await getDb().execute({ sql: UPSERT(collection), args: [id, JSON.stringify(data), orderIndex] });
  return { id, changes: result.rowsAffected };
}

export async function deleteItem(collection, id) {
  const result = await getDb().execute({ sql: `DELETE FROM ${safeName(collection)} WHERE id = ?`, args: [id] });
  return { changes: result.rowsAffected };
}

export async function getCollection(collection) {
  const { rows } = await getDb().execute(`SELECT id, data, order_index FROM ${safeName(collection)} ORDER BY order_index ASC`);
  return rows.map(row => ({ ...JSON.parse(row.data), id: row.id, order: Number(row.order_index) }));
}

export async function getAllContent() {
  // One round trip for all collections — matters when the database is remote.
  const results = await getDb().batch(
    COLLECTIONS.map((collection) => `SELECT id, data FROM ${safeName(collection)} ORDER BY order_index ASC`),
    'read'
  );
  const content = {};
  COLLECTIONS.forEach((collection, i) => {
    content[collection] = results[i].rows.map(row => ({ ...JSON.parse(row.data), id: row.id }));
  });
  return content;
}

export async function upsertContent(data) {
  const statements = [];
  for (const [collection, items] of Object.entries(data)) {
    items.forEach((item, idx) => {
      statements.push({ sql: UPSERT(collection), args: [item.id, JSON.stringify(item), idx] });
    });
  }
  if (statements.length) await getDb().batch(statements, 'write');
}
