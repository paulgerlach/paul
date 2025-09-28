-- Create table for storing parsed meter reading data
-- This table stores parsed data from meter readings with device identification and measurements

CREATE TABLE parsed_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Foreign key references to existing tables
    local_meter_id UUID REFERENCES local_meters(id),
    
    -- Core device identification fields extracted from JSON
    device_id TEXT NOT NULL,              -- The 'ID' field from JSON (e.g., 53157161)
    device_type TEXT NOT NULL,              -- Heat, Water, HCA, UnidirectionalRepeater, Gateway, etc.
    manufacturer TEXT NOT NULL,             -- EFE, LAS, MWU, etc.
    
    -- Device metadata fields
    frame_type TEXT,                        -- SND_NR, ACC_NR, etc.
    version TEXT,                           -- Device version (e.g., "00h", "70h")
    access_number INTEGER,                  -- Access sequence number
    status TEXT,                           -- Status code (e.g., "00h")
    encryption INTEGER,                     -- Encryption level (0-7)
    
    -- Raw parsed data containing all dynamic measurement fields
    -- This JSONB field stores all the variable measurement data like:
    -- - Energy readings (Wh, E)
    -- - Volume readings (m³, Vol)
    -- - Date/Time stamps
    -- - Error flags
    -- - Device-specific parameters
    parsed_data JSONB NOT NULL,
    
    -- Processing and audit timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_parsed_data_local_meter_id ON parsed_data(local_meter_id);
CREATE INDEX idx_parsed_data_device_id ON parsed_data(device_id);
CREATE INDEX idx_parsed_data_device_type ON parsed_data(device_type);
CREATE INDEX idx_parsed_data_manufacturer ON parsed_data(manufacturer);

-- GIN index for efficient JSONB queries on the parsed_data field
CREATE INDEX idx_parsed_data_jsonb ON parsed_data USING GIN (parsed_data);

-- Enable Row Level Security (RLS)
ALTER TABLE parsed_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON parsed_data
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON parsed_data
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON parsed_data
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function and trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parsed_data_updated_at
  BEFORE UPDATE ON parsed_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments on the table and key columns
COMMENT ON TABLE parsed_data IS 'Stores parsed meter reading data from various device types including Heat meters, Water meters, HCA (Heat Cost Allocators), etc.';
COMMENT ON COLUMN parsed_data.device_id IS 'Hardware device ID from the meter reading (corresponds to ID field in JSON)';
COMMENT ON COLUMN parsed_data.device_type IS 'Type of meter device: Heat, Water, HCA, UnidirectionalRepeater, Gateway';
COMMENT ON COLUMN parsed_data.parsed_data IS 'Complete parsed meter data in JSONB format containing all measurements and device-specific fields';
COMMENT ON COLUMN parsed_data.local_meter_id IS 'Reference to the local meter (local_meters table) where this parsed data belongs';