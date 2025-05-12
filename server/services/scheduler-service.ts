import { IStorage } from "../storage";
import { TwitterService } from "./twitter-service";
import schedule from "node-schedule";

export class SchedulerService {
  private storage: IStorage;
  private twitterService: TwitterService;
  private job: schedule.Job | null = null;
  
  constructor(storage: IStorage, twitterService: TwitterService) {
    this.storage = storage;
    this.twitterService = twitterService;
  }

  // Start the scheduler based on frequency
  startScheduler(frequency: string): void {
    if (this.job) {
      this.stopScheduler();
    }
    
    // Parse frequency into cron expression
    const cronExpression = this.frequencyToCron(frequency);
    
    // Schedule the job
    this.job = schedule.scheduleJob(cronExpression, async () => {
      try {
        // Send a scheduled tweet
        await this.twitterService.sendScheduledTweet();
      } catch (error) {
        console.error("Error in scheduled tweet job:", error);
      }
    });
    
    console.log(`Scheduler started with frequency: ${frequency} (${cronExpression})`);
  }

  // Stop the scheduler
  stopScheduler(): void {
    if (this.job) {
      this.job.cancel();
      this.job = null;
      console.log("Scheduler stopped");
    }
  }

  // Restart scheduler with new frequency
  restartScheduler(frequency: string): void {
    this.stopScheduler();
    this.startScheduler(frequency);
  }

  // Convert frequency string to cron expression
  private frequencyToCron(frequency: string): string {
    switch (frequency) {
      case "15m":
        return "*/15 * * * *"; // Every 15 minutes
      case "30m":
        return "*/30 * * * *"; // Every 30 minutes
      case "1h":
        return "0 * * * *"; // Every hour at minute 0
      case "2h":
        return "0 */2 * * *"; // Every 2 hours
      case "3h":
        return "0 */3 * * *"; // Every 3 hours
      case "4h":
        return "0 */4 * * *"; // Every 4 hours
      case "6h":
        return "0 */6 * * *"; // Every 6 hours
      case "8h":
        return "0 */8 * * *"; // Every 8 hours
      case "12h":
        return "0 */12 * * *"; // Every 12 hours
      case "24h":
      case "daily":
        return "0 9 * * *"; // Every day at 9 AM
      default:
        return "0 */6 * * *"; // Default: every 6 hours
    }
  }
}
