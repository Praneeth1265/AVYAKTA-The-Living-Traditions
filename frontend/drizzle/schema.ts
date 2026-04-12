import {
  pgTable,
  uuid,
  text,
  date,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").unique().notNull(),
  description: text("description"),
  image_url: text("image_url"),
  date: date("date"),
  created_at: timestamp("created_at").defaultNow(),
});

export const event_slug = pgTable("event_slug", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title")
    .notNull()
    .references(() => events.title, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  more_description: text("more_description"),
  image_url: text("image_url"), // comma-separated URLs
  created_at: timestamp("created_at").defaultNow(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  role: text("role"),
  created_at: timestamp("created_at").defaultNow(),
});

export const posters = pgTable("posters", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title")
    .notNull()
    .references(() => events.title, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  poster_image_url: text("poster_image_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const recruitment = pgTable("recruitment", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  srn: text("srn").notNull(),
  sem: text("sem"),
  branch: text("branch"),
  section: text("section"),
  links: text("links"),
  experience: text("experience"),
  why_you: text("why_you"),
  why_us: text("why_us"),
  phone_number: text("phone_number"),
  email: text("email"),
  created_at: timestamp("created_at").defaultNow(),
});

export const registration = pgTable("registration", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  srn: text("srn"),
  branch: text("branch"),
  hostel: boolean("hostel").default(false),
  email: text("email"),
  phone_no: text("phone_no"),
  payment_image_url: text("payment_image_url"),
  created_at: timestamp("created_at").defaultNow(),
});

export const login_credentials = pgTable("login_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
