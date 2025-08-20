const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432
});

// Endpoint to get customer by PAN
app.get('/customer/:pan', async (req, res) => {
  const { pan } = req.params;

  try {
    const result = await pool.query('SELECT * FROM customers WHERE pan = $1', [pan]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'PAN not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
