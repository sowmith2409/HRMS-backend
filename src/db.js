const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function initDB() {
  const db = await open({
    filename: path.join(__dirname, "../hrms.db"),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS organisations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organisation_id INTEGER,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organisation_id INTEGER,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT
    );

    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organisation_id INTEGER,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS employee_teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      team_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organisation_id INTEGER,
      user_id INTEGER,
      action TEXT,
      meta TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

module.exports = initDB;
