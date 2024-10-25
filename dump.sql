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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Menggunakan fungsi uuid_generate_v4 untuk UUID
  name VARCHAR(255) NOT NULL, -- Nama produk
  description TEXT NOT NULL, -- Deskripsi produk
  price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL CHECK (price >= 0), -- Harga dengan dua desimal, tidak boleh negatif
  quantity NOT NULL CHECK (price >= 0), -- Harga dengan dua desimal, tidak boleh negatif
  color VARCHAR(255) NOT NULL, -- Warna produk
  meta JSONB DEFAULT '{}'::jsonb NOT NULL, -- Menyimpan meta sebagai JSONB
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);


INSERT INTO products (
    id,
    name,
    description,
    price,
    color,
    meta,
    created_at,
    updated_at,
    quantity
) VALUES 
(
    uuid_generate_v4(),
    'T-Shirt',
    'Comfortable cotton t-shirt',00,
    'Blue',
    '{"size": "L", "material": "cotton"}'::jsonb,
    NOW(),
    NOW(),
    50
),
(
    uuid_generate_v4(),
    'Sneakers',
    'High-quality running shoes', 75.00,
    'White',
    '{"size": "42", "brand": "Nike"}'::jsonb,
    NOW(),
    NOW(),
    30
),
(
    uuid_generate_v4(),
    'Backpack',
    'Spacious and durable backpack', 45.50,
    'Black',
    '{"capacity": "20L", "waterproof": true}'::jsonb,
    NOW(),
    NOW(),
    20
),
(
    uuid_generate_v4(),
    'Wristwatch',
    'Stylish analog wristwatch',0,
    'Silver',
    '{"brand": "Seiko", "water_resistant": true}'::jsonb,
    NOW(),
    NOW(),
    15
),
(
    uuid_generate_v4(),
    'Sunglasses',
    'UV protection sunglasses',
    30.00,
    'Black',
    '{"polarized": true, "lens_color": "grey"}'::jsonb,
    NOW(),
    NOW(),
    40
);

