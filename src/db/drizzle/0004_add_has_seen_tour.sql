-- Migration: Add has_seen_tour column to users table
-- This column tracks whether a user has completed the dashboard tour

ALTER TABLE "users" ADD COLUMN "has_seen_tour" BOOLEAN DEFAULT FALSE;
