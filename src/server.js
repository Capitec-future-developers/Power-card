const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"]
    },
  },
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/
app.use(express.static(path.join(__dirname, '..')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


const validatePAN = (req, res, next) => {
  const { pan } = req.params;
  if (!pan || pan.length < 13 || pan.length > 20 || !/^\d+$/.test(pan)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PAN format. PAN must be 13-20 digits.'
    });
  }
  next();
};

app.get('/customer/:pan', validatePAN, async (req, res) => {
  const { pan } = req.params;
  try {
    const result = await pool.query(
      'SELECT pan, first_name, family_name, corporate_id, legal_id, client_host_id, client_code, corporate_name, phone, birth_date, address, created_at, updated_at FROM customers WHERE pan = $1',
      [pan]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PAN not found in our records'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving customer data'
    });
  }
});


app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server and database are running correctly',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});


app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
