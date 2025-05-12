import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw, Power } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BotControlPanel from "@/components/bot-control-panel";
import TweetComposer from "@/components/tweet-composer";
import BotMonitoring from "@/components/bot-monitoring";
import ResponseTemplates from "@/components/response-templates";
import bonkDogLogo from "@/assets/bonk-dog-logo.svg";

export default function Dashboard() {
  const { toast } = useToast();
  const [botRunning, setBotRunning] = useState<boolean>(false);
  
  // Check bot status mutation
  const checkStatus = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('GET', '/api/twitter/status');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Status Checked",
        description: `Bot is ${data.status === 'operational' ? 'operating normally' : 'experiencing issues'}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check bot status.",
        variant: "destructive",
      });
    }
  });
  
  // Start Twitter bot mutation
  const startBot = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/twitter/start');
      return res.json();
    },
    onSuccess: () => {
      setBotRunning(true);
      toast({
        title: "Bot Started",
        description: "Bonk Dog Bot is now running and will automatically respond to mentions and keywords!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start the bot. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Stop Twitter bot mutation
  const stopBot = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/twitter/stop');
      return res.json();
    },
    onSuccess: () => {
      setBotRunning(false);
      toast({
        title: "Bot Stopped",
        description: "Bonk Dog Bot has been stopped.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stop the bot. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Start the bot automatically when the dashboard loads
  useEffect(() => {
    startBot.mutate();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-twitterLightGray font-inter text-twitterDarkGray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={bonkDogLogo} 
              alt="Bonk Dog Mascot" 
              className="w-10 h-10 rounded-full border-2 border-bonkYellow"
            />
            <h1 className="text-xl font-bold">Bonk Dog Bot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-twitterBlue hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition flex items-center"
              onClick={() => checkStatus.mutate()}
              disabled={checkStatus.isPending}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Status
            </Button>
            <Button
              className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${botRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              onClick={() => botRunning ? stopBot.mutate() : startBot.mutate()}
              disabled={startBot.isPending || stopBot.isPending}
            >
              <Power className="w-4 h-4 mr-2" />
              {botRunning ? 'Stop Bot' : 'Start Bot'}
            </Button>
            <div className="relative">
              <span className={`flex h-3 w-3 absolute -top-1 -right-1 ${botRunning ? 'visible' : 'invisible'}`}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${botRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {botRunning ? 'Bot Active' : 'Bot Inactive'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-6 px-4 md:px-0 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Bot Control Panel */}
        <BotControlPanel />
        
        {/* Right Column - Bot Content & Monitoring */}
        <div className="lg:w-2/3 space-y-6">
          <TweetComposer />
          <BotMonitoring />
          <ResponseTemplates />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-twitterMediumGray text-sm">
        <p>Bonk Dog Bot Dashboard &copy; {new Date().getFullYear()} | <a href="#" className="text-twitterBlue hover:underline">Terms</a> | <a href="#" className="text-twitterBlue hover:underline">Privacy</a> | <a href="#" className="text-twitterBlue hover:underline">Help</a></p>
      </footer>
    </div>
  );
}
