ALTER TABLE "goals" RENAME COLUMN "owner" TO "ownerId";--> statement-breakpoint
ALTER TABLE "goals" DROP CONSTRAINT "goals_owner_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals" ADD CONSTRAINT "goals_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
