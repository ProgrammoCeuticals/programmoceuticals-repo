CREATE TABLE IF NOT EXISTS "divisions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "division_id" text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "log_definitions" ADD COLUMN IF NOT EXISTS "division_id" text;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "divisions" ADD CONSTRAINT "divisions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_definitions" ADD CONSTRAINT "log_definitions_division_id_divisions_id_fk" FOREIGN KEY ("division_id") REFERENCES "public"."divisions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "divisions_org_idx" ON "divisions" USING btree ("organization_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "divisions_org_name_idx" ON "divisions" USING btree ("organization_id", "name");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_division_idx" ON "users" USING btree ("division_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_definitions_division_idx" ON "log_definitions" USING btree ("division_id");

-- Mark the first user in each organization as admin
UPDATE "users" u
SET "is_admin" = true
WHERE u.id IN (
  SELECT DISTINCT ON (organization_id) id
  FROM "users"
  ORDER BY organization_id, created_at ASC
);
