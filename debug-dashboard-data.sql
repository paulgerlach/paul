-- DEBUG: Why is the dashboard not showing data?
-- Run this in Supabase SQL Editor

-- 1. Check what device types we have in October 2025
SELECT 
    device_type,
    COUNT(*) as record_count,
    MIN(date_only) as earliest_date,
    MAX(date_only) as latest_date
FROM parsed_data
WHERE date_only >= '2025-10-01' 
  AND date_only <= '2025-10-30'
GROUP BY device_type
ORDER BY record_count DESC;

-- 2. Check if any records have local_meter_id linked
SELECT 
    device_type,
    COUNT(*) as total_records,
    COUNT(local_meter_id) as records_with_meter_id,
    COUNT(*) - COUNT(local_meter_id) as records_without_meter_id
FROM parsed_data
WHERE date_only >= '2025-10-01' 
  AND date_only <= '2025-10-30'
GROUP BY device_type;

-- 3. Check a sample Stromzähler record
SELECT 
    id,
    device_id,
    device_type,
    local_meter_id,
    date_only,
    parsed_data->>'Actual Energy / HCA' as energy_value,
    parsed_data->>'Actual Date' as actual_date
FROM parsed_data
WHERE device_type = 'Stromzähler'
  AND date_only >= '2025-10-29'
LIMIT 3;

-- 4. Check what the RPC function returns (if it exists)
SELECT proname, pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'get_dashboard_data';

-- 5. Test the RPC function directly
-- SELECT * FROM get_dashboard_data(
--     p_local_meter_ids := NULL,
--     p_device_types := NULL,
--     p_start_date := '2025-10-01',
--     p_end_date := '2025-10-30'
-- ) LIMIT 10;

