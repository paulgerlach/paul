-- Migration: 0007_add_documents_local_id
-- Description: Add nullable local_id column to documents table.
--              Enables linking tenant PDFs directly to their locale
--              without needing intermediate per-locale heating_bill_documents rows.

ALTER TABLE documents ADD COLUMN IF NOT EXISTS local_id uuid;
