const initSqlJs = require('sql.js');

let db = null;

function init() {
  if (db) return db;
  const SQL = initSqlJs();
  db = new SQL.Database();
  
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password_hash TEXT, role TEXT, active INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, company TEXT, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, client_id INTEGER, description TEXT, budget_hours REAL DEFAULT 0, hourly_rate REAL DEFAULT 0, status TEXT DEFAULT 'active', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, title TEXT, description TEXT, assigned_to INTEGER, status TEXT DEFAULT 'pending', category TEXT DEFAULT 'general', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS time_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, user_id INTEGER, hours REAL, description TEXT, entry_date DATE DEFAULT (date('now')), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER, client_id INTEGER, amount REAL, status TEXT DEFAULT 'pending', due_date DATE, paid_date DATE, notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS approvals (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER, requested_by INTEGER, approved_by INTEGER, status TEXT DEFAULT 'pending', notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  
  const row = db.exec("SELECT id FROM users WHERE email='master@proyectflow.app'");
  if (!row.length) {
    db.run("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", ['Master Admin', 'master@proyectflow.app', '$2y$10$LrYX8wHFhC5sVFqJhGk7fOR8Z0YKZn5Yq5Yq5Yq5Yq5Yq5Yq5Yq5', 'master']);
  }
  return db;
}

init();

module.exports = {
  prepare(sql) { return new Statement(sql); },
  exec(sql) { init().run(sql); }
};

class Statement {
  constructor(sql) { this.sql = sql; }
  run(...p) { init().run(this.sql, p); return { lastInsertRowid: 0, changes: 1 }; }
  get(...p) {
    const d = init();
    const s = d.prepare(this.sql); s.bind(p);
    if (s.step()) { const c = s.getColumnNames(); const v = s.get(); s.free(); const r = {}; c.forEach((x,i)=>r[x]=v[i]); return r; }
    s.free(); return null;
  }
  all(...p) {
    const d = init();
    const s = d.prepare(this.sql); s.bind(p); const rows = [];
    while (s.step()) { const c = s.getColumnNames(); const v = s.get(); const r = {}; c.forEach((x,i)=>r[x]=v[i]); rows.push(r); }
    s.free(); return rows;
  }
};
