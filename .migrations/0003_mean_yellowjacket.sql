ALTER TABLE "goalCompletions" ADD COLUMN "completerId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goalCompletions" ADD CONSTRAINT "goalCompletions_completerId_users_id_fk" FOREIGN KEY ("completerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
