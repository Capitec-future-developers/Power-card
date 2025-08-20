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

-- 2. Create an index on corporate_id for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_corporate_id ON customers(corporate_id);

-- 3. Insert sample data, ignoring duplicates
INSERT INTO customers (
  pan, first_name, family_name, corporate_id, legal_id, client_host_id, client_code,
  corporate_name, phone, birth_date, address
) VALUES
    ('4644090987127908', 'John', 'Doe', 'CORP001', 'L12345', 'CH001', 'C001', 'Acme Corp', '0655511132', '1990-01-01', '123 Main St'),
    ('1234567890123456', 'Jane', 'Smith', 'CORP002', 'L67890', 'CH002', 'C002', 'Globex Ltd', '0655522233', '1995-05-05', '456 Oak Ave')
ON CONFLICT (pan) DO NOTHING;

-- 4. Select example to verify data
SELECT * FROM customers WHERE pan = '4644090987127908';

-- 5. Function to automatically update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to call the update_updated_at function on updates
DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'trg_update_customers_updated_at'
    ) THEN
      CREATE TRIGGER trg_update_customers_updated_at
        BEFORE UPDATE ON customers
        FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    END IF;
  END
$$;
