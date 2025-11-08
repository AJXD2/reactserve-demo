import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: int("completed", { mode: "boolean" }).notNull().default(false),
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
