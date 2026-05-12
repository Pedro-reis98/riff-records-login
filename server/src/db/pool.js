const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const ssl =
  process.env.DB_SSL === "true" || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
  connectionString,
  ssl,
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'email'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'login'
      ) THEN
        ALTER TABLE users RENAME COLUMN email TO login;
      END IF;
    END $$;

    ALTER TABLE users
      DROP COLUMN IF EXISTS email_verified_at,
      DROP COLUMN IF EXISTS email_verification_token_hash,
      DROP COLUMN IF EXISTS email_verification_expires_at,
      DROP COLUMN IF EXISTS password_reset_token_hash,
      DROP COLUMN IF EXISTS password_reset_expires_at;

    CREATE UNIQUE INDEX IF NOT EXISTS users_login_idx ON users (login);
  `);
}

module.exports = {
  ensureSchema,
  pool,
};
