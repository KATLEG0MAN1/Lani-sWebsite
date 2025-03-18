import { pgTable, text, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("videoUrl").notNull(),
  imageUrl: text("imageUrl").notNull(),
  category: text("category").notNull(), 
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  title: true,
  description: true,
  videoUrl: true,
  imageUrl: true,
  category: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;