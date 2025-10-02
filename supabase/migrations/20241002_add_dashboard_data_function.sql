-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_dashboard_data(UUID[], TEXT[], DATE, DATE, INTEGER, INTEGER);

-- Create function to get dashboard data with proper date filtering
CREATE OR REPLACE FUNCTION get_dashboard_data(
  p_local_meter_ids UUID[],
  p_device_types TEXT[] DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  device_id TEXT,
  device_type TEXT,
  manufacturer TEXT,
  frame_type TEXT,
  version TEXT,
  access_number INTEGER,
  status TEXT,
  encryption INTEGER,
  parsed_data JSONB,
  local_meter_id UUID,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.device_id,
    p.device_type,
    p.manufacturer,
    p.frame_type,
    p.version,
    p.access_number,
    p.status,
    p.encryption,
    p.parsed_data,
    p.local_meter_id,
    p.created_at
  FROM parsed_data p
  WHERE 
    (p_local_meter_ids IS NULL OR p.local_meter_id = ANY(p_local_meter_ids))
    AND (p_device_types IS NULL OR p.device_type = ANY(p_device_types))
    AND (p_start_date IS NULL OR 
         to_date(
           NULLIF(split_part(p.parsed_data::jsonb ->> 'IV,0,0,0,,Date/Time',' ',1),''),
           'DD.MM.YYYY'
         ) >= p_start_date)
    AND (p_end_date IS NULL OR 
         to_date(
           NULLIF(split_part(p.parsed_data::jsonb ->> 'IV,0,0,0,,Date/Time',' ',1),''),
           'DD.MM.YYYY'
         ) <= p_end_date)
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant permission to use the function
GRANT EXECUTE ON FUNCTION get_dashboard_data TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_data TO anon;