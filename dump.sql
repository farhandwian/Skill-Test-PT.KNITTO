CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Menggunakan fungsi uuid_generate_v4 untuk UUID
  user_id UUID NOT NULL,
  product_ids UUID[] NOT NULL, -- Menyimpan productIds sebagai array UUID
  date TIMESTAMP DEFAULT NOW() NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb NOT NULL, -- Menyimpan meta sebagai JSONB
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Using uuid_generate_v4 for UUID
  name VARCHAR(255) NOT NULL, -- Product name
  description TEXT NOT NULL, -- Product description
  price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL CHECK (price >= 0), -- Price with two decimals, must be non-negative
  quantity INTEGER NOT NULL CHECK (quantity >= 0), -- Quantity must be non-negative
  color VARCHAR(255) NOT NULL, -- Product color
  meta JSONB DEFAULT '{}'::jsonb NOT NULL, -- Store meta as JSONB
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

INSERT INTO products (
    id,
    name,
    description,
    price,
    quantity,
    color,
    meta,
    created_at,
    updated_at
) VALUES 
(
    uuid_generate_v4(),
    'T-Shirt',
    'Comfortable cotton t-shirt',
    0.00,
    50,  -- Quantity here
    'Blue',
    '{"size": "L", "material": "cotton"}'::jsonb,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Sneakers',
    'High-quality running shoes', 
    75.00,
    30,  -- Quantity here
    'White',
    '{"size": "42", "brand": "Nike"}'::jsonb,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Backpack',
    'Spacious and durable backpack', 
    45.50,
    20,  -- Quantity here
    'Black',
    '{"capacity": "20L", "waterproof": true}'::jsonb,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Wristwatch',
    'Stylish analog wristwatch',
    0.00,
    15,  -- Quantity here
    'Silver',
    '{"brand": "Seiko", "water_resistant": true}'::jsonb,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Sunglasses',
    'UV protection sunglasses',
    30.00,
    40,  -- Quantity here
    'Black',
    '{"polarized": true, "lens_color": "grey"}'::jsonb,
    NOW(),
    NOW()
);
