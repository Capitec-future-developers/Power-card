require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function migrate() {
  try {
    // 1. Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
                                             pan VARCHAR(20) PRIMARY KEY,
                                             first_name VARCHAR(50) NOT NULL,
                                             family_name VARCHAR(50),
                                             corporate_id VARCHAR(20),
                                             legal_id VARCHAR(20),
                                             client_host_id VARCHAR(20),
                                             client_code VARCHAR(20),
                                             corporate_name VARCHAR(100),
                                             phone VARCHAR(20),
                                             birth_date DATE,
                                             address TEXT,
                                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_customers_corporate_id
        ON customers(corporate_id);
    `);

    // 3. Insert sample data
    await pool.query(`
      INSERT INTO customers (
        pan, first_name, family_name, corporate_id, legal_id, client_host_id, client_code,
        corporate_name, phone, birth_date, address
      ) VALUES
          ('4644090987127908', 'John', 'Doe', 'CORP001', 'L12345', 'CH001', 'C001', 'Acme Corp', '0655511132', '1990-01-01', '123 Main St'),
          ('1234567890123456', 'Jane', 'Smith', 'CORP002', 'L67890', 'CH002', 'C002', 'Globex Ltd', '0655522233', '1995-05-05', '456 Oak Ave')
      ON CONFLICT (pan) DO NOTHING;
    `);

    // 4. Create function for updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
         NEW.updated_at = NOW();
         RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 5. Create trigger on customers table
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_customers_updated_at'
        ) THEN
          CREATE TRIGGER trg_update_customers_updated_at
          BEFORE UPDATE ON customers
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END
      $$;
    `);

    console.log('Migration completed successfully with updated_at trigger!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
