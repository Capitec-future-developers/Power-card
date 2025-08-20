-- 1. Create the customers table with timestamps and better constraints
CREATE TABLE IF NOT EXISTS customers (
                                       pan VARCHAR(20) PRIMARY KEY CHECK (LENGTH(pan) >= 13),
                                       first_name VARCHAR(50) NOT NULL,
                                       family_name VARCHAR(50),
                                       corporate_id VARCHAR(20),
                                       legal_id VARCHAR(20),
                                       client_host_id VARCHAR(20),
                                       client_code VARCHAR(20),
                                       corporate_name VARCHAR(100),
                                       phone VARCHAR(20),
                                       birth_date DATE CHECK (birth_date <= CURRENT_DATE),
                                       address TEXT,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       CONSTRAINT unique_legal_id UNIQUE (legal_id)
);

-- 2. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_corporate_id ON customers(corporate_id);
CREATE INDEX IF NOT EXISTS idx_customers_client_code ON customers(client_code);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(first_name, family_name);

-- 3. Insert sample data with South African clients and valid PAN prefixes
INSERT INTO customers (
  pan, first_name, family_name, corporate_id, legal_id,
  client_host_id, client_code, corporate_name, phone, birth_date, address
) VALUES
    ('4644090987127908', 'Omphile', 'Mohlala', 'CORP001', 'L12345', 'CH001', 'C001',
     'Mzansi Tech', '0825511132', '1990-01-01', '12 Rose Street, Johannesburg, SA'),
    ('4140123456789012', 'Spencer', 'Nong', 'CORP002', 'L67890', 'CH002', 'C002',
     'Cape Innovations', '0815522233', '1995-05-05', '45 Oak Avenue, Cape Town, SA'),
    ('4644987654321098', 'Zenzi', 'Dube', 'CORP003', 'L54321', 'CH003', 'C003',
     'Durban Solutions', '0835533344', '1985-12-15', '78 Pine Road, Durban, SA')
ON CONFLICT (pan) DO NOTHING;

-- 4. Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for updated_at
DROP TRIGGER IF EXISTS trg_update_customers_updated_at ON customers;
CREATE TRIGGER trg_update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Create a view for commonly accessed customer data
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  pan,
  first_name || ' ' || COALESCE(family_name, '') as full_name,
  corporate_name,
  phone,
  EXTRACT(YEAR FROM AGE(birth_date)) as age,
  created_at
FROM customers;
