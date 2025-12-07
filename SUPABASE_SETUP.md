# Supabase Database Setup

This document describes the database schema required for the NatureHelp application.

## Database Tables

### 1. profiles

Stores user profile information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  trees_planted INTEGER DEFAULT 0,
  money_donated DECIMAL(10, 2) DEFAULT 0.00,
  co2_absorbed DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles (for leaderboard)
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### 2. contributions

Stores plant contributions from users.

```sql
CREATE TABLE contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_id INTEGER NOT NULL,
  plant_name TEXT NOT NULL,
  location TEXT,
  photo_url TEXT,
  co2_per_year DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all contributions
CREATE POLICY "Contributions are viewable by everyone" 
  ON contributions FOR SELECT 
  USING (true);

-- Policy: Users can insert their own contributions
CREATE POLICY "Users can insert their own contributions" 
  ON contributions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Index for better performance
CREATE INDEX idx_contributions_user_id ON contributions(user_id);
CREATE INDEX idx_contributions_created_at ON contributions(created_at DESC);
```

### 3. donations

Stores donation records from users.

```sql
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all donations (for stats)
CREATE POLICY "Donations are viewable by everyone" 
  ON donations FOR SELECT 
  USING (true);

-- Policy: Users can insert their own donations
CREATE POLICY "Users can insert their own donations" 
  ON donations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Index for better performance
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each table creation script above
4. Execute each script one by one
5. Verify that the tables are created in the Table Editor

## Authentication Setup

The application uses Supabase Auth with email/password authentication:

1. In Supabase Dashboard, go to Authentication > Settings
2. Enable Email provider
3. Configure email templates if needed
4. The application handles user signup and profile creation automatically

## Notes

- All tables have Row Level Security (RLS) enabled for data protection
- Users can only modify their own data but can view public data (leaderboard, stats)
- New users start with zero trees planted, zero donations, and zero CO2 absorbed
- All monetary values use DECIMAL for precision
- Timestamps are stored with timezone information
