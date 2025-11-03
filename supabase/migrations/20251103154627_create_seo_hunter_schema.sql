/*
  # SEO Hunter - Product Optimization Platform Schema

  ## Overview
  Complete database schema for an AI-powered SEO optimization platform that helps
  businesses optimize product listings for search engines and AI search tools.

  ## Tables Created

  ### 1. profiles
  - Extends auth.users with business profile information
  - Tracks subscription tier and usage limits
  - Fields: id, email, company_name, subscription_tier, products_optimized_this_month, max_products_per_month, created_at, updated_at

  ### 2. products
  - Core product catalog with original content
  - Fields: id, user_id, title, description, image_url, alt_text, metafields (JSONB), status, created_at, updated_at

  ### 3. optimizations
  - AI-generated optimized versions of product content
  - Fields: id, product_id, user_id, optimized_title, optimized_description, optimized_alt_text, optimized_metafields (JSONB), score, status (draft/approved/rejected), created_at, approved_at

  ### 4. ab_tests
  - A/B test configurations comparing original vs optimized content
  - Fields: id, product_id, optimization_id, user_id, variant_a_views, variant_b_views, variant_a_clicks, variant_b_clicks, status (active/completed), winner, started_at, ended_at

  ### 5. snapshots
  - Point-in-time backups for rollback functionality
  - Fields: id, user_id, name, description, product_count, snapshot_data (JSONB), created_at

  ### 6. usage_logs
  - Track optimization operations for billing
  - Fields: id, user_id, operation_type, products_count, created_at

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies for SELECT, INSERT, UPDATE, DELETE operations

  ## Indexes
  - Performance indexes on foreign keys and frequently queried fields
  - Composite indexes for common query patterns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  company_name text DEFAULT '',
  subscription_tier text NOT NULL DEFAULT 'free',
  products_optimized_this_month integer DEFAULT 0,
  max_products_per_month integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  alt_text text DEFAULT '',
  metafields jsonb DEFAULT '{}',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Optimizations table
CREATE TABLE IF NOT EXISTS optimizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  optimized_title text NOT NULL,
  optimized_description text DEFAULT '',
  optimized_alt_text text DEFAULT '',
  optimized_metafields jsonb DEFAULT '{}',
  score integer DEFAULT 0,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

ALTER TABLE optimizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own optimizations"
  ON optimizations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own optimizations"
  ON optimizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own optimizations"
  ON optimizations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own optimizations"
  ON optimizations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- A/B Tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  optimization_id uuid NOT NULL REFERENCES optimizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variant_a_views integer DEFAULT 0,
  variant_b_views integer DEFAULT 0,
  variant_a_clicks integer DEFAULT 0,
  variant_b_clicks integer DEFAULT 0,
  status text DEFAULT 'active',
  winner text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ab_tests"
  ON ab_tests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ab_tests"
  ON ab_tests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ab_tests"
  ON ab_tests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ab_tests"
  ON ab_tests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Snapshots table
CREATE TABLE IF NOT EXISTS snapshots (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  product_count integer DEFAULT 0,
  snapshot_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
  ON snapshots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots"
  ON snapshots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own snapshots"
  ON snapshots FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operation_type text NOT NULL,
  products_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage_logs"
  ON usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage_logs"
  ON usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_optimizations_product_id ON optimizations(product_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_user_id ON optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_status ON optimizations(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_product_id ON ab_tests(product_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at);