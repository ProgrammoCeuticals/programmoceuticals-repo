CREATE TYPE "public"."audit_event_type" AS ENUM('user_registered', 'user_login', 'user_logout', 'user_login_failed', 'token_refreshed', 'org_created', 'org_updated', 'user_created', 'user_updated', 'user_deactivated', 'personnel_created', 'personnel_updated', 'personnel_deactivated', 'log_created', 'log_updated', 'log_published', 'log_archived', 'column_added', 'column_updated', 'column_removed', 'columns_reordered', 'relationship_created', 'relationship_updated', 'relationship_deleted', 'record_created', 'record_updated', 'record_corrected', 'record_voided', 'record_archived', 'record_signed', 'file_uploaded', 'file_deleted', 'log_exported', 'config_changed');--> statement-breakpoint
CREATE TYPE "public"."column_behavior" AS ENUM('independent', 'linked', 'synchronized', 'calculated');--> statement-breakpoint
CREATE TYPE "public"."column_data_type" AS ENUM('text', 'long_text', 'integer', 'decimal', 'date', 'time', 'datetime', 'boolean', 'dropdown', 'multi_select', 'user', 'person', 'reference', 'calculated', 'file', 'image', 'signature');--> statement-breakpoint
CREATE TYPE "public"."log_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."record_status" AS ENUM('active', 'corrected', 'voided', 'archived');--> statement-breakpoint
CREATE TYPE "public"."relationship_type" AS ENUM('one_to_many', 'many_to_one', 'one_to_one');--> statement-breakpoint
CREATE TYPE "public"."signature_status" AS ENUM('pending', 'signed', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text,
	"event_type" "audit_event_type" NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"summary" text NOT NULL,
	"previous_state" jsonb,
	"new_state" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "field_values" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"column_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"value" text,
	"source_log_id" text,
	"source_record_id" text,
	"source_column_id" text,
	"snapshot_value" text,
	"snapshot_at" timestamp with time zone,
	"calculation_meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"record_id" text,
	"column_id" text,
	"original_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"uploaded_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"log_definition_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"data_type" "column_data_type" NOT NULL,
	"behavior" "column_behavior" DEFAULT 'independent' NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_unique" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"default_value" text,
	"type_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"behavior_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"validation_rules" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_definitions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "log_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"icon" text,
	"color" text,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_records" (
	"id" text PRIMARY KEY NOT NULL,
	"log_definition_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"record_number" text NOT NULL,
	"status" "record_status" DEFAULT 'active' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"corrected_from_id" text,
	"correction_reason" text,
	"corrected_at" timestamp with time zone,
	"corrected_by_id" text,
	"voided_at" timestamp with time zone,
	"voided_by_id" text,
	"void_reason" text,
	"created_by_id" text NOT NULL,
	"updated_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"source_log_id" text NOT NULL,
	"target_log_id" text NOT NULL,
	"referencing_column_id" text,
	"relationship_type" "relationship_type" DEFAULT 'many_to_one' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personnel" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"identifier" text,
	"role" text,
	"department" text,
	"email" text,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"linked_user_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "record_links" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"relationship_id" text NOT NULL,
	"referencing_record_id" text NOT NULL,
	"referenced_record_id" text NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "record_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"version" integer NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"field_values_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"changed_by_id" text NOT NULL,
	"change_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relationship_field_mappings" (
	"id" text PRIMARY KEY NOT NULL,
	"relationship_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"source_column_id" text NOT NULL,
	"target_column_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signatures" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"record_id" text NOT NULL,
	"column_id" text NOT NULL,
	"signed_by_id" text NOT NULL,
	"personnel_id" text,
	"intent" text NOT NULL,
	"signed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"integrity_hash" text NOT NULL,
	"signature_image_id" text,
	"status" "signature_status" DEFAULT 'signed' NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by_id" text,
	"revocation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"refresh_token_hash" text,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_record_id_log_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_column_id_log_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."log_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_source_log_id_log_definitions_id_fk" FOREIGN KEY ("source_log_id") REFERENCES "public"."log_definitions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_source_record_id_log_records_id_fk" FOREIGN KEY ("source_record_id") REFERENCES "public"."log_records"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_source_column_id_log_columns_id_fk" FOREIGN KEY ("source_column_id") REFERENCES "public"."log_columns"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_values" ADD CONSTRAINT "field_values_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_record_id_log_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_column_id_log_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."log_columns"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_columns" ADD CONSTRAINT "log_columns_log_definition_id_log_definitions_id_fk" FOREIGN KEY ("log_definition_id") REFERENCES "public"."log_definitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_columns" ADD CONSTRAINT "log_columns_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_columns" ADD CONSTRAINT "log_columns_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_columns" ADD CONSTRAINT "log_columns_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_definitions" ADD CONSTRAINT "log_definitions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_definitions" ADD CONSTRAINT "log_definitions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_definitions" ADD CONSTRAINT "log_definitions_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_log_definition_id_log_definitions_id_fk" FOREIGN KEY ("log_definition_id") REFERENCES "public"."log_definitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_corrected_by_id_users_id_fk" FOREIGN KEY ("corrected_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_voided_by_id_users_id_fk" FOREIGN KEY ("voided_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_records" ADD CONSTRAINT "log_records_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_relationships" ADD CONSTRAINT "log_relationships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_relationships" ADD CONSTRAINT "log_relationships_source_log_id_log_definitions_id_fk" FOREIGN KEY ("source_log_id") REFERENCES "public"."log_definitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_relationships" ADD CONSTRAINT "log_relationships_target_log_id_log_definitions_id_fk" FOREIGN KEY ("target_log_id") REFERENCES "public"."log_definitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_relationships" ADD CONSTRAINT "log_relationships_referencing_column_id_log_columns_id_fk" FOREIGN KEY ("referencing_column_id") REFERENCES "public"."log_columns"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_relationships" ADD CONSTRAINT "log_relationships_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personnel" ADD CONSTRAINT "personnel_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personnel" ADD CONSTRAINT "personnel_linked_user_id_users_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_links" ADD CONSTRAINT "record_links_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_links" ADD CONSTRAINT "record_links_relationship_id_log_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."log_relationships"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_links" ADD CONSTRAINT "record_links_referencing_record_id_log_records_id_fk" FOREIGN KEY ("referencing_record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_links" ADD CONSTRAINT "record_links_referenced_record_id_log_records_id_fk" FOREIGN KEY ("referenced_record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_links" ADD CONSTRAINT "record_links_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_versions" ADD CONSTRAINT "record_versions_record_id_log_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_versions" ADD CONSTRAINT "record_versions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "record_versions" ADD CONSTRAINT "record_versions_changed_by_id_users_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationship_field_mappings" ADD CONSTRAINT "relationship_field_mappings_relationship_id_log_relationships_id_fk" FOREIGN KEY ("relationship_id") REFERENCES "public"."log_relationships"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationship_field_mappings" ADD CONSTRAINT "relationship_field_mappings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationship_field_mappings" ADD CONSTRAINT "relationship_field_mappings_source_column_id_log_columns_id_fk" FOREIGN KEY ("source_column_id") REFERENCES "public"."log_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relationship_field_mappings" ADD CONSTRAINT "relationship_field_mappings_target_column_id_log_columns_id_fk" FOREIGN KEY ("target_column_id") REFERENCES "public"."log_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_record_id_log_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."log_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_column_id_log_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."log_columns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_signed_by_id_users_id_fk" FOREIGN KEY ("signed_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_personnel_id_personnel_id_fk" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_signature_image_id_file_attachments_id_fk" FOREIGN KEY ("signature_image_id") REFERENCES "public"."file_attachments"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signatures" ADD CONSTRAINT "signatures_revoked_by_id_users_id_fk" FOREIGN KEY ("revoked_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_org_idx" ON "audit_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_user_idx" ON "audit_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_created_at_idx" ON "audit_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_events_event_type_idx" ON "audit_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "field_values_record_idx" ON "field_values" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "field_values_column_idx" ON "field_values" USING btree ("column_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "field_values_source_record_idx" ON "field_values" USING btree ("source_record_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "field_values_record_column_idx" ON "field_values" USING btree ("record_id","column_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_attachments_record_idx" ON "file_attachments" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_attachments_org_idx" ON "file_attachments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_columns_log_idx" ON "log_columns" USING btree ("log_definition_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_columns_order_idx" ON "log_columns" USING btree ("log_definition_id","display_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_definitions_org_idx" ON "log_definitions" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "log_definitions_org_name_idx" ON "log_definitions" USING btree ("organization_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_records_log_idx" ON "log_records" USING btree ("log_definition_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_records_org_idx" ON "log_records" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_records_status_idx" ON "log_records" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "log_records_number_idx" ON "log_records" USING btree ("log_definition_id","record_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_relationships_org_idx" ON "log_relationships" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_relationships_source_target_idx" ON "log_relationships" USING btree ("source_log_id","target_log_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "personnel_org_idx" ON "personnel" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_links_referencing_idx" ON "record_links" USING btree ("referencing_record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_links_referenced_idx" ON "record_links" USING btree ("referenced_record_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "record_links_unique_idx" ON "record_links" USING btree ("relationship_id","referencing_record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_versions_record_idx" ON "record_versions" USING btree ("record_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "record_versions_record_version_idx" ON "record_versions" USING btree ("record_id","version");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rfm_relationship_idx" ON "relationship_field_mappings" USING btree ("relationship_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signatures_record_idx" ON "signatures" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signatures_signer_idx" ON "signatures" USING btree ("signed_by_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_org_idx" ON "users" USING btree ("organization_id");