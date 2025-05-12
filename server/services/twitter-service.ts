import { IStorage } from "../storage";
import { BotSettings, InsertTweet, Tweet } from "@shared/schema";
import { DogLanguageService } from "./dog-language-service";
import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';

export class TwitterService {
  private storage: IStorage;
  private dogLanguageService: DogLanguageService;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private wss: WebSocketServer | null = null;
  
  constructor(storage: IStorage) {
    this.storage = storage;
    this.dogLanguageService = new DogLanguageService();
  }
  
  // Set WebSocket server for real-time updates
  setWebSocketServer(wss: WebSocketServer) {
    this.wss = wss;
  }
  
  // Broadcast updates to all connected clients
  private broadcastUpdate(type: string, data: any) {
    if (!this.wss) return;
    
    // Format message
    const message = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    // Send to all connected clients
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Check if Twitter API is working
  async checkApiStatus(): Promise<{ status: string; rateLimit: number }> {
    try {
      // Since we don't have an actual Twitter API, we'll simulate a response
      // In a real implementation, this would make an API call to Twitter
      return {
        status: "operational",
        rateLimit: 38 // % used
      };
    } catch (error) {
      console.error("Failed to check Twitter API status:", error);
      return {
        status: "error",
        rateLimit: 0
      };
    }
  }

  // Start monitoring Twitter for mentions and keywords
  async startMonitoring(settings: BotSettings): Promise<{ success: boolean }> {
    if (this.isMonitoring) {
      return { success: true };
    }
    
    this.isMonitoring = true;
    
    // Broadcast bot status update to all connected clients
    this.broadcastUpdate('bot_status', {
      isActive: true,
      settings
    });
    
    // Convert check frequency to milliseconds
    const checkIntervalMs = this.getCheckIntervalMs(settings.checkFrequency);
    
    // In a real implementation, this would set up Twitter API streaming or polling
    // Since we don't have actual Twitter API access, we'll simulate periodic checks
    this.monitoringInterval = setInterval(() => this.checkTwitter(settings), checkIntervalMs);
    
    // Initial check immediately
    this.checkTwitter(settings);
    
    return { success: true };
  }
  
  // Convert check frequency string to milliseconds
  private getCheckIntervalMs(frequency: string): number {
    // Default to 60 seconds if invalid format
    const defaultMs = 60 * 1000;
    
    try {
      const value = parseInt(frequency);
      if (isNaN(value) || value <= 0) return defaultMs;
      
      if (frequency.endsWith('s')) return value * 1000;
      if (frequency.endsWith('m')) return value * 60 * 1000;
      if (frequency.endsWith('h')) return value * 60 * 60 * 1000;
      
      // If no unit specified, assume seconds
      return value * 1000;
    } catch (error) {
      console.error("Invalid check frequency format:", frequency);
      return defaultMs;
    }
  }

  // Stop monitoring
  async stopMonitoring(): Promise<{ success: boolean }> {
    if (!this.isMonitoring) {
      return { success: true };
    }
    
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    // Broadcast bot status update to all connected clients
    this.broadcastUpdate('bot_status', {
      isActive: false
    });
    
    return { success: true };
  }

  // Check Twitter for mentions and keywords
  private async checkTwitter(settings: BotSettings): Promise<void> {
    try {
      // In a real implementation, this would fetch recent mentions and tweets with tracked keywords
      
      // Simulate checking for mentions if enabled
      if (settings.monitorMentions) {
        await this.checkMentions();
      }
      
      // Simulate checking for tweets with tracked keywords if enabled
      if (settings.monitorKeywords) {
        await this.checkKeywords();
      }
      
      // Get updated stats and broadcast to all clients
      const stats = await this.storage.getStats();
      this.broadcastUpdate('stats_update', stats);
      
    } catch (error) {
      console.error("Error checking Twitter:", error);
    }
  }

  // Check for mentions and respond
  private async checkMentions(): Promise<void> {
    try {
      // In a real implementation, this would fetch recent mentions using Twitter API
      
      // Since we don't have actual Twitter API access, we'll just increment the mention counter
      await this.storage.incrementStats('mentions');
      
      // Get bot settings to check minimum follower count
      const settings = await this.storage.getBotSettings();
      const minimumFollowers = settings?.minimumFollowers || 0;
      
      // Simulate finding and responding to a mention occasionally
      if (Math.random() > 0.7) {
        // Generate a random user and follower count for the simulated user
        const username = '@user' + Math.floor(Math.random() * 1000);
        const userFollowerCount = Math.floor(Math.random() * 5000);
        
        // Check if user has enough followers
        if (userFollowerCount >= minimumFollowers) {
          // Get mention template
          const templates = await this.storage.getTemplatesByType('mention');
          if (templates.length > 0) {
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            
            // Randomly choose between template and random dog responses for more variety
            let response: string;
            
            if (Math.random() > 0.4) {
              // Use template for 60% of responses
              response = this.dogLanguageService.generateResponse(randomTemplate.template, {
                user: username
              });
            } else {
              // 40% chance to use a completely random dog sentence with the username
              response = `${username} ${this.dogLanguageService.generateRandomDogSentence('bonk')}`;
            }
            
            console.log(`Responding to ${username} with ${userFollowerCount} followers (minimum: ${minimumFollowers})`);
            
            // Simulate sending a reply
            await this.simulateReply(response, '12345', username, 'mention_reply');
          }
        } else {
          console.log(`Ignoring ${username} with only ${userFollowerCount} followers (minimum: ${minimumFollowers})`);
        }
      }
    } catch (error) {
      console.error("Error checking mentions:", error);
    }
  }

  // Check for tweets with tracked keywords and respond
  private async checkKeywords(): Promise<void> {
    try {
      // In a real implementation, this would search for tweets containing tracked keywords
      const keywords = await this.storage.getAllKeywords();
      
      // Since we don't have actual Twitter API access, we'll just increment the counter
      await this.storage.incrementStats('keywordsDetected');
      
      // Get bot settings to check minimum follower count
      const settings = await this.storage.getBotSettings();
      const minimumFollowers = settings?.minimumFollowers || 0;
      
      // Simulate finding and responding to a keyword mention occasionally
      if (Math.random() > 0.7) {
        // Generate a random user and follower count for the simulated user
        const username = '@user' + Math.floor(Math.random() * 1000);
        const userFollowerCount = Math.floor(Math.random() * 5000);
        
        // Check if user has enough followers
        if (userFollowerCount >= minimumFollowers) {
          // Get keyword template
          const templates = await this.storage.getTemplatesByType('keyword');
          if (templates.length > 0 && keywords.length > 0) {
            const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
            const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
            
            // Randomly choose between different response types for more variety
            let response: string;
            const randomOption = Math.random();
            
            if (randomOption > 0.7) {
              // 30% chance to use template response
              response = this.dogLanguageService.generateResponse(randomTemplate.template, {
                user: username,
                bonk_price: '$0.000023'
              });
            } else if (randomOption > 0.4) {
              // 30% chance to use a random dog sentence with keyword mention
              response = `${username} did someone say ${randomKeyword.keyword}? ${this.dogLanguageService.generateRandomDogSentence('bonk')}`;
            } else {
              // 40% chance to use a specialized crypto tweet
              response = `${username} ${this.dogLanguageService.generateBonkTweet()}`;
            }
            
            console.log(`Responding to ${username} with ${userFollowerCount} followers for keyword mention (minimum: ${minimumFollowers})`);
            
            // Simulate sending a reply
            await this.simulateReply(response, '67890', username, 'keyword_reply');
          }
        } else {
          console.log(`Ignoring ${username} with only ${userFollowerCount} followers for keyword mention (minimum: ${minimumFollowers})`);
        }
      }
    } catch (error) {
      console.error("Error checking keywords:", error);
    }
  }

  // Simulate sending a reply to a tweet
  private async simulateReply(
    content: string, 
    replyToId: string, 
    replyToUsername: string, 
    type: string
  ): Promise<Tweet> {
    // In a real implementation, this would send a reply using Twitter API
    
    // Create a tweet record
    const tweetData: InsertTweet = {
      content,
      twitterId: Math.random().toString(36).substring(2, 15),
      type,
      replyToId,
      replyToUsername
    };
    
    // Save tweet to storage
    const tweet = await this.storage.createTweet(tweetData);
    
    // Broadcast tweet to clients
    this.broadcastUpdate('new_tweet', tweet);
    
    return tweet;
  }

  // Send a tweet (used for manually composed tweets and scheduled tweets)
  async sendTweet(content: string, replyToId?: string): Promise<Tweet> {
    try {
      // In a real implementation, this would send a tweet using Twitter API
      
      // Create a tweet record
      const tweetData: InsertTweet = {
        content,
        twitterId: Math.random().toString(36).substring(2, 15),
        type: replyToId ? 'manual_reply' : 'manual',
        replyToId,
        replyToUsername: replyToId ? 'someone' : undefined
      };
      
      // Save tweet to storage
      const tweet = await this.storage.createTweet(tweetData);
      
      // Broadcast tweet to clients
      this.broadcastUpdate('new_tweet', tweet);
      
      return tweet;
    } catch (error) {
      console.error("Error sending tweet:", error);
      throw new Error("Failed to send tweet");
    }
  }

  // Send a scheduled tweet
  async sendScheduledTweet(): Promise<Tweet | null> {
    try {
      // Get scheduled tweet template
      const templates = await this.storage.getTemplatesByType('scheduled');
      if (templates.length === 0) {
        return null;
      }
      
      // Randomly decide between using a template or generating a completely random tweet
      let content: string;
      
      if (Math.random() > 0.5) {
        // Generate a completely random bonk tweet for greater variability
        content = this.dogLanguageService.generateBonkTweet();
      } else {
        // Select a random template
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        
        // Generate a dog language tweet using the template
        content = this.dogLanguageService.generateResponse(randomTemplate.template, {
          bonk_price: '$0.000023',
          trend_direction: 'up 5%',
          trend_sentiment: 'excite'
        });
      }
      
      // Create a tweet record
      const tweetData: InsertTweet = {
        content,
        twitterId: Math.random().toString(36).substring(2, 15),
        type: 'scheduled'
      };
      
      // Save tweet to storage and broadcast
      const tweet = await this.storage.createTweet(tweetData);
      
      // Broadcast tweet to clients
      this.broadcastUpdate('new_tweet', tweet);
      
      return tweet;
    } catch (error) {
      console.error("Error sending scheduled tweet:", error);
      return null;
    }
  }
}
