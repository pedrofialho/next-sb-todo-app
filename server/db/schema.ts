import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  foreignKey,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const todos = pgTable(
  "todos",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity(),
    title: text().notNull(),
    completed: boolean().notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    userId: uuid("user_id").default(sql`auth.uid()`),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [authUsers.id],
      name: "todos_user_id_fkey",
    }),
    pgPolicy("Users can delete their own todos", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`(auth.uid() = user_id)`,
    }),
    pgPolicy("Users can update their own todos", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Users can create their own todos", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Users can view their own todos", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ]
);

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert 