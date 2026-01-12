import { pgTable, uuid, text, timestamp, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const attendeeStatusEnum = pgEnum("attendee_status", ["registered", "checked_in"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
});

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    date: timestamp("date").notNull(),
    location: text("location"),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attendees = pgTable("attendees", {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }).notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    ticketCode: text("ticket_code").notNull().unique(),
    status: attendeeStatusEnum("status").notNull().default("registered"),
    checkinAt: timestamp("checkin_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    eventEmailIdx: uniqueIndex("event_email_idx").on(table.eventId, table.email),
}));
