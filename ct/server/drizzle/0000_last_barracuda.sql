CREATE TYPE "public"."application_status" AS ENUM('draft', 'submitted', 'under_admin_screening', 'compliance_directive_issued', 'resubmitted_after_compliance_directive', 'classified', 'assigned_first_assessor', 'first_assessment_ongoing', 'first_assessment_reverted', 'assigned_second_assessor', 'second_assessment_ongoing', 'second_assessment_reverted', 'awaiting_final_decision', 'finalized', 'archived');--> statement-breakpoint
CREATE TYPE "public"."assessment_stage" AS ENUM('first_assessment', 'second_assessment');--> statement-breakpoint
CREATE TYPE "public"."assessor_recommendation" AS ENUM('recommend_approval', 'recommend_compliance_directive', 'recommend_rejection', 'requires_second_assessment', 'requires_admin_action', 'assessment_completed');--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('assigned', 'ongoing', 'reverted', 'completed', 'cancelled', 'reassigned');--> statement-breakpoint
CREATE TYPE "public"."bcs_class" AS ENUM('Class I', 'Class II', 'Class III', 'Class IV', 'Unknown', 'Not Applicable');--> statement-breakpoint
CREATE TYPE "public"."directive_status" AS ENUM('open', 'responded', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."final_decision_option" AS ENUM('CD', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('Pending', 'Ongoing', 'Completed');--> statement-breakpoint
CREATE TYPE "public"."therapeutic_index_class" AS ENUM('NTI', 'Non-NTI', 'Mixed', 'Unknown');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('applicant', 'assessor', 'admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "applicant_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"contact_person_name" varchar(200),
	"contact_person_title" varchar(150),
	"company_email" varchar(255),
	"company_phone" varchar(50),
	"company_address" text,
	"rc_number" varchar(100),
	"market_authorisation_holder" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_user_id" uuid NOT NULL,
	"applicant_profile_id" uuid,
	"application_no" varchar(80) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"strength" varchar(120),
	"dosage_form" varchar(120),
	"strength_and_dosage_form" varchar(255),
	"current_status" "application_status" DEFAULT 'draft' NOT NULL,
	"review_status" "review_status" DEFAULT 'Pending' NOT NULL,
	"final_decision" "final_decision_option",
	"final_decision_date" date,
	"final_decision_note" text,
	"final_decision_by" uuid,
	"submitted_at" timestamp with time zone,
	"resubmitted_at" timestamp with time zone,
	"finalized_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessor_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"assessor_user_id" uuid NOT NULL,
	"assessment_stage" "assessment_stage" NOT NULL,
	"assigned_by_user_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" date,
	"assignment_note" text,
	"reason_for_second_assessment" text,
	"status" "assignment_status" DEFAULT 'assigned' NOT NULL,
	"started_at" timestamp with time zone,
	"reverted_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessor_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"assessor_assignment_id" uuid NOT NULL,
	"assessor_user_id" uuid NOT NULL,
	"assessment_stage" "assessment_stage" NOT NULL,
	"recommendation" "assessor_recommendation" NOT NULL,
	"comment" text NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessor_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"assessor_assignment_id" uuid NOT NULL,
	"assessor_user_id" uuid NOT NULL,
	"assessment_stage" "assessment_stage" NOT NULL,
	"report_title" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" text NOT NULL,
	"cloudinary_public_id" varchar(255) NOT NULL,
	"file_mime_type" varchar(120),
	"file_size" integer,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"actor_user_id" uuid,
	"action" varchar(150) NOT NULL,
	"entity_type" varchar(100),
	"entity_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "be_checklists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"has_read_general_instructions" boolean DEFAULT false NOT NULL,
	"certified_information_is_true" boolean DEFAULT false NOT NULL,
	"signed_on_behalf_of" varchar(255),
	"signatory_name_and_title" varchar(255),
	"certification_date" date,
	"study_protocol_number" varchar(150),
	"study_title" text,
	"bioanalytical_study_start_date" date,
	"bioanalytical_study_end_date" date,
	"clinical_study_site_name" varchar(255),
	"clinical_study_site_address" text,
	"bioanalytical_study_site_name" varchar(255),
	"bioanalytical_study_site_address" text,
	"ethics_committee_name" varchar(255),
	"ethics_committee_address" text,
	"study_protocol_approval_date" date,
	"approved_study_protocol_number_and_version" varchar(255),
	"informed_consent_approval_date" date,
	"test_product_name" varchar(255),
	"test_product_strength" varchar(120),
	"test_product_same_strength_as_registration_product" boolean,
	"test_product_same_strength_comment" text,
	"test_product_dosage_form" varchar(120),
	"test_product_batch_number" varchar(150),
	"test_product_batch_size" varchar(150),
	"test_product_manufacture_date" date,
	"test_product_expiry_date" date,
	"api_manufacturing_site_name_and_address" text,
	"test_product_manufacturing_site_name_and_address" text,
	"test_product_same_composition_as_registration_product" boolean,
	"test_product_same_composition_comment" text,
	"reference_product_name" varchar(255),
	"reference_product_strength" varchar(120),
	"reference_product_dosage_form" varchar(120),
	"reference_product_batch_number" varchar(150),
	"reference_product_expiry_date" date,
	"reference_product_source_country" varchar(120),
	"reference_product_manufacturing_site_name_and_address" text,
	"reference_product_same_as_who_comparator" boolean,
	"reference_product_comparator_comment" text,
	"biowaiver_of_additional_strength_applicable" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "be_study_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checklist_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"period_label" varchar(100) NOT NULL,
	"start_date" date,
	"end_date" date,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "be_summary_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checklist_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"parameter" varchar(80) NOT NULL,
	"logarithmic_transformed_data" text,
	"test_geometric_mean" varchar(80),
	"reference_geometric_mean" varchar(80),
	"percentage_ratio_geometric_means" varchar(80),
	"confidence_interval_lower" varchar(80),
	"confidence_interval_upper" varchar(80),
	"intra_subject_coefficient_variation_iscv" varchar(80),
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_directive_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"compliance_directive_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"applicant_user_id" uuid NOT NULL,
	"response_message" text NOT NULL,
	"corrected_sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_directives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"directive_number" varchar(80) NOT NULL,
	"title" varchar(255) NOT NULL,
	"issued_by_user_id" uuid NOT NULL,
	"issued_to_user_id" uuid NOT NULL,
	"affected_sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"directive_message" text NOT NULL,
	"required_corrections" text,
	"due_date" date,
	"status" "directive_status" DEFAULT 'open' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "final_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"decision" "final_decision_option" NOT NULL,
	"decision_note" text,
	"decided_by_user_id" uuid NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lookup_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"user_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"therapeutic_index_class" "therapeutic_index_class" DEFAULT 'Unknown' NOT NULL,
	"bcs_class" "bcs_class" DEFAULT 'Unknown' NOT NULL,
	"pharmacological_class" varchar(255),
	"local_or_foreign" varchar(80),
	"product_category" varchar(150),
	"biowaiver_relevance" text,
	"classification_source" varchar(255),
	"classification_note" text,
	"classified_by_user_id" uuid,
	"classified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section_b_document_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checklist_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"item_number" integer NOT NULL,
	"document_title" text NOT NULL,
	"name_of_document_and_location" text,
	"is_applicable" boolean DEFAULT true NOT NULL,
	"applicant_remark" text,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_profile_id_applicant_profiles_id_fk" FOREIGN KEY ("applicant_profile_id") REFERENCES "public"."applicant_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_final_decision_by_users_id_fk" FOREIGN KEY ("final_decision_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_assignments" ADD CONSTRAINT "assessor_assignments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_assignments" ADD CONSTRAINT "assessor_assignments_assessor_user_id_users_id_fk" FOREIGN KEY ("assessor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_assignments" ADD CONSTRAINT "assessor_assignments_assigned_by_user_id_users_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_comments" ADD CONSTRAINT "assessor_comments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_comments" ADD CONSTRAINT "assessor_comments_assessor_assignment_id_assessor_assignments_id_fk" FOREIGN KEY ("assessor_assignment_id") REFERENCES "public"."assessor_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_comments" ADD CONSTRAINT "assessor_comments_assessor_user_id_users_id_fk" FOREIGN KEY ("assessor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_reports" ADD CONSTRAINT "assessor_reports_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_reports" ADD CONSTRAINT "assessor_reports_assessor_assignment_id_assessor_assignments_id_fk" FOREIGN KEY ("assessor_assignment_id") REFERENCES "public"."assessor_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessor_reports" ADD CONSTRAINT "assessor_reports_assessor_user_id_users_id_fk" FOREIGN KEY ("assessor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_checklists" ADD CONSTRAINT "be_checklists_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_study_periods" ADD CONSTRAINT "be_study_periods_checklist_id_be_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."be_checklists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_study_periods" ADD CONSTRAINT "be_study_periods_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_summary_results" ADD CONSTRAINT "be_summary_results_checklist_id_be_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."be_checklists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_summary_results" ADD CONSTRAINT "be_summary_results_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directive_responses" ADD CONSTRAINT "compliance_directive_responses_compliance_directive_id_compliance_directives_id_fk" FOREIGN KEY ("compliance_directive_id") REFERENCES "public"."compliance_directives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directive_responses" ADD CONSTRAINT "compliance_directive_responses_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directive_responses" ADD CONSTRAINT "compliance_directive_responses_applicant_user_id_users_id_fk" FOREIGN KEY ("applicant_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directives" ADD CONSTRAINT "compliance_directives_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directives" ADD CONSTRAINT "compliance_directives_issued_by_user_id_users_id_fk" FOREIGN KEY ("issued_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_directives" ADD CONSTRAINT "compliance_directives_issued_to_user_id_users_id_fk" FOREIGN KEY ("issued_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "final_decisions" ADD CONSTRAINT "final_decisions_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "final_decisions" ADD CONSTRAINT "final_decisions_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lookup_items" ADD CONSTRAINT "lookup_items_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_classifications" ADD CONSTRAINT "product_classifications_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_classifications" ADD CONSTRAINT "product_classifications_classified_by_user_id_users_id_fk" FOREIGN KEY ("classified_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_b_document_references" ADD CONSTRAINT "section_b_document_references_checklist_id_be_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."be_checklists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_b_document_references" ADD CONSTRAINT "section_b_document_references_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "applications_application_no_idx" ON "applications" USING btree ("application_no");--> statement-breakpoint
CREATE INDEX "applications_applicant_idx" ON "applications" USING btree ("applicant_user_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("current_status");--> statement-breakpoint
CREATE UNIQUE INDEX "lookup_items_type_value_idx" ON "lookup_items" USING btree ("type","value");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");