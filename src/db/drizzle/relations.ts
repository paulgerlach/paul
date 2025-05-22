import { relations } from "drizzle-orm/relations";
import { usersInAuth, users, objekte } from "./schema";

export const objekteRelations = relations(objekte, ({ one }) => ({
  user: one(users, {
    fields: [objekte.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  objekte: many(objekte),
  usersInAuth: one(usersInAuth, {
    fields: [users.id],
    references: [usersInAuth.id],
  }),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  users: many(users),
}));
