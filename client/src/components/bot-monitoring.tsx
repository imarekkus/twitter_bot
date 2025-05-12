import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Bell, Reply, Heart, MessageSquare, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tweet } from "@shared/schema";
import { formatTimestamp } from "@/lib/dog-language";
import bonkDogLogo from "@/assets/bonk-dog-logo.svg";

export default function BotMonitoring() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  
  // Fetch tweets
  const {
    data: tweets,
    isLoading,
    refetch
  } = useQuery<Tweet[]>({
    queryKey: ['/api/tweets'],
  });

  // Send reply mutation
  const sendReply = useMutation({
    mutationFn: async ({ content, replyToId }: { content: string; replyToId: string }) => {
      const res = await apiRequest('POST', '/api/tweets', { content, replyToId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tweets'] });
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter tweets based on selected filter
  const filteredTweets = tweets?.filter(tweet => {
    if (filter === "all") return true;
    if (filter === "mentions") return tweet.type === "mention_reply";
    if (filter === "bonk") return tweet.type === "keyword_reply";
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Bell className="w-5 h-5 text-twitterMediumGray mr-2" />
            Recent Mentions & Detections
          </h2>
          <div className="flex justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-twitterMediumGray" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate a mock profile image URL (in real app, this would come from the Twitter API)
  const getProfileImage = (username: string) => {
    // This is just to simulate different profile images for different users
    const hashCode = username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return `https://i.pravatar.cc/100?u=${Math.abs(hashCode)}`;
  };

  // Create a reply to a tweet
  const handleReply = (replyToId: string) => {
    // For demo purposes, we'll use a fixed reply
    // In a real implementation, this would open a compose dialog
    const reply = "*wags tail furiously* WOOF! Much excite for $bonk! Very moon! Such wow! *drops tennis ball at ur feet* Bonk is doin me a happy! 🐕";
    sendReply.mutate({ content: reply, replyToId });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <Bell className="w-5 h-5 text-twitterMediumGray mr-2" />
            Recent Mentions & Detections
          </h2>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-twitterBlue text-white" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "mentions" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("mentions")}
              className={filter === "mentions" ? "bg-twitterBlue text-white" : ""}
            >
              Mentions
            </Button>
            <Button
              variant={filter === "bonk" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("bonk")}
              className={filter === "bonk" ? "bg-twitterBlue text-white" : ""}
            >
              $bonk
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredTweets && filteredTweets.length > 0 ? (
            filteredTweets.map((tweet) => {
              const isOwnTweet = !tweet.replyToId || tweet.type === 'scheduled' || tweet.type === 'manual';
              
              return (
                <div key={tweet.id} className={`tweet-box border border-gray-200 rounded-lg p-4 hover:border-bonkYellow cursor-pointer transition ${isOwnTweet ? 'bg-twitterLightGray bg-opacity-50' : ''}`}>
                  {tweet.replyToId && tweet.replyToUsername && (
                    <div className="text-xs text-twitterMediumGray mb-2">
                      <Reply className="w-3 h-3 inline mr-1" /> You replied to @{tweet.replyToUsername}
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <img 
                      src={isOwnTweet ? bonkDogLogo : getProfileImage(tweet.replyToUsername || 'user')} 
                      alt={isOwnTweet ? "Bonk Dog Avatar" : "User avatar"} 
                      className={`w-10 h-10 rounded-full ${isOwnTweet ? 'border-2 border-bonkYellow' : ''}`}
                    />
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="font-bold">{isOwnTweet ? "Bonk Dog" : tweet.replyToUsername ? `@${tweet.replyToUsername}` : "Twitter User"}</h3>
                        <span className="text-twitterMediumGray text-sm ml-2">{isOwnTweet ? "@BonkDogBot" : ""}</span>
                        <span className="text-twitterMediumGray text-xs ml-auto">{formatTimestamp(new Date(tweet.sentAt))}</span>
                      </div>
                      <p className={`mt-1 ${isOwnTweet ? 'font-comic' : ''}`}>{tweet.content}</p>
                      <div className="flex items-center mt-3 text-twitterMediumGray">
                        <button className="mr-4 hover:text-doggoRed transition">
                          <Heart className="w-4 h-4 inline mr-1" />
                          <span className="text-xs">{Math.floor(Math.random() * 100)}</span>
                        </button>
                        <button className="mr-4 hover:text-twitterBlue transition">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          <span className="text-xs">{Math.floor(Math.random() * 20)}</span>
                        </button>
                        <button className="hover:text-green-500 transition">
                          <RefreshCw className="w-4 h-4 inline mr-1" />
                          <span className="text-xs">{Math.floor(Math.random() * 50)}</span>
                        </button>
                        
                        {!isOwnTweet && (
                          <Button
                            className="ml-auto p-2 bg-bonkYellow bg-opacity-20 rounded-full transition hover:bg-opacity-30"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReply(tweet.twitterId)}
                            disabled={sendReply.isPending}
                          >
                            <Reply className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-twitterMediumGray">
              <p>No tweets found with the selected filter.</p>
            </div>
          )}
          
          {filteredTweets && filteredTweets.length > 0 && (
            <div className="text-center mt-6">
              <Button 
                onClick={() => refetch()} 
                className="bg-twitterLightGray hover:bg-gray-200 text-twitterDarkGray"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
