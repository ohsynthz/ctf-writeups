import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const writeups = sqliteTable("writeups", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  challenge: text("challenge").notNull(),
  ctf: text("ctf").notNull(),
  category: text("category").notNull(),
  tags: text("tags").notNull(),
  difficulty: text("difficulty").notNull(),
  content: text("content").notNull(),
  submittedBy: text("submitted_by"),
  createdAt: text("created_at").notNull(),
});
