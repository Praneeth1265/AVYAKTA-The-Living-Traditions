import {
  pgTable,
  uuid,
  text,
  date,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").unique().notNull(),
  description: text("description"),
  image_url: text("image_url"),
  date: date("date"),
});

export const event_slug = pgTable("event_slug", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id")
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: text("title").notNull(),
  more_description: text("more_description"),
  image_url: text("image_url"), // comma-separated URLs
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  role: text("role").notNull(),
});

export const posters = pgTable("posters", {
  id: uuid("id").primaryKey().defaultRandom(),
  event_id: uuid("event_id")
    .notNull()
    .references(() => events.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: text("title").notNull(),
  poster_image_url: text("poster_image_url").notNull(),
});

export const recruitment = pgTable("recruitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  srn: text("srn").notNull(),
  year: integer("year").notNull(),
  branch: text("branch").notNull(),
  section: text("section").notNull(),
  links: text("links"),
  experience: text("experience"),
  why_you: text("why_you").notNull(),
  why_us: text("why_us").notNull(),
  phone_no: integer("phone_no").notNull(),
  email: text("email").notNull(),
});

export const registration = pgTable("registration", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  srn: text("srn").notNull(),
  branch: text("branch").notNull(),
  hostel: boolean("hostel").default(false),
  email: text("email").notNull(),
  phone_no: integer("phone_no").notNull(),
  payment_image_url: text("payment_image_url"),
});

export const login_credentials = pgTable("login_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password_hash: text("password_hash").notNull(),
});

export const admin_sessions = pgTable("admin_sessions", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => login_credentials.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text("email").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
  revoked_at: timestamp("revoked_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
