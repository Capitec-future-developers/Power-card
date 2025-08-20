CREATE TABLE IF NOT EXISTS orders (
                                    id SERIAL PRIMARY KEY,
                                    pan VARCHAR(20) REFERENCES customers(pan) ON DELETE CASCADE,
                                    product_name VARCHAR(100) NOT NULL,
                                    quantity INT NOT NULL,
                                    price NUMERIC(10,2) NOT NULL,
                                    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional index for faster lookups by customer
CREATE INDEX IF NOT EXISTS idx_orders_pan ON orders(pan);
