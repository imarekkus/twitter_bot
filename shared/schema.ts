import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (admin users for the dashboard)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Bot settings table
export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  monitorMentions: boolean("monitor_mentions").notNull().default(true),
  monitorKeywords: boolean("monitor_keywords").notNull().default(true),
  scheduledTweets: boolean("scheduled_tweets").notNull().default(true),
  tweetFrequency: text("tweet_frequency").notNull().default("6h"),
  responseDelay: integer("response_delay").notNull().default(30),
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({
  id: true,
});

// Keywords table
export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull().unique(),
});

export const insertKeywordSchema = createInsertSchema(keywords).omit({
  id: true,
});

// Tweet templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  template: text("template").notNull(),
  variables: text("variables").notNull(),
  type: text("type").notNull(), // "mention", "keyword", "scheduled"
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

// Tweets table (stores sent tweets)
export const tweets = pgTable("tweets", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  twitterId: text("twitter_id").notNull().unique(),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  type: text("type").notNull(), // "mention_reply", "keyword_reply", "scheduled"
  replyToId: text("reply_to_id"),
  replyToUsername: text("reply_to_username"),
});

export const insertTweetSchema = createInsertSchema(tweets).omit({
  id: true,
  sentAt: true,
});

// Stats table
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  tweetsSent: integer("tweets_sent").notNull().default(0),
  mentions: integer("mentions").notNull().default(0),
  keywordsDetected: integer("keywords_detected").notNull().default(0),
  followers: integer("followers").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  lastUpdated: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;

export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type Tweet = typeof tweets.$inferSelect;
export type InsertTweet = z.infer<typeof insertTweetSchema>;

export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
