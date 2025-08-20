require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

(async () => {
  try {
    // Test DB connection
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Database connected. Current time:', res.rows[0].now);

    // Test if the "customers" table exists
    const tableCheck = await pool.query(`
      SELECT to_regclass('public.customers') AS table_exists;
    `);

    if (tableCheck.rows[0].table_exists) {
      console.log('✅ Table "customers" exists in the database');
    } else {
      console.error('❌ Table "customers" does NOT exist. Run migrations.');
    }

    // Optional: Count rows in "customers"
    const countRes = await pool.query('SELECT COUNT(*) FROM customers');
    console.log('Total customers in DB:', countRes.rows[0].count);

  } catch (err) {
    console.error('❌ Database error:', err.message);
  } finally {
    await pool.end();
  }
})();
