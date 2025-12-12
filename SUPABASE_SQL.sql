-- SQL Script to create contact_messages table in Supabase
-- Run this in Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow INSERT for all users
CREATE POLICY "Allow insert for all"
ON contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow SELECT for authenticated users only (optional)
-- Uncomment if you want only authenticated users to read messages
-- CREATE POLICY "Allow select for authenticated"
-- ON contact_messages
-- FOR SELECT
-- TO authenticated
-- USING (true);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON contact_messages(created_at DESC);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_messages_email 
ON contact_messages(email);

