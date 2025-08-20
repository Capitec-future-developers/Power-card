const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./db');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
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

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Validation middleware for PAN
const validatePAN = (req, res, next) => {
  const { pan } = req.params;
// Basic PAN validation - adjust according to your requirements
  if (!pan || pan.length < 13 || pan.length > 20 || !/^\d+$/.test(pan)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PAN format. PAN must be 13-20 digits.'
    });
  }
  next();
};

// API route to get customer by PAN
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

// API route to search customers by various criteria
app.get('/customers/search', async (req, res) => {
  const {
    name,
    corporate_id,
    client_code,
    phone,
    page = 1,
    limit = 10
  } = req.query;

  try {
    let query = 'SELECT pan, first_name, family_name, corporate_id, client_code, phone FROM customers WHERE 1=1';
    let params = [];
    let paramCount = 0;

    if (name) {
      paramCount++;
      query += ` AND (first_name ILIKE $${paramCount} OR family_name ILIKE $${paramCount})`;
      params.push(`%${name}%`);
    }

    if (corporate_id) {
      paramCount++;
      query += ` AND corporate_id = $${paramCount}`;
      params.push(corporate_id);
    }

    if (client_code) {
      paramCount++;
      query += ` AND client_code = $${paramCount}`;
      params.push(client_code);
    }

    if (phone) {
      paramCount++;
      query += ` AND phone LIKE $${paramCount}`;
      params.push(`%${phone}%`);
    }

// Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

// Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM customers WHERE 1=1';
    let countParams = [];
    let countParamCount = 0;

    if (name) {
      countParamCount++;
      countQuery += ` AND (first_name ILIKE $${countParamCount} OR family_name ILIKE $${countParamCount})`;
      countParams.push(`%${name}%`);
    }

    if (corporate_id) {
      countParamCount++;
      countQuery += ` AND corporate_id = $${countParamCount}`;
      countParams.push(corporate_id);
    }

    if (client_code) {
      countParamCount++;
      countQuery += ` AND client_code = $${countParamCount}`;
      countParams.push(client_code);
    }

    if (phone) {
      countParamCount++;
      countQuery += ` AND phone LIKE $${countParamCount}`;
      countParams.push(`%${phone}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
});

// API route to create a new customer
app.post('/customers', async (req, res) => {
  const {
    pan,
    first_name,
    family_name,
    corporate_id,
    legal_id,
    client_host_id,
    client_code,
    corporate_name,
    phone,
    birth_date,
    address
  } = req.body;

// Basic validation
  if (!pan || !first_name) {
    return res.status(400).json({
      success: false,
      message: 'PAN and first name are required'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO customers
(pan, first_name, family_name, corporate_id, legal_id, client_host_id, client_code, corporate_name, phone, birth_date, address)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
RETURNING pan, first_name, family_name, corporate_id, client_code, phone, created_at`,
      [pan, first_name, family_name, corporate_id, legal_id, client_host_id, client_code, corporate_name, phone, birth_date, address]
    );

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Create customer error:', err);

    if (err.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'Customer with this PAN already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating customer'
    });
  }
});

// API route to update a customer
app.put('/customer/:pan', validatePAN, async (req, res) => {
  const { pan } = req.params;
  const {
    first_name,
    family_name,
    corporate_id,
    legal_id,
    client_host_id,
    client_code,
    corporate_name,
    phone,
    birth_date,
    address
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE customers
SET first_name = COALESCE($1, first_name),
family_name = COALESCE($2, family_name),
corporate_id = COALESCE($3, corporate_id),
legal_id = COALESCE($4, legal_id),
client_host_id = COALESCE($5, client_host_id),
client_code = COALESCE($6, client_code),
corporate_name = COALESCE($7, corporate_name),
phone = COALESCE($8, phone),
birth_date = COALESCE($9, birth_date),
address = COALESCE($10, address),
updated_at = CURRENT_TIMESTAMP
WHERE pan = $11
RETURNING pan, first_name, family_name, corporate_id, client_code, phone, updated_at`,
      [first_name, family_name, corporate_id, legal_id, client_host_id, client_code,
        corporate_name, phone, birth_date, address, pan]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer'
    });
  }
});

// Health check endpoint
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

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Fallback to index.html for client-side routing (if using SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Global error handler
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
