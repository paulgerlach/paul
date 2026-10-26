-- Baseline: public.leads as it exists on staging and prod (dumped 2026-10-26), plus public.is_admin(),
-- which its read policy calls. Both databases also hold the platform's tables; only what hs-web uses is here.
-- On staging and prod this is never run: Drizzle owns hs-web's tables there (drizzle/0000_leads is the same
-- table, marked as applied by scripts/db-baseline.ts). is_admin() reads public.users, which exists only remotely;
-- locally it returns an error if called, and nothing calls it.

CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$

BEGIN

  RETURN EXISTS (

    SELECT 1 

    FROM users 

    WHERE id = auth.uid() 

    AND permission IN ('admin', 'super_admin')

  );

END;

$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."is_admin"() IS 'Returns true if the current authenticated user has admin permission. SECURITY DEFINER allows it to bypass RLS.';

CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "source" "text" DEFAULT 'chatbot'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."leads" OWNER TO "postgres";

ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");

CREATE POLICY "Enable insert for anonymous users" ON "public"."leads" FOR INSERT TO "anon" WITH CHECK (true);
CREATE POLICY "Enable read for admin users only" ON "public"."leads" FOR SELECT TO "authenticated" USING ("public"."is_admin"());
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";
GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";
