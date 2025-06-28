import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  givenName: text("given_name"),
  picture: text("picture"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSignIn: timestamp("last_sign_in").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyMemos = pgTable("daily_memos", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(), // Format: "2025-06-28"
  link: text("link"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastSignIn: true,
});

export const insertDailyMemoSchema = createInsertSchema(dailyMemos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type DailyMemo = typeof dailyMemos.$inferSelect;
export type InsertDailyMemo = z.infer<typeof insertDailyMemoSchema>;
