-- Migration: 0005_dashboard_performance_optimization
-- Description: Fix data linkage and add performance indexes for dashboard queries
-- Created: 2026-01-27
-- Author: CTO Review
--
-- IMPORTANT: Run diagnostic queries BEFORE executing this migration
-- Expected impact: ~70-80% faster dashboard load times

-- ============================================================================
-- PRE-MIGRATION DIAGNOSTICS (Run these first in Supabase SQL Editor)
-- ============================================================================
/*
-- 1. Check current linkage state and estimate UPDATE impact
select 
    device_type,
    count(*) as total_records,
    count(local_meter_id) as linked_records,
    count(*) - count(local_meter_id) as unlinked_records,
    round(100.0 * count(local_meter_id) / count(*), 2) as percent_linked
from parsed_data
group by device_type
order by unlinked_records desc;

-- 2. Estimate rows that WILL be linked by this migration
select count(*) as rows_to_update
from parsed_data pd
join local_meters lm on lm.meter_number = pd.device_id
where pd.local_meter_id is null
  and pd.device_id is not null
  and pd.device_id != '';

-- 3. Check existing indexes (avoid duplicates)
select indexname, indexdef
from pg_indexes
where tablename = 'parsed_data'
order by indexname;
*/

-- ============================================================================
-- PHASE 1: DATA LINKAGE FIX
-- ============================================================================
-- Problem: parsed_data.local_meter_id is NULL for many records
-- This causes dashboard queries to miss data, especially for heat meters
-- Solution: Link records by matching device_id to meter_number
--
-- NOTE: This UPDATE is not reversible. The old NULL values cannot be restored.
-- However, this is a data quality fix, not a destructive change.

update parsed_data pd
set 
    local_meter_id = lm.id,
    updated_at = now()
from local_meters lm
where lm.meter_number = pd.device_id
    and pd.local_meter_id is null
    and pd.device_id is not null
    and pd.device_id != '';

-- ============================================================================
-- PHASE 2: PERFORMANCE INDEXES
-- ============================================================================
-- Index strategy follows Supabase best practices:
-- - Composite index for main query pattern (order matters: equality → range)
-- - Single column indexes for flexible query plans
-- - Partial indexes to reduce index size
-- - Cursor-based pagination support

-- Index 1: Composite index for main dashboard query pattern
-- Covers: WHERE local_meter_id IN (...) AND device_type IN (...) AND date_only BETWEEN x AND y
-- Partial index excludes NULL local_meter_id (reduces index size ~20%)
create index if not exists idx_parsed_data_meter_device_date 
    on parsed_data (local_meter_id, device_type, date_only)
    where local_meter_id is not null;

-- Index 2: Date range filtering (standalone)
-- Useful when filtering by date first, regardless of meter
create index if not exists idx_parsed_data_date_only 
    on parsed_data (date_only)
    where date_only is not null;

-- Index 3: Time-based queries (shared dashboard uses updated_at)
create index if not exists idx_parsed_data_updated_at 
    on parsed_data (updated_at desc);

-- Index 4: Device serial number lookup (shared dashboards)
-- Note: device_id is NOT NULL in schema, so no partial index needed
create index if not exists idx_parsed_data_device_id 
    on parsed_data (device_id);

-- Index 5: Cursor-based pagination for BVED API endpoints
-- Composite (created_at, id) ensures stable sort order
create index if not exists idx_parsed_data_created_at 
    on parsed_data (created_at desc, id desc);

-- ============================================================================
-- PHASE 3: UPDATE STATISTICS
-- ============================================================================
-- Refresh table statistics for query planner after index creation
analyze parsed_data;

-- ============================================================================
-- POST-MIGRATION VERIFICATION (Run after migration completes)
-- ============================================================================
/*
-- 1. Verify data linkage improved
select 
    'Linked' as status,
    count(*) as count,
    round(100.0 * count(*) / (select count(*) from parsed_data), 2) as percentage
from parsed_data
where local_meter_id is not null
union all
select 
    'Unlinked' as status,
    count(*) as count,
    round(100.0 * count(*) / (select count(*) from parsed_data), 2) as percentage
from parsed_data
where local_meter_id is null;

-- 2. Verify indexes created and check sizes
select 
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
from pg_stat_user_indexes
where schemaname = 'public' and tablename = 'parsed_data'
order by pg_relation_size(indexrelid) desc;

-- 3. Test query uses index (should show "Index Scan" not "Seq Scan")
explain (analyze, buffers)
select *
from parsed_data
where local_meter_id = 'your-meter-uuid-here'
    and device_type in ('Water', 'Kaltwasserzähler')
    and date_only >= '2025-01-01'
    and date_only <= '2025-01-31'
limit 100;
*/

-- ============================================================================
-- ROLLBACK NOTES
-- ============================================================================
-- To rollback indexes (safe):
/*
drop index if exists idx_parsed_data_meter_device_date;
drop index if exists idx_parsed_data_date_only;
drop index if exists idx_parsed_data_updated_at;
drop index if exists idx_parsed_data_device_id;
drop index if exists idx_parsed_data_created_at;
*/
-- NOTE: The UPDATE to local_meter_id cannot be rolled back automatically.
-- If needed, you would need to restore from backup or re-NULL the values.

-- ============================================================================
-- MAINTENANCE SCHEDULE
-- ============================================================================
-- Weekly:  Monitor slow queries in Supabase dashboard
-- Monthly: Run ANALYZE parsed_data
-- As needed: VACUUM parsed_data (if many UPDATE/DELETE operations)
