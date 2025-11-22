const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS organisations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      organisation_id INT REFERENCES organisations(id),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin'
    );

    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      organisation_id INT REFERENCES organisations(id),
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      organisation_id INT REFERENCES organisations(id),
      name VARCHAR(255) NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS employee_teams (
      id SERIAL PRIMARY KEY,
      employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
      team_id INT REFERENCES teams(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      organisation_id INT,
      user_id INT,
      action VARCHAR(255),
      meta JSONB,
      timestamp TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ PostgreSQL ready");
}

module.exports = { pool, initializeDatabase };
