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

    // Store parsed medical documents on profile
    await ensureColumn(
      "health_profiles",
      "medical_docs_json",
      "medical_docs_json JSONB"
    );

    // Ensure meals has expected columns
    await ensureColumn("meals", "food_data_json", "food_data_json JSONB");
    await ensureColumn(
      "meals",
      "created_at",
      "created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()"
    );

    // Grocery items table (per-user persistent shopping list)
    // Determine users.id type to ensure FK type matches (uuid vs integer, etc.)
    const { rows: userIdTypeRows } = await client.query(
      `SELECT data_type, udt_name FROM information_schema.columns WHERE table_name='users' AND column_name='id'`
    );
    const colType =
      userIdTypeRows[0]?.udt_name || userIdTypeRows[0]?.data_type || "uuid";
    let userIdSqlType = "UUID";
    if (/^int4$|^integer$/i.test(colType)) userIdSqlType = "INTEGER";
    else if (/^int8$|^bigint$/i.test(colType)) userIdSqlType = "BIGINT";
    else if (/^uuid$/i.test(colType)) userIdSqlType = "UUID";
    else if (/^text$/i.test(colType)) userIdSqlType = "TEXT";
    else if (/^varchar|^character varying$/i.test(colType))
      userIdSqlType = "TEXT";

    await client.query(`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id ${userIdSqlType} REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        category TEXT,
        quantity DOUBLE PRECISION,
        unit TEXT,
        price NUMERIC(10,2),
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_grocery_items_user_id ON grocery_items(user_id)`
    );
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_grocery_items_completed ON grocery_items(user_id, completed)`
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
