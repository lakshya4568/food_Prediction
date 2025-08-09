#!/usr/bin/env node
require("dotenv").config();
const { Pool } = require("pg");

const required = [
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_USER",
  "POSTGRES_DB",
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required environment variables:", missing.join(", "));
  process.exit(1);
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Enable required extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Health profiles
    await client.query(`
      CREATE TABLE IF NOT EXISTS health_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        age INT,
        gender VARCHAR(50),
        allergies TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);

    // Meals
    await client.query(`
      CREATE TABLE IF NOT EXISTS meals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        food_data_json JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
    `);

    // Ensure columns exist (migrations-lite)
    const ensureColumn = async (table, column, ddl) => {
      const { rows } = await client.query(
        `SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
        [table, column]
      );
      if (!rows[0]) {
        console.log(`Altering ${table}: adding ${column}`);
        await client.query(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
      }
    };

    await ensureColumn(
      "users",
      "created_at",
      "created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()"
    );
    await ensureColumn(
      "users",
      "updated_at",
      "updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()"
    );

    await client.query("COMMIT");
    console.log("Database setup complete.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("DB setup failed:", e.message);
    process.exit(2);
  } finally {
    client.release();
    await pool.end();
  }
})();
