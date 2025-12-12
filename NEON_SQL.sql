-- SQL Script to create contact_messages table in Neon
-- Run this in Neon SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON contact_messages(created_at DESC);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_messages_email 
ON contact_messages(email);

-- Verify the table was created
SELECT * FROM contact_messages LIMIT 0;

