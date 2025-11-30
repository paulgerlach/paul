-- 🚨 URGENT: Diagnose why dashboard shows no data
-- Copy and paste these queries ONE AT A TIME into Supabase SQL Editor

-- ========================================
-- QUERY 1: Check if data exists for October 2025
-- ========================================
SELECT 
    device_type,
    COUNT(*) as total_records,
    MIN(date_only) as earliest_date,
    MAX(date_only) as latest_date
FROM parsed_data
WHERE date_only >= '2025-10-01' 
  AND date_only <= '2025-10-30'
GROUP BY device_type
ORDER BY total_records DESC;

-- Expected result: Should show Stromzähler, Kaltwasserzähler, Warmwasserzähler with record counts

-- ========================================
-- QUERY 2: Check if data is linked to local_meter_id
-- ========================================
SELECT 
    device_type,
    COUNT(*) as total_records,
    COUNT(local_meter_id) as linked_to_meters,
    COUNT(*) - COUNT(local_meter_id) as NOT_LINKED
FROM parsed_data
WHERE date_only >= '2025-10-01' 
  AND date_only <= '2025-10-30'
GROUP BY device_type;

-- ⚠️ If "NOT_LINKED" is > 0, that's the problem!
-- Dashboard filters by local_meter_id, so unlinked data won't show!

-- ========================================
-- QUERY 3: Check sample Stromzähler data
-- ========================================
SELECT 
    id,
    device_id,
    device_type,
    local_meter_id,
    date_only,
    created_at,
    parsed_data->>'Actual Energy / HCA' as energy_wh,
    parsed_data->>'Actual Date' as actual_date
FROM parsed_data
WHERE device_type = 'Stromzähler'
  AND date_only = '2025-10-29'
LIMIT 5;

-- Check: Does local_meter_id have a value (UUID) or is it NULL?

-- ========================================
-- QUERY 4: Check what local_meter_ids exist in your system
-- ========================================
SELECT 
    lm.id as local_meter_id,
    lm.meter_number,
    lm.meter_type,
    lm.local_id,
    l.unit_number,
    o.name as building_name
FROM local_meters lm
LEFT JOIN locals l ON l.id = lm.local_id
LEFT JOIN objekte o ON o.id = l.objekt_id
ORDER BY o.name, l.unit_number
LIMIT 20;

-- This shows what meters are set up in your system

-- ========================================
-- QUERY 5: Check if uploaded data device_ids match local_meters
-- ========================================
SELECT DISTINCT
    pd.device_id,
    pd.device_type,
    lm.id as matching_local_meter_id,
    lm.meter_number
FROM parsed_data pd
LEFT JOIN local_meters lm ON lm.meter_number = pd.device_id
WHERE pd.date_only >= '2025-10-29'
  AND pd.device_type IN ('Stromzähler', 'Kaltwasserzähler', 'Warmwasserzähler')
LIMIT 20;

-- ⚠️ If "matching_local_meter_id" is NULL, the data isn't linked!

-- ========================================
-- 🔧 FIX: Link uploaded data to local_meters (if they match)
-- ========================================
-- ⚠️ ONLY RUN THIS IF QUERY 5 shows NULLs but the meter_numbers match!

-- UPDATE parsed_data pd
-- SET local_meter_id = lm.id
-- FROM local_meters lm
-- WHERE lm.meter_number = pd.device_id
--   AND pd.local_meter_id IS NULL
--   AND pd.date_only >= '2025-10-01';

-- After running this, refresh your dashboard!

