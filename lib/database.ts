import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'finance.db');
const db = new Database(dbPath);

// Inizializza il database con le tabelle necessarie
export function initDatabase() {
  // Tabella partners (i due membri della coppia)
  db.exec(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#3b82f6'
    )
  `);

  // Tabella income (stipendi mensili)
  db.exec(`
    CREATE TABLE IF NOT EXISTS income (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  // Tabella expenses (spese)
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      is_shared INTEGER DEFAULT 0,
      paid_by INTEGER NOT NULL,
      FOREIGN KEY (partner_id) REFERENCES partners(id),
      FOREIGN KEY (paid_by) REFERENCES partners(id)
    )
  `);

  // Tabella investments (investimenti)
  db.exec(`
    CREATE TABLE IF NOT EXISTS investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      symbol TEXT,
      description TEXT,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  // Tabella investment_allocations (allocazioni per diversificazione)
  db.exec(`
    CREATE TABLE IF NOT EXISTS investment_allocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      percentage REAL NOT NULL,
      symbol TEXT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#3b82f6'
    )
  `);

  // Inserisci i due partner se non esistono
  const partners = db.prepare('SELECT COUNT(*) as count FROM partners').get() as { count: number };
  if (partners.count === 0) {
    db.prepare('INSERT INTO partners (name, color) VALUES (?, ?)').run('Partner 1', '#3b82f6');
    db.prepare('INSERT INTO partners (name, color) VALUES (?, ?)').run('Partner 2', '#ec4899');
  }

  // Inserisci allocazioni di default se non esistono
  const allocations = db.prepare('SELECT COUNT(*) as count FROM investment_allocations').get() as { count: number };
  if (allocations.count === 0) {
    const defaultAllocations = [
      { type: 'ETF', percentage: 40, symbol: 'VWCE.DE', name: 'Vanguard FTSE All-World', color: '#3b82f6' },
      { type: 'ETF', percentage: 30, symbol: 'SWDA.MI', name: 'iShares Core MSCI World', color: '#06b6d4' },
      { type: 'PAC', percentage: 20, symbol: 'IWDA.AS', name: 'iShares Core MSCI World (PAC)', color: '#8b5cf6' },
      { type: 'Commodity', percentage: 10, symbol: 'GOLD', name: 'Oro', color: '#f59e0b' },
    ];

    const stmt = db.prepare('INSERT INTO investment_allocations (type, percentage, symbol, name, color) VALUES (?, ?, ?, ?, ?)');
    defaultAllocations.forEach(alloc => {
      stmt.run(alloc.type, alloc.percentage, alloc.symbol, alloc.name, alloc.color);
    });
  }
}

// Inizializza il database all'avvio
initDatabase();

export default db;
