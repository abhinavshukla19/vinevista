require('dotenv').config();
const { Pool } = require('pg');

const database = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = database;
