const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️  Neon database connection string not found. Using fallback mode.');
  console.warn('   Please set DATABASE_URL in your .env file');
}

const sql = connectionString ? neon(connectionString) : null;

module.exports = sql;

