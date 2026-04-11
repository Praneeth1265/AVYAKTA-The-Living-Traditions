CREATE TABLE "event_slug" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"more_description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"date" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "events_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "login_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "login_credentials_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"domain" text,
	"role" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"poster_image_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recruitment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"srn" text,
	"sem" text,
	"branch" text,
	"section" text,
	"links" text,
	"experience" text,
	"why_you" text,
	"why_us" text,
	"phone_number" text,
	"email" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"srn" text,
	"branch" text,
	"hostel" boolean DEFAULT false,
	"email" text,
	"phone_no" text,
	"payment_image_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "event_slug" ADD CONSTRAINT "event_slug_title_events_title_fk" FOREIGN KEY ("title") REFERENCES "public"."events"("title") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posters" ADD CONSTRAINT "posters_title_events_title_fk" FOREIGN KEY ("title") REFERENCES "public"."events"("title") ON DELETE cascade ON UPDATE cascade;