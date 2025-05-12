import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertBotSettingsSchema,
  insertKeywordSchema,
  insertTemplateSchema,
  insertTweetSchema
} from "@shared/schema";
import { TwitterService } from "./services/twitter-service";
import { SchedulerService } from "./services/scheduler-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create Twitter and scheduler services
  const twitterService = new TwitterService(storage);
  const schedulerService = new SchedulerService(storage, twitterService);
  
  // Start the scheduler if scheduled tweets are enabled
  const settings = await storage.getBotSettings();
  if (settings?.scheduledTweets) {
    schedulerService.startScheduler(settings.tweetFrequency);
  }
  
  // Get bot settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      return res.json(settings);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get settings" });
    }
  });

  // Update bot settings
  app.post("/api/settings", async (req, res) => {
    try {
      const validated = insertBotSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateBotSettings(validated);
      
      // If scheduled tweets setting changed, update the scheduler
      if (validated.scheduledTweets !== undefined) {
        if (validated.scheduledTweets) {
          schedulerService.startScheduler(updatedSettings.tweetFrequency);
        } else {
          schedulerService.stopScheduler();
        }
      }
      
      // If tweet frequency changed and scheduled tweets are enabled, restart scheduler
      if (validated.tweetFrequency !== undefined && updatedSettings.scheduledTweets) {
        schedulerService.restartScheduler(validated.tweetFrequency);
      }
      
      return res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Get keywords
  app.get("/api/keywords", async (req, res) => {
    try {
      const keywords = await storage.getAllKeywords();
      return res.json(keywords);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get keywords" });
    }
  });

  // Add keyword
  app.post("/api/keywords", async (req, res) => {
    try {
      const validated = insertKeywordSchema.parse(req.body);
      const existingKeyword = await storage.getKeywordByName(validated.keyword);
      
      if (existingKeyword) {
        return res.status(409).json({ message: "Keyword already exists" });
      }
      
      const keyword = await storage.createKeyword(validated);
      return res.status(201).json(keyword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid keyword data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create keyword" });
    }
  });

  // Delete keyword
  app.delete("/api/keywords/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid keyword ID" });
      }
      
      const keyword = await storage.getKeyword(id);
      if (!keyword) {
        return res.status(404).json({ message: "Keyword not found" });
      }
      
      await storage.deleteKeyword(id);
      return res.json({ message: "Keyword deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete keyword" });
    }
  });

  // Get templates
  app.get("/api/templates", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      
      if (type) {
        const templates = await storage.getTemplatesByType(type);
        return res.json(templates);
      } else {
        const templates = await storage.getAllTemplates();
        return res.json(templates);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to get templates" });
    }
  });

  // Get single template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      return res.json(template);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get template" });
    }
  });

  // Add template
  app.post("/api/templates", async (req, res) => {
    try {
      const validated = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validated);
      return res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create template" });
    }
  });

  // Update template
  app.put("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      const validated = insertTemplateSchema.partial().parse(req.body);
      const updatedTemplate = await storage.updateTemplate(id, validated);
      return res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to update template" });
    }
  });

  // Delete template
  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      await storage.deleteTemplate(id);
      return res.json({ message: "Template deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Get tweets
  app.get("/api/tweets", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const tweets = await storage.getAllTweets(limit, offset);
      return res.json(tweets);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get tweets" });
    }
  });

  // Send tweet
  app.post("/api/tweets", async (req, res) => {
    try {
      const validated = insertTweetSchema.parse(req.body);
      
      // Use the Twitter service to send the tweet
      const tweet = await twitterService.sendTweet(validated.content, validated.replyToId);
      
      return res.status(201).json(tweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tweet data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to send tweet" });
    }
  });

  // Get stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get stats" });
    }
  });

  // Check Twitter API status
  app.get("/api/twitter/status", async (req, res) => {
    try {
      const status = await twitterService.checkApiStatus();
      return res.json(status);
    } catch (error) {
      return res.status(500).json({ message: "Failed to check Twitter API status" });
    }
  });

  // Start Twitter bot manually (for testing)
  app.post("/api/twitter/start", async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      
      if (!settings) {
        return res.status(404).json({ message: "Bot settings not found" });
      }
      
      const result = await twitterService.startMonitoring(settings);
      
      if (settings.scheduledTweets) {
        schedulerService.startScheduler(settings.tweetFrequency);
      }
      
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Failed to start Twitter bot" });
    }
  });

  // Stop Twitter bot manually (for testing)
  app.post("/api/twitter/stop", async (req, res) => {
    try {
      const result = await twitterService.stopMonitoring();
      schedulerService.stopScheduler();
      
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Failed to stop Twitter bot" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
