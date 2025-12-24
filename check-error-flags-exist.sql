-- PHASE 1.1.4: Check if error flags exist in database

-- 1. Check if ANY devices have error flags
SELECT 
    device_type,
    device_id,
    parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' as error_flag,
    date_only,
    COUNT(*) as count
FROM parsed_data
WHERE parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' IS NOT NULL
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != '0b'
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != ''
GROUP BY device_type, device_id, error_flag, date_only
ORDER BY device_type, date_only DESC
LIMIT 20;

-- 2. Count devices WITH error flags vs WITHOUT
SELECT 
    'With Errors' as status,
    COUNT(DISTINCT device_id) as device_count
FROM parsed_data
WHERE parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' IS NOT NULL
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != '0b'
    AND parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' != ''

UNION ALL

SELECT 
    'No Errors' as status,
    COUNT(DISTINCT device_id) as device_count
FROM parsed_data
WHERE parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' = '0b'
    OR parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' = ''
    OR parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' IS NULL;

-- 3. Check error flags by device type
SELECT 
    device_type,
    parsed_data->>'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)' as error_flag,
    COUNT(*) as occurrence_count
FROM parsed_data
GROUP BY device_type, error_flag
ORDER BY device_type, occurrence_count DESC;










