-- Create guests table
CREATE TABLE guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gifts table
CREATE TABLE gifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create gift_reservations table
CREATE TABLE gift_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    gift_id UUID NOT NULL REFERENCES gifts(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(gift_id, guest_id)
);

-- Create indexes
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_status ON guests(status);
CREATE INDEX idx_gifts_status ON gifts(status);
CREATE INDEX idx_gift_reservations_gift_id ON gift_reservations(gift_id);
CREATE INDEX idx_gift_reservations_guest_id ON gift_reservations(guest_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at
    BEFORE UPDATE ON gifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for guests table
CREATE POLICY "Allow anonymous read access to guests"
    ON guests FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert access to guests"
    ON guests FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to guests"
    ON guests FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to guests"
    ON guests FOR DELETE
    TO anon
    USING (true);

-- Create policies for gifts table
CREATE POLICY "Allow anonymous read access to gifts"
    ON gifts FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert access to gifts"
    ON gifts FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to gifts"
    ON gifts FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to gifts"
    ON gifts FOR DELETE
    TO anon
    USING (true);

-- Create policies for gift_reservations table
CREATE POLICY "Allow anonymous read access to gift_reservations"
    ON gift_reservations FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert access to gift_reservations"
    ON gift_reservations FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to gift_reservations"
    ON gift_reservations FOR DELETE
    TO anon
    USING (true); 