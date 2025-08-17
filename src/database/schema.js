import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const tasksTable = pgTable('tasks', {
  id: integer('id').primaryKey(),
  text: varchar({ length: 255 }).notNull(),
  checked: boolean('checked').notNull().default(false),
  time: text('time').notNull(),
});