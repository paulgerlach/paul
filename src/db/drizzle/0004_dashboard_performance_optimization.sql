-- Migration 0004: Dashboard Performance Optimization
-- Created: January 27, 2026
-- Purpose: Add missing indexes and fix data linkage for dashboard performance

-- ============================================================================
-- PHASE 1: DATA LINKAGE FIX
-- ============================================================================
-- Problem: parsed_data.local_meter_id is NULL for many records
-- This causes dashboard queries to miss data, especially for heat meters
-- Solution: Link parsed_data records to local_meters by matching device_id to meter_number

-- Step 1: Diagnostic query (run this first to see the impact)
-- Uncomment to check current state:
/*
SELECT 
    device_type,
    COUNT(*) as total_records,
    COUNT(local_meter_id) as linked_records,
    COUNT(*) - COUNT(local_meter_id) as unlinked_records,
    ROUND(100.0 * COUNT(local_meter_id) / COUNT(*), 2) as percent_linked
FROM parsed_data
GROUP BY device_type
ORDER BY unlinked_records DESC;
*/

-- Step 2: Fix the linkage by matching device_id to meter_number
-- This UPDATE will link all orphaned records to their correct meters
UPDATE parsed_data pd
SET 
    local_meter_id = lm.id,
    updated_at = NOW()
FROM local_meters lm
WHERE lm.meter_number = pd.device_id
    AND pd.local_meter_id IS NULL
    AND pd.device_id IS NOT NULL
    AND pd.device_id != '';

-- Step 3: Verify the fix worked
-- Uncomment to check results:
/*
SELECT 
    device_type,
    COUNT(*) FILTER (WHERE local_meter_id IS NULL) as still_unlinked
FROM parsed_data
WHERE device_id IS NOT NULL AND device_id != ''
GROUP BY device_type;
*/

-- ============================================================================
-- PHASE 2: PERFORMANCE INDEXES
-- ============================================================================
-- Add composite and single-column indexes for optimal query performance
-- These indexes target the most common query patterns in dashboard queries

-- Index 1: Composite index for main dashboard query pattern
-- Covers: WHERE local_meter_id IN (...) AND device_type IN (...) AND date_only >= X AND date_only <= Y
CREATE INDEX IF NOT EXISTS idx_parsed_data_meter_device_date 
    ON parsed_data (local_meter_id, device_type, date_only)
    WHERE local_meter_id IS NOT NULL;

-- Index 2: Date-only index for date range filtering
-- Useful for queries that filter by date first
CREATE INDEX IF NOT EXISTS idx_parsed_data_date_only 
    ON parsed_data (date_only);

-- Index 3: Updated_at index for time-based queries
-- Used in some shared dashboard queries
CREATE INDEX IF NOT EXISTS idx_parsed_data_updated_at 
    ON parsed_data (updated_at);

-- Index 4: Device_id index for shared dashboards
-- Shared dashboards query by device_id (meter serial number)
CREATE INDEX IF NOT EXISTS idx_parsed_data_device_id 
    ON parsed_data (device_id)
    WHERE device_id IS NOT NULL;

-- Index 5: Created_at index for pagination/sorting
-- Used in BVED API endpoints for cursor-based pagination
CREATE INDEX IF NOT EXISTS idx_parsed_data_created_at 
    ON parsed_data (created_at DESC, id DESC);

-- ============================================================================
-- PHASE 3: ANALYZE TABLE
-- ============================================================================
-- Update table statistics for query planner
ANALYZE parsed_data;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the migration worked correctly

-- 1. Check index sizes
/*
SELECT 
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND tablename = 'parsed_data'
ORDER BY pg_relation_size(indexrelid) DESC;
*/

-- 2. Check data linkage success rate
/*
SELECT 
    'Linked' as status,
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM parsed_data
WHERE local_meter_id IS NOT NULL
UNION ALL
SELECT 
    'Unlinked' as status,
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM parsed_data
WHERE local_meter_id IS NULL;
*/

-- 3. Test query performance (should use indexes now)
/*
EXPLAIN ANALYZE
SELECT *
FROM parsed_data
WHERE local_meter_id = 'your-meter-uuid-here'
    AND device_type IN ('Water', 'Kaltwasserzähler')
    AND date_only >= '2025-01-01'
    AND date_only <= '2025-01-31';
*/

-- ============================================================================
-- NOTES
-- ============================================================================
-- Expected performance improvements:
-- - Dashboard load time: 70-80% faster (5s → 1s)
-- - Query execution: Full table scan → Index scan
-- - Database load: 5 queries → 1 query (with application changes)
--
-- Maintenance:
-- - Run ANALYZE parsed_data periodically (monthly)
-- - Monitor index bloat with pg_stat_user_indexes
-- - Consider VACUUM if table has many UPDATE/DELETE operations
