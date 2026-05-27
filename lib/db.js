const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

let db = null;
let ready = false;

function getDb() {
  if (ready && db) return db;
  const SQL = require('sql.js');
  db = new SQL.Database();

  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL, active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT, phone TEXT, company TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, client_id INTEGER, description TEXT, budget_hours REAL DEFAULT 0, hourly_rate REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, title TEXT NOT NULL, description TEXT, assigned_to INTEGER, status TEXT DEFAULT 'pending', category TEXT DEFAULT 'general', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS time_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, user_id INTEGER, hours REAL NOT NULL, description TEXT, entry_date DATE DEFAULT (date('now')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, client_id INTEGER, amount REAL NOT NULL, status TEXT DEFAULT 'pending', due_date DATE, paid_date DATE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS approvals (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, requested_by INTEGER, approved_by INTEGER, status TEXT DEFAULT 'pending', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  const existing = db.exec("SELECT id FROM users WHERE email='master@proyectflow.app'");
  if (!existing.length || !existing[0].values.length) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.run("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", ['Master Admin', 'master@proyectflow.app', hash, 'master']);
    db.run("INSERT INTO clients (name, company, email) VALUES (?, ?, ?)", ['TechCorp', 'TechCorp Inc.', 'contacto@techcorp.com']);
    db.run("INSERT INTO clients (name, company, email) VALUES (?, ?, ?)", ['Agencia Creativa', 'Agencia Creativa S.A.', 'info@agenciacreativa.com']);
    db.run("INSERT INTO projects (name, client_id, description, budget_hours, hourly_rate) VALUES (?, ?, ?, ?, ?)", ['Rediseño Web', 1, 'Rediseño completo sitio corporativo', 120, 45]);
  }
  ready = true;
  return db;
}

getDb();

module.exports = { prepare(sql) { return new Statement(sql); }, exec(sql) { getDb().run(sql); } };

class Statement {
  constructor(sql) { this.sql = sql; }
  run(...p) { getDb().run(this.sql, p); return { lastInsertRowid: 0, changes: 1 }; }
  get(...p) { const d = getDb(); const s = d.prepare(this.sql); s.bind(p); if (s.step()) { const c = s.getColumnNames(); const v = s.get(); s.free(); const r = {}; c.forEach((x,i) => r[x]=v[i]); return r; } s.free(); return null; }
  all(...p) { const d = getDb(); const s = d.prepare(this.sql); s.bind(p); const rows = []; while (s.step()) { const c = s.getColumnNames(); const v = s.get(); const r = {}; c.forEach((x,i) => r[x]=v[i]); rows.push(r); } s.free(); return rows; }
}
