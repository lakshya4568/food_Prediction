#!/usr/bin/env node
/**
 * Quick Postgres connectivity & schema smoke test.
 * Usage: node scripts/test-db-connection.js
 * Requires env vars: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
 */
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
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
});

(async () => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    const now = await client.query("SELECT NOW() as now");
    console.log("Connected. Server time:", now.rows[0].now);

    // Check expected tables
    const tables = ["users", "health_profiles", "meals"];
    const results = {};
    for (const t of tables) {
      const r = await client.query(`SELECT to_regclass($1) as exists`, [t]);
      results[t] = !!r.rows[0].exists;
    }
    console.table(results);

    // Simple row counts (non-fatal if error)
    for (const t of tables) {
      if (!results[t]) continue;
      try {
        const c = await client.query(`SELECT COUNT(*)::int FROM ${t}`);
        console.log(`${t} row count:`, c.rows[0].count);
      } catch (e) {
        console.warn(`Could not count rows for ${t}:`, e.message);
      }
    }

    client.release();
    await pool.end();
    console.log(`Done in ${Date.now() - start} ms`);
    process.exit(0);
  } catch (e) {
    console.error("DB connection test failed:", e.message);
    process.exit(2);
  }
})();
