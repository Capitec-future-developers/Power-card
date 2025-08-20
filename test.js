const pool = require('./src/db'); // make sure src/db.js exists

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL time:', res.rows[0]);
  } catch (err) {
    console.error('❌ Connection test failed:', err);
  } finally {
    await pool.end();
  }
})();
