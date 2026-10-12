import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'kwaaba.db');

const COLLECTIONS = [
  'slides', 'stats', 'programs', 'board', 'team',
  'events', 'posts', 'gallery', 'newsletters', 'quotes',
  'about', 'founder', 'settings', 'photoAlbums', 'photos'
];

let _db = null;

function safeName(name) {
  return '"' + name.replace(/"/g, '""') + '"';
}

export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
  }
  return _db;
}

export function initDb() {
  const db = getDb();
  for (const collection of COLLECTIONS) {
    db.exec(`CREATE TABLE IF NOT EXISTS ${safeName(collection)} (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_${collection}_order ON ${safeName(collection)} (order_index)`);
  }
  console.log('Database initialized at', DB_PATH);
}

export function upsertItem(collection, id, data, orderIndex = 0) {
  const db = getDb();
  const serialized = JSON.stringify(data);
  const stmt = db.prepare(
    `INSERT INTO ${safeName(collection)} (id, data, order_index, updated_at) VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET data=?, order_index=?, updated_at=datetime('now')`
  );
  const result = stmt.run(id, serialized, orderIndex, serialized, orderIndex);
  return { id, changes: result.changes };
}

export function deleteItem(collection, id) {
  const db = getDb();
  const result = db.prepare(`DELETE FROM ${safeName(collection)} WHERE id = ?`).run(id);
  return { changes: result.changes };
}

export function getCollection(collection) {
  const db = getDb();
  const rows = db.prepare(`SELECT id, data, order_index FROM ${safeName(collection)} ORDER BY order_index ASC`).all();
  return rows.map(row => ({ ...JSON.parse(row.data), id: row.id, order: row.order_index }));
}

export function getAllContent() {
  const db = getDb();
  const collections = [
    'slides', 'stats', 'programs', 'board', 'team',
    'events', 'posts', 'gallery', 'newsletters', 'quotes',
    'about', 'founder', 'settings', 'photoAlbums', 'photos'
  ];
  const result = {};
  for (const collection of collections) {
    const rows = db.prepare(`SELECT id, data FROM ${safeName(collection)} ORDER BY order_index ASC`).all();
    result[collection] = rows.map(row => ({ ...JSON.parse(row.data), id: row.id }));
  }
  return result;
}

export function upsertContent(data) {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO ${safeName('_table_placeholder_')} (id, data, order_index, updated_at) VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET data=?, order_index=?, updated_at=datetime('now')`
  );

  for (const [collection, items] of Object.entries(data)) {
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const serialized = JSON.stringify(item);
      const stmt = db.prepare(
        `INSERT INTO ${safeName(collection)} (id, data, order_index, updated_at) VALUES (?, ?, ?, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET data=?, order_index=?, updated_at=datetime('now')`
      );
      stmt.run(item.id, serialized, idx, serialized, idx);
    }
  }
}