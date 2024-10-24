CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  images TEXT[] DEFAULT '{}'::text[] NOT NULL, -- Menyimpan gambar sebagai array teks
  price NUMERIC(10, 2) DEFAULT 0.00 NOT NULL CHECK (price >= 0), -- Harga dengan dua desimal, tidak boleh negatif
  color VARCHAR(255) NOT NULL, -- Warna produk
  meta JSONB DEFAULT '{}'::jsonb NOT NULL, -- Menyimpan meta sebagai JSONB
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
