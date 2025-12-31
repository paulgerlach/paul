-- Migration: Add RLS policies and indexes for BVED tables
-- This migration ensures proper security policies and performance optimizations
-- for the bved_platform_credentials, bved_cost_categories_cache, and bved_api_tokens tables.

-- ============================================================================
-- ENCRYPTION DOCUMENTATION FOR bved_platform_credentials.credentials
-- ============================================================================
-- The credentials column in bved_platform_credentials stores sensitive data
-- (client_id, client_secret, etc.) that must be encrypted.
--
-- ENCRYPTION METHOD: [TO BE DETERMINED]
-- Please specify one of the following:
--   1. Supabase Vault: Use pg_vault extension for database-level encryption
--   2. Application-level: Encrypt/decrypt in application code before storage
--
-- If using Supabase Vault:
--   - Enable pg_vault extension: CREATE EXTENSION IF NOT EXISTS pg_vault;
--   - Use vault.secret_create() to store encrypted values
--   - Reference vault secrets in the credentials JSONB column
--
-- If using application-level encryption:
--   - Encrypt credentials before INSERT/UPDATE operations
--   - Decrypt credentials after SELECT operations
--   - Use a secure encryption library (e.g., AES-256-GCM)
--   - Store encryption keys securely (environment variables, key management service)
--
-- TODO: Implement and document the chosen encryption method
-- ============================================================================

-- ============================================================================
-- INDEX: bved_api_tokens.access_token_prefix
-- ============================================================================
-- Add index for efficient lookups by access token prefix.
-- This is used for token validation queries where we match the prefix
-- before performing the full hash comparison.
CREATE INDEX IF NOT EXISTS "bved_api_tokens_access_token_prefix_idx" 
ON "bved_api_tokens" ("access_token_prefix");

-- ============================================================================
-- RLS POLICY UPDATES
-- ============================================================================
-- Ensure RLS is enabled on all three tables
ALTER TABLE "bved_api_tokens" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "bved_platform_credentials" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "bved_cost_categories_cache" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Drop existing policies if they exist (to allow re-running migration)
-- Then create the unified RLS policies for all three tables

-- bved_api_tokens policies
DROP POLICY IF EXISTS "Users can view their own tokens" ON "bved_api_tokens";
DROP POLICY IF EXISTS "Users can create their own tokens" ON "bved_api_tokens";
DROP POLICY IF EXISTS "Users can revoke their own tokens" ON "bved_api_tokens";
DROP POLICY IF EXISTS "Admins can manage all tokens" ON "bved_api_tokens";
DROP POLICY IF EXISTS "Users can access their own tokens or admins can access all" ON "bved_api_tokens";
DROP POLICY IF EXISTS "Service role can read tokens for auth validation" ON "bved_api_tokens";
--> statement-breakpoint
CREATE POLICY "Users can access their own tokens or admins can access all" ON "bved_api_tokens" 
AS PERMISSIVE FOR ALL TO public 
USING ((user_id = auth.uid() OR is_admin())) 
WITH CHECK ((user_id = auth.uid() OR is_admin()));
--> statement-breakpoint
-- CREATE POLICY "Service role can read tokens for auth validation" ON "bved_api_tokens" 
-- AS PERMISSIVE FOR SELECT TO public 
-- USING (true);
--> statement-breakpoint

-- bved_platform_credentials policies
DROP POLICY IF EXISTS "Users can view credentials for their properties" ON "bved_platform_credentials";
DROP POLICY IF EXISTS "Users can create credentials for their properties" ON "bved_platform_credentials";
DROP POLICY IF EXISTS "Users can update credentials for their properties" ON "bved_platform_credentials";
DROP POLICY IF EXISTS "Users can delete credentials for their properties" ON "bved_platform_credentials";
DROP POLICY IF EXISTS "Users can access credentials for their properties" ON "bved_platform_credentials";
DROP POLICY IF EXISTS "Admins can manage all credentials" ON "bved_platform_credentials";
--> statement-breakpoint
CREATE POLICY "Users can access credentials for their properties" ON "bved_platform_credentials" 
AS PERMISSIVE FOR ALL TO public 
USING ((EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))) 
WITH CHECK ((EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid())));
--> statement-breakpoint
CREATE POLICY "Admins can manage all credentials" ON "bved_platform_credentials" 
AS PERMISSIVE FOR ALL TO public 
USING (is_admin()) 
WITH CHECK (is_admin());
--> statement-breakpoint

-- bved_cost_categories_cache policies
DROP POLICY IF EXISTS "Users can view cache for their properties" ON "bved_cost_categories_cache";
DROP POLICY IF EXISTS "Users can create cache for their properties" ON "bved_cost_categories_cache";
DROP POLICY IF EXISTS "Users can update cache for their properties" ON "bved_cost_categories_cache";
DROP POLICY IF EXISTS "Users can delete cache for their properties" ON "bved_cost_categories_cache";
DROP POLICY IF EXISTS "Users can access cache for their properties" ON "bved_cost_categories_cache";
DROP POLICY IF EXISTS "Admins can manage all cache" ON "bved_cost_categories_cache";
--> statement-breakpoint
CREATE POLICY "Users can access cache for their properties" ON "bved_cost_categories_cache" 
AS PERMISSIVE FOR ALL TO public 
USING ((EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid()))) 
WITH CHECK ((EXISTS (SELECT 1 FROM objekte WHERE objekte.id = property_id AND objekte.user_id = auth.uid())));
--> statement-breakpoint
CREATE POLICY "Admins can manage all cache" ON "bved_cost_categories_cache" 
AS PERMISSIVE FOR ALL TO public 
USING (is_admin()) 
WITH CHECK (is_admin());

