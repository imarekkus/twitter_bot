import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SquarePen, Image, BarChart2, Smile, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getRandomDogPhrase, dogify } from "@/lib/dog-language";
import bonkDogLogo from "@/assets/bonk-dog-logo.svg";

export default function TweetComposer() {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  
  // Send tweet mutation
  const sendTweet = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', '/api/tweets', { content, twitterId: Date.now().toString(), type: 'manual' });
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/tweets'] });
      toast({
        title: "Tweet Sent",
        description: "Your tweet has been sent successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send tweet. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendTweet = () => {
    if (content.trim()) {
      sendTweet.mutate(content);
    } else {
      toast({
        title: "Empty Tweet",
        description: "Please enter some content for your tweet.",
        variant: "destructive",
      });
    }
  };

  const useQuickPhrase = (phrase: string) => {
    setContent(phrase);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <SquarePen className="w-5 h-5 text-twitterMediumGray mr-2" />
          Tweet as Bonk Dog
        </h2>
        <div className="flex items-start space-x-3 mb-4">
          <img 
            src={bonkDogLogo} 
            alt="Bonk Dog Avatar" 
            className="w-12 h-12 rounded-full border-2 border-bonkYellow"
          />
          <div className="flex-grow">
            <Textarea 
              placeholder="Woof! What's happening?" 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bonkYellow focus:border-transparent resize-none h-24 font-comic"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="text-twitterBlue hover:bg-blue-50 p-2 rounded-full transition">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-twitterBlue hover:bg-blue-50 p-2 rounded-full transition">
                  <BarChart2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-twitterBlue hover:bg-blue-50 p-2 rounded-full transition">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-twitterBlue hover:bg-blue-50 p-2 rounded-full transition">
                  <Calendar className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${content.length > 280 ? 'text-doggoRed' : 'text-twitterMediumGray'}`}>
                  {content.length}/280
                </span>
                <Button 
                  className="bg-twitterBlue hover:bg-blue-600 text-white" 
                  onClick={handleSendTweet}
                  disabled={content.length === 0 || content.length > 280 || sendTweet.isPending}
                >
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-sm mb-3">Quick Dog Phrases</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              className="bg-bonkYellow bg-opacity-20 hover:bg-opacity-30 text-twitterDarkGray px-3 py-1 rounded-full text-sm transition font-comic"
              variant="ghost"
              onClick={() => useQuickPhrase("Woof! Much $bonk!")}
            >
              Woof! Much $bonk!
            </Button>
            <Button 
              className="bg-bonkYellow bg-opacity-20 hover:bg-opacity-30 text-twitterDarkGray px-3 py-1 rounded-full text-sm transition font-comic"
              variant="ghost"
              onClick={() => useQuickPhrase("*ears perk up* bonk?")}
            >
              *ears perk up* bonk?
            </Button>
            <Button 
              className="bg-bonkYellow bg-opacity-20 hover:bg-opacity-30 text-twitterDarkGray px-3 py-1 rounded-full text-sm transition font-comic"
              variant="ghost"
              onClick={() => useQuickPhrase("*tail wags* heck yes!")}
            >
              *tail wags* heck yes!
            </Button>
            <Button 
              className="bg-bonkYellow bg-opacity-20 hover:bg-opacity-30 text-twitterDarkGray px-3 py-1 rounded-full text-sm transition font-comic"
              variant="ghost"
              onClick={() => useQuickPhrase("such amaze! very wow!")}
            >
              such amaze! very wow!
            </Button>
            <Button 
              className="bg-bonkYellow bg-opacity-20 hover:bg-opacity-30 text-twitterDarkGray px-3 py-1 rounded-full text-sm transition font-comic"
              variant="ghost"
              onClick={() => useQuickPhrase(dogify(getRandomDogPhrase()))}
            >
              Random Phrase
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
