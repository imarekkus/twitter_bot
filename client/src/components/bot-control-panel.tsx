import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ToggleSwitch from "@/components/toggle-switch";
import { BotSettings, Keyword, Stats } from "@shared/schema";
import { RefreshCw, Cog, ChartBar, Hash, XCircle } from "lucide-react";
import { TwitterStatus } from "@/types/twitter";

export default function BotControlPanel() {
  const { toast } = useToast();
  const [keywordInput, setKeywordInput] = useState("");

  // Fetch bot settings
  const { 
    data: settings, 
    isLoading: isSettingsLoading,
    refetch: refetchSettings
  } = useQuery<BotSettings>({
    queryKey: ['/api/settings'],
  });

  // Fetch keywords
  const {
    data: keywords,
    isLoading: isKeywordsLoading,
    refetch: refetchKeywords
  } = useQuery<Keyword[]>({
    queryKey: ['/api/keywords'],
  });

  // Fetch stats
  const { 
    data: stats, 
    isLoading: isStatsLoading,
    refetch: refetchStats 
  } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  // Fetch Twitter API status
  const { 
    data: twitterStatus, 
    isLoading: isStatusLoading,
    refetch: refetchStatus
  } = useQuery<TwitterStatus>({
    queryKey: ['/api/twitter/status'],
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<BotSettings>) => {
      const res = await apiRequest('POST', '/api/settings', newSettings);
      return res.json();
    },
    onSuccess: () => {
      refetchSettings();
      toast({
        title: "Settings Updated",
        description: "Bot settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update settings: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Add keyword mutation
  const addKeyword = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await apiRequest('POST', '/api/keywords', { keyword });
      return res.json();
    },
    onSuccess: () => {
      setKeywordInput("");
      refetchKeywords();
      toast({
        title: "Keyword Added",
        description: "New keyword has been added to tracking list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add keyword: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Delete keyword mutation
  const deleteKeyword = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/keywords/${id}`);
      return res.json();
    },
    onSuccess: () => {
      refetchKeywords();
      toast({
        title: "Keyword Removed",
        description: "Keyword has been removed from tracking list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove keyword: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Check bot status
  const checkStatus = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('GET', '/api/twitter/status');
      return res.json();
    },
    onSuccess: () => {
      refetchStatus();
      toast({
        title: "Status Checked",
        description: "Bot status has been refreshed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to check bot status: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSettingsToggle = (field: keyof BotSettings, value: boolean) => {
    updateSettings.mutate({ [field]: value });
  };

  const handleFrequencyChange = (value: string) => {
    updateSettings.mutate({ tweetFrequency: value });
  };

  const handleDelayChange = (value: number[]) => {
    updateSettings.mutate({ responseDelay: value[0] });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      addKeyword.mutate(keywordInput.trim());
    }
  };

  if (isSettingsLoading || isKeywordsLoading || isStatsLoading) {
    return (
      <div className="lg:w-1/3 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p>Loading bot controls...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:w-1/3 space-y-6">
      {/* Bot Settings Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Cog className="w-5 h-5 text-twitterMediumGray mr-2" />
            Bot Settings
          </h2>
          <div className="space-y-4">
            {/* Toggle switches for bot functionality */}
            <ToggleSwitch
              name="monitor-mentions"
              label="Monitor Mentions"
              checked={settings?.monitorMentions ?? true}
              onToggle={(value) => handleSettingsToggle('monitorMentions', value)}
              disabled={updateSettings.isPending}
            />
            
            <ToggleSwitch
              name="monitor-keywords"
              label="Monitor $bonk Keywords"
              checked={settings?.monitorKeywords ?? true}
              onToggle={(value) => handleSettingsToggle('monitorKeywords', value)}
              disabled={updateSettings.isPending}
            />
            
            <ToggleSwitch
              name="scheduled-tweets"
              label="Post Scheduled Tweets"
              checked={settings?.scheduledTweets ?? true}
              onToggle={(value) => handleSettingsToggle('scheduledTweets', value)}
              disabled={updateSettings.isPending}
            />
            
            <div className="pt-2">
              <label className="block font-medium mb-2">Tweet Frequency</label>
              <Select 
                value={settings?.tweetFrequency ?? "3h"} 
                onValueChange={handleFrequencyChange} 
                disabled={updateSettings.isPending || !settings?.scheduledTweets}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3h">Every 3 hours</SelectItem>
                  <SelectItem value="6h">Every 6 hours</SelectItem>
                  <SelectItem value="12h">Every 12 hours</SelectItem>
                  <SelectItem value="24h">Once daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <label className="block font-medium mb-2">Response Delay (seconds)</label>
              <Slider 
                defaultValue={[settings?.responseDelay ?? 30]} 
                max={300} 
                step={10}
                onValueChange={handleDelayChange}
                disabled={updateSettings.isPending}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0s</span>
                <span>{settings?.responseDelay ?? 30}s</span>
                <span>5m</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bot Stats Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <ChartBar className="w-5 h-5 text-twitterMediumGray mr-2" />
            Bot Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-twitterLightGray p-4 rounded-lg">
              <p className="text-sm text-twitterMediumGray">Tweets Sent</p>
              <p className="text-2xl font-bold">{stats?.tweetsSent ?? 0}</p>
            </div>
            <div className="bg-twitterLightGray p-4 rounded-lg">
              <p className="text-sm text-twitterMediumGray">Mentions</p>
              <p className="text-2xl font-bold">{stats?.mentions ?? 0}</p>
            </div>
            <div className="bg-twitterLightGray p-4 rounded-lg">
              <p className="text-sm text-twitterMediumGray">$bonk Detected</p>
              <p className="text-2xl font-bold">{stats?.keywordsDetected ?? 0}</p>
            </div>
            <div className="bg-twitterLightGray p-4 rounded-lg">
              <p className="text-sm text-twitterMediumGray">Followers</p>
              <p className="text-2xl font-bold">{(stats?.followers ?? 0) >= 1000 ? `${(stats?.followers ?? 0) / 1000}k` : stats?.followers}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">API Rate Limit</h3>
            <Progress value={twitterStatus?.rateLimit ?? 0} className="h-2.5" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{twitterStatus?.rateLimit ?? 0}% used</span>
              <span>Resets in 15 min</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Keywords Card */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Hash className="w-5 h-5 text-twitterMediumGray mr-2" />
            Tracked Keywords
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords?.map((keyword) => (
              <div key={keyword.id} className="bg-bonkYellow bg-opacity-20 text-twitterDarkGray px-3 py-1 rounded-full text-sm flex items-center">
                <span>{keyword.keyword}</span>
                <button 
                  onClick={() => deleteKeyword.mutate(keyword.id)}
                  className="ml-2 text-twitterMediumGray hover:text-red-500 focus:outline-none"
                  disabled={deleteKeyword.isPending}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            {keywords?.length === 0 && (
              <p className="text-sm text-twitterMediumGray">No keywords tracked yet</p>
            )}
          </div>
          <div className="flex">
            <Input
              type="text"
              placeholder="Add new keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="rounded-r-none focus:ring-bonkYellow"
            />
            <Button
              onClick={handleAddKeyword}
              className="bg-bonkYellow hover:bg-yellow-500 text-twitterDarkGray rounded-l-none"
              disabled={!keywordInput.trim() || addKeyword.isPending}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
