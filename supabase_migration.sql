-- Create chat messages table
CREATE table chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (since our frontend hits the Next.js API route 
-- and the API route uses the anon key to insert)
CREATE POLICY "Allow anonymous inserts" ON chat_messages
    FOR INSERT 
    WITH CHECK (true);

-- Create policy to allow admins to read all messages
-- Note: Replace this with your actual admin logic if you aren't using standard Supabase Auth for admins.
-- This assumes your admin users are authenticated via email/password in Supabase Auth.
CREATE POLICY "Allow authenticated users to read messages" ON chat_messages
    FOR SELECT 
    USING (auth.role() = 'authenticated');
