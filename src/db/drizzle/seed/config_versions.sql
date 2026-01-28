-- Insert all config versions from supplier
INSERT INTO config_versions (etag, config, description, created_by, is_active) 
VALUES 
('105', '{"listenCron": "H 0 8 1,L * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st and last day - C-mode listening (45 min)', 'supplier', true),
('94', '{"listenCron": "H 0 8 1W,LW * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st and last weekday - C-mode listening (45 min)', 'supplier', true),
('854', '{"listenCron": "H 0 8 1W,LW * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st and last weekday - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),
('69', '{"listenCron": "H 0 8 1W,LW * *", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st and last weekday - S-mode listening (30 min)', 'supplier', true),
('987', '{"listenCron": "H 0 8 1,L * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st and last day - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true)

-- 2. Monthly Start/Middle/End configurations
('97', '{"listenCron": "H 0 8 1,15,L * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st, 15th and last day - C-mode only (45 min)', 'supplier', true),
('951', '{"listenCron": "H 0 8 1,15,L * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st, 15th and last day - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),
('99', '{"listenCron": "H 0 8 1,15,L * *", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st, 15th and last day - S-mode only (30 min)', 'supplier', true),
('634', '{"listenCron": "H 0 8 1W,15W,LW * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st, 15th and last weekday - C-mode only (45 min)', 'supplier', true),
('428', '{"listenCron": "H 0 8 1W,15W,LW * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st, 15th and last weekday - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),
('8', '{"listenCron": "H 0 8 1W,15W,LW * *", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st, 15th and last weekday - S-mode only (30 min)', 'supplier', true),

-- 3. Monthly Start/Middle configurations
('6', '{"listenCron": "H 0 8 1,15 * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st and 15th - C-mode only (45 min)', 'supplier', true),
('4', '{"listenCron": "H 0 8 1,15 * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st and 15th - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),
('7', '{"listenCron": "H 0 8 1W,15W * *", "cmodeDurSec": "2700"}'::jsonb, 'Monthly 1st and 15th weekday - C-mode only (45 min)', 'supplier', true),
('5', '{"listenCron": "H 0 8 1W,15W * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Monthly 1st and 15th weekday - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),

-- 4. Daily configurations
('5004', '{"listenCron": "H 0 8 * * *", "cmodeDurSec": "2700"}'::jsonb, 'Daily - C-mode only (45 min)', 'supplier', true),
('569', '{"listenCron": "H 0 8 * * *", "cmodeDurSec": "2700", "smodeDurSec": "1800"}'::jsonb, 'Daily - Both C-mode (45 min) and S-mode (30 min)', 'supplier', true),

-- 5. Whitelist Filter configurations
('5600', '{"devFilter": "12345678,23456789,99999999"}'::jsonb, 'Whitelist - Specific meter serial numbers', 'supplier', true),
('500', '{"mFilter": "DME,EFE,QDS"}'::jsonb, 'Whitelist - Engelmann, Diehl, Qundis manufacturers', 'supplier', true),
('5500', '{"typFilter": "04,06,08"}'::jsonb, 'Whitelist - Water, Heat, Gas meter types', 'supplier', true)

-- Handle duplicates (if running multiple times)
ON CONFLICT (etag) DO UPDATE SET
  config = EXCLUDED.config,
  description = EXCLUDED.description,
  created_by = EXCLUDED.created_by,
  is_active = EXCLUDED.is_active,
  created_at = CASE 
    WHEN config_versions.created_at IS NULL THEN NOW()
    ELSE config_versions.created_at 
  END;