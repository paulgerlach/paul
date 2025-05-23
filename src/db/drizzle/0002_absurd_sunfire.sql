CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_name" text NOT NULL,
	"document_url" text NOT NULL,
	"related_id" uuid NOT NULL,
	"related_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "local_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"local_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"price_per_month" integer NOT NULL,
	"active" boolean DEFAULT false,
	"days" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "local_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "locals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"objekt_id" uuid NOT NULL,
	"usage_type" text NOT NULL,
	"floor" text NOT NULL,
	"living_space" numeric NOT NULL,
	"house_location" text,
	"outdoor" text,
	"rooms" numeric,
	"house_fee" numeric,
	"outdoor_area" numeric,
	"residential_area" text,
	"apartment_type" text,
	"cellar_available" boolean,
	"tags" jsonb,
	"heating_systems" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "locals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "objekte" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"objekt_type" text NOT NULL,
	"street" varchar(255) NOT NULL,
	"zip" varchar(20) NOT NULL,
	"administration_type" text NOT NULL,
	"hot_water_preparation" text NOT NULL,
	"living_area" integer,
	"usable_area" integer,
	"land_area" integer,
	"build_year" integer,
	"has_elevator" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"heating_systems" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "objekte" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "local_history" ADD CONSTRAINT "local_history_local_id_locals_id_fk" FOREIGN KEY ("local_id") REFERENCES "public"."locals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locals" ADD CONSTRAINT "locals_objekt_id_objekte_id_fk" FOREIGN KEY ("objekt_id") REFERENCES "public"."objekte"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Users can access only their own documents" ON "documents" AS PERMISSIVE FOR ALL TO public USING (
        (
          (related_type = 'objekt' AND EXISTS (
            SELECT 1 FROM objekte
            WHERE objekte.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local' AND EXISTS (
            SELECT 1 FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local_history' AND EXISTS (
            SELECT 1 FROM local_history
            JOIN locals ON locals.id = local_history.local_id
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE local_history.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
        )
      ) WITH CHECK (
        (
          (related_type = 'objekt' AND EXISTS (
            SELECT 1 FROM objekte
            WHERE objekte.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local' AND EXISTS (
            SELECT 1 FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
          OR
          (related_type = 'local_history' AND EXISTS (
            SELECT 1 FROM local_history
            JOIN locals ON locals.id = local_history.local_id
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE local_history.id = documents.related_id
            AND objekte.user_id = auth.uid()
          ))
        )
      );--> statement-breakpoint
CREATE POLICY "Users can access their own local history" ON "local_history" AS PERMISSIVE FOR ALL TO public USING (
          EXISTS (
            SELECT 1
            FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = local_history.local_id
            AND objekte.user_id = auth.uid()
          )
        ) WITH CHECK (
          EXISTS (
            SELECT 1
            FROM locals
            JOIN objekte ON objekte.id = locals.objekt_id
            WHERE locals.id = local_history.local_id
            AND objekte.user_id = auth.uid()
          )
        );--> statement-breakpoint
CREATE POLICY "Users can access their own locals" ON "locals" AS PERMISSIVE FOR ALL TO public USING (
          EXISTS (
            SELECT 1
            FROM objekte
            WHERE objekte.id = locals.objekt_id
            AND objekte.user_id = auth.uid()
          )
        ) WITH CHECK (
          EXISTS (
            SELECT 1
            FROM objekte
            WHERE objekte.id = locals.objekt_id
            AND objekte.user_id = auth.uid()
          )
        );--> statement-breakpoint
CREATE POLICY "Users can access only their own objects" ON "objekte" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
ALTER POLICY "User can manage own profile" ON "users" TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);--> statement-breakpoint
ALTER POLICY "Users can access their own record" ON "users" TO authenticated USING ((auth.uid() = id));