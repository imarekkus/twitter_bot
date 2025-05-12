import { 
  users, type User, type InsertUser,
  botSettings, type BotSettings, type InsertBotSettings,
  keywords, type Keyword, type InsertKeyword,
  templates, type Template, type InsertTemplate,
  tweets, type Tweet, type InsertTweet,
  stats, type Stats, type InsertStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bot settings methods
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: Partial<InsertBotSettings>): Promise<BotSettings>;

  // Keywords methods
  getAllKeywords(): Promise<Keyword[]>;
  getKeyword(id: number): Promise<Keyword | undefined>;
  getKeywordByName(keyword: string): Promise<Keyword | undefined>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
  deleteKeyword(id: number): Promise<boolean>;

  // Templates methods
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByType(type: string): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<boolean>;

  // Tweets methods
  getAllTweets(limit?: number, offset?: number): Promise<Tweet[]>;
  getTweet(id: number): Promise<Tweet | undefined>;
  createTweet(tweet: InsertTweet): Promise<Tweet>;

  // Stats methods
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: Partial<InsertStats>): Promise<Stats>;
  incrementStats(field: keyof InsertStats, amount?: number): Promise<Stats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private botSettingsMap: Map<number, BotSettings>;
  private keywordsMap: Map<number, Keyword>;
  private templatesMap: Map<number, Template>;
  private tweetsMap: Map<number, Tweet>;
  private statsMap: Map<number, Stats>;
  
  private userCurrentId: number;
  private botSettingsCurrentId: number;
  private keywordsCurrentId: number;
  private templatesCurrentId: number;
  private tweetsCurrentId: number;
  private statsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.botSettingsMap = new Map();
    this.keywordsMap = new Map();
    this.templatesMap = new Map();
    this.tweetsMap = new Map();
    this.statsMap = new Map();
    
    this.userCurrentId = 1;
    this.botSettingsCurrentId = 1;
    this.keywordsCurrentId = 1;
    this.templatesCurrentId = 1;
    this.tweetsCurrentId = 1;
    this.statsCurrentId = 1;

    // Initialize default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default settings
    const defaultSettings: InsertBotSettings = {
      monitorMentions: true,
      monitorKeywords: true,
      scheduledTweets: true,
      tweetFrequency: "3h",
      responseDelay: 30,
      minimumFollowers: 100,
      checkFrequency: "60s"
    };
    this.updateBotSettings(defaultSettings);

    // Create default keywords
    const defaultKeywords = ["$bonk", "bonk coin", "bonk token", "doggo", "dog coin"];
    defaultKeywords.forEach(keyword => this.createKeyword({ keyword }));

    // Create default templates
    const mentionTemplate: InsertTemplate = {
      name: "When mentioned directly",
      template: "*perks ears* BORK! Someone call Bonk Dog? *tail wags* Am here for {{user}}! Such mention, very honor! Woof!",
      variables: "{{user}}",
      type: "mention"
    };
    
    const keywordTemplate: InsertTemplate = {
      name: "When $bonk is mentioned",
      template: "*sniffs* I smell $bonk! Very crypto! Much excitement! *jumps around* {{user}} has the good taste! To the moon! Bonk bonk!",
      variables: "{{user}}, {{bonk_price}}",
      type: "keyword"
    };
    
    const scheduledTemplate: InsertTemplate = {
      name: "Daily updates",
      template: "*stretches paws* Good morning frens! $bonk price is {{bonk_price}} today! {{trend_direction}} from yesterday! Such {{trend_sentiment}}! Very investment! Who wants treatos?",
      variables: "{{bonk_price}}, {{trend_direction}}, {{trend_sentiment}}",
      type: "scheduled"
    };
    
    this.createTemplate(mentionTemplate);
    this.createTemplate(keywordTemplate);
    this.createTemplate(scheduledTemplate);

    // Create initial stats
    const initialStats: InsertStats = {
      tweetsSent: 247,
      mentions: 183,
      keywordsDetected: 362,
      followers: 1200
    };
    this.updateStats(initialStats);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Bot settings methods
  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettingsMap.get(1); // Always use ID 1 for bot settings
  }

  async updateBotSettings(settings: Partial<InsertBotSettings>): Promise<BotSettings> {
    const existingSettings = await this.getBotSettings();
    
    const updatedSettings: BotSettings = {
      id: 1,
      monitorMentions: settings.monitorMentions ?? existingSettings?.monitorMentions ?? true,
      monitorKeywords: settings.monitorKeywords ?? existingSettings?.monitorKeywords ?? true,
      scheduledTweets: settings.scheduledTweets ?? existingSettings?.scheduledTweets ?? true,
      tweetFrequency: settings.tweetFrequency ?? existingSettings?.tweetFrequency ?? "6h",
      responseDelay: settings.responseDelay ?? existingSettings?.responseDelay ?? 30,
      minimumFollowers: settings.minimumFollowers ?? existingSettings?.minimumFollowers ?? 100,
      checkFrequency: settings.checkFrequency ?? existingSettings?.checkFrequency ?? "60s"
    };
    
    this.botSettingsMap.set(1, updatedSettings);
    return updatedSettings;
  }

  // Keywords methods
  async getAllKeywords(): Promise<Keyword[]> {
    return Array.from(this.keywordsMap.values());
  }

  async getKeyword(id: number): Promise<Keyword | undefined> {
    return this.keywordsMap.get(id);
  }

  async getKeywordByName(keyword: string): Promise<Keyword | undefined> {
    return Array.from(this.keywordsMap.values()).find(
      (k) => k.keyword.toLowerCase() === keyword.toLowerCase(),
    );
  }

  async createKeyword(insertKeyword: InsertKeyword): Promise<Keyword> {
    const existingKeyword = await this.getKeywordByName(insertKeyword.keyword);
    if (existingKeyword) {
      return existingKeyword;
    }
    
    const id = this.keywordsCurrentId++;
    const keyword: Keyword = { ...insertKeyword, id };
    this.keywordsMap.set(id, keyword);
    return keyword;
  }

  async deleteKeyword(id: number): Promise<boolean> {
    return this.keywordsMap.delete(id);
  }

  // Templates methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templatesMap.values());
  }

  async getTemplatesByType(type: string): Promise<Template[]> {
    return Array.from(this.templatesMap.values()).filter(
      (template) => template.type === type,
    );
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templatesMap.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templatesCurrentId++;
    const template: Template = { ...insertTemplate, id };
    this.templatesMap.set(id, template);
    return template;
  }

  async updateTemplate(id: number, templateData: Partial<InsertTemplate>): Promise<Template> {
    const existingTemplate = await this.getTemplate(id);
    if (!existingTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    const updatedTemplate: Template = {
      ...existingTemplate,
      name: templateData.name ?? existingTemplate.name,
      template: templateData.template ?? existingTemplate.template,
      variables: templateData.variables ?? existingTemplate.variables,
      type: templateData.type ?? existingTemplate.type
    };
    
    this.templatesMap.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templatesMap.delete(id);
  }

  // Tweets methods
  async getAllTweets(limit: number = 20, offset: number = 0): Promise<Tweet[]> {
    const tweets = Array.from(this.tweetsMap.values());
    // Sort by sentAt in descending order
    tweets.sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    return tweets.slice(offset, offset + limit);
  }

  async getTweet(id: number): Promise<Tweet | undefined> {
    return this.tweetsMap.get(id);
  }

  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const id = this.tweetsCurrentId++;
    const tweet: Tweet = { 
      id,
      content: insertTweet.content,
      twitterId: insertTweet.twitterId,
      type: insertTweet.type,
      sentAt: new Date(),
      replyToId: insertTweet.replyToId || null,
      replyToUsername: insertTweet.replyToUsername || null
    };
    this.tweetsMap.set(id, tweet);
    
    // Increment stats
    await this.incrementStats('tweetsSent');
    
    return tweet;
  }

  // Stats methods
  async getStats(): Promise<Stats | undefined> {
    return this.statsMap.get(1); // Always use ID 1 for stats
  }

  async updateStats(statsData: Partial<InsertStats>): Promise<Stats> {
    const existingStats = await this.getStats();
    
    const updatedStats: Stats = {
      id: 1,
      tweetsSent: statsData.tweetsSent ?? existingStats?.tweetsSent ?? 0,
      mentions: statsData.mentions ?? existingStats?.mentions ?? 0,
      keywordsDetected: statsData.keywordsDetected ?? existingStats?.keywordsDetected ?? 0,
      followers: statsData.followers ?? existingStats?.followers ?? 0,
      lastUpdated: new Date()
    };
    
    this.statsMap.set(1, updatedStats);
    return updatedStats;
  }

  async incrementStats(field: keyof InsertStats, amount: number = 1): Promise<Stats> {
    const stats = await this.getStats();
    if (!stats) {
      throw new Error('Stats not initialized');
    }
    
    const updatedStats: Partial<InsertStats> = {
      ...stats,
      [field]: (stats[field] as number) + amount
    };
    
    return this.updateStats(updatedStats);
  }
}

export const storage = new MemStorage();
