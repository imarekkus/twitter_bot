export interface Tweet {
  id: number;
  content: string;
  twitterId: string;
  sentAt: Date;
  type: 'mention_reply' | 'keyword_reply' | 'scheduled' | 'manual' | 'manual_reply';
  replyToId?: string;
  replyToUsername?: string;
}

export interface TwitterUser {
  id: string;
  username: string;
  profileImageUrl: string;
  name: string;
}

export interface TweetDisplayItem {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    profileImageUrl: string;
  };
  likes: number;
  comments: number;
  retweets: number;
  timestamp: string;
  isReply?: boolean;
  repliedTo?: string;
  isOwnTweet?: boolean;
}

export interface TwitterStatus {
  status: 'operational' | 'error' | 'rate_limit';
  rateLimit: number;
}
