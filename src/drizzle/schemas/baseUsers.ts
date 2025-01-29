import { sqliteTable, text   } from "drizzle-orm/sqlite-core";

export const baseUsers = sqliteTable("baseUsers", {
  base_user_id: text("base_user_id").primaryKey(),
  user_email: text("user_email").notNull(),
  user_password: text("user_password").notNull(),
});

