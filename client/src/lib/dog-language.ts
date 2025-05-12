// Helper functions for generating dog language content

const dogEmojis = ['🐶', '🐕', '🦮', '🦴', '🐾', '🐩', '🦝', '🌭'];

const dogPhrases = [
  'Woof! Much $bonk!',
  '*ears perk up* bonk?',
  '*tail wags* heck yes!',
  'such amaze! very wow!',
  '*excited bork* bonk bonk',
  '*sniffs curiously* what dis?',
  '*drops ball* throw the bonk!',
  'henlo fren! much happy!',
  'do a heckin bonk!',
  'much wow! so currency!',
];

// Get a random dog emoji
export function getRandomDogEmoji(): string {
  return dogEmojis[Math.floor(Math.random() * dogEmojis.length)];
}

// Get a random dog phrase
export function getRandomDogPhrase(): string {
  return dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
}

// Add random dog elements to make text more dog-like
export function dogify(text: string): string {
  const dogWords = ['woof', 'bork', 'heck', 'wow', 'much', 'very', 'such'];
  
  // Randomly add a dog word at the beginning
  if (Math.random() > 0.7) {
    const randomDogWord = dogWords[Math.floor(Math.random() * dogWords.length)];
    text = `${randomDogWord}! ${text}`;
  }
  
  // Randomly add a dog emoji at the end
  if (Math.random() > 0.6) {
    text = `${text} ${getRandomDogEmoji()}`;
  }
  
  // Randomly add dog actions
  const dogActions = ['*wags tail*', '*tilts head*', '*borks*', '*sniffs*'];
  if (Math.random() > 0.7) {
    const randomAction = dogActions[Math.floor(Math.random() * dogActions.length)];
    text = `${randomAction} ${text}`;
  }
  
  return text;
}

// Create a new bonk-focused dog tweet
export function generateBonkTweet(): string {
  const templates = [
    '*wags tail* $bonk just hit {{price}}! Much wow! Very bullish! {{emoji}}',
    'henlo frens! {{emoji}} $bonk is doin a heckin good day! {{price}} wow!',
    '*ears perk up* did someone say $bonk? much excite! price now {{price}}! {{emoji}}',
    'such amaze! many $bonk! price now {{price}} {{emoji}} very moon soon!',
    'bonk bonk! who want treats? $bonk is {{price}} today! {{emoji}} much value!',
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const price = (Math.random() * 0.00005).toFixed(8);
  const emoji = getRandomDogEmoji();
  
  return template
    .replace('{{price}}', `$${price}`)
    .replace('{{emoji}}', emoji);
}

// Format a timestamp to "now", "5m", "2h", etc.
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSec < 60) {
    return 'now';
  } else if (diffMin < 60) {
    return `${diffMin}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    return `${diffDays}d`;
  }
}
