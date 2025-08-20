const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'Omphile',
  host: 'localhost',
  database: 'database',
  password: 'Omphile725*',
  port: 5432
});

// Updated path to the SQL file inside the seed folder
const sqlFile = path.join(__dirname, 'seed', 'database.sql');
const sql = fs.readFileSync(sqlFile).toString();

pool.query(sql)
  .then(() => {
    console.log('SQL script executed successfully');
    pool.end();
  })
  .catch(err => {
    console.error('Error executing SQL script:', err);
    pool.end();
  });
