import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: int("completed", { mode: "boolean" }).notNull().default(false),
  userId: int("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: int("created_at", { mode: "number" })
    .notNull()
    .default(Date.now()),
  updatedAt: int("updated_at", { mode: "number" })
    .notNull()
    .default(Date.now())
    .$onUpdate(() => new Date().getTime()),
});

export type InsertTodo = typeof todos.$inferInsert;
export type SelectTodo = typeof todos.$inferSelect;

export const users = sqliteTable("users", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: int("created_at", { mode: "number" })
    .notNull()
    .default(Date.now()),
  updatedAt: int("updated_at", { mode: "number" })
    .notNull()
    .default(Date.now())
    .$onUpdate(() => new Date().getTime()),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const sessions = sqliteTable("sessions", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: int("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: int("expires_at", { mode: "number" }).notNull(),
  createdAt: int("created_at", { mode: "number" })
    .notNull()
    .default(Date.now()),
});

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

export const userRelations = relations(users, ({ many, one }) => ({
  todos: many(todos, {
    relationName: "user_todos",
  }),
  sessions: many(sessions, {
    relationName: "user_sessions",
  }),
}));
