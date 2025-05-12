export class DogLanguageService {
  private dogWords: string[] = [
    'woof', 'bark', 'bork', 'howl', 'arf', 'ruff', 'yip', 'awoo', 'boof', 
    'grr', 'awooo', 'woofwoof', 'barkbark', 'woooof', 'yap', 'yip-yip', 
    'arooo', 'bow-wow', 'grruff', 'huff', 'ruffff'
  ];
  
  private dogPhrases: string[] = [
    '*wags tail*', 
    '*tilts head*', 
    '*perks ears*', 
    '*sniffs*', 
    '*zooms around*', 
    '*does a bork*',
    '*paws at you*',
    '*drops tennis ball*',
    '*spins in circles*',
    '*bounces up and down*',
    '*sploot*',
    '*licks screen*',
    '*rolls over*',
    '*tippy taps*',
    '*does a big stretch*',
    '*chases tail*',
    '*plays with toy*',
    '*begs for treats*',
    '*zoomies intensify*',
    '*brings favorite toy*',
    '*does a head tilt*',
    '*stares into your soul*',
    '*sits for treats*',
    '*gives paw*',
    '*does a play bow*'
  ];
  
  private dogModifiers: string[] = [
    'much', 'very', 'so', 'such', 'many', 'wow', 'amaze', 'excite', 'heck',
    'heckin', 'vvv', 'doin a', 'big', 'smol', 'henlo', 'fren', 'goodest',
    'bestest', 'mighty', 'super', 'ultra', 'mega', 'extreme', 'maximum',
    'total', 'complete', 'epic', 'legendary', 'ultimate', 'premium', 'fancy'
  ];
  
  private bonkReactions: string[] = [
    'bonk to the moon!',
    'much bonk! very coin!',
    'bonk is doin me a happy!',
    'bonk coin best coin!',
    'woof for bonk!',
    'me loves the bonk!',
    'bonk makes tail go wag wag wag!',
    'bonk coin go brrrrrr!',
    'who a good bonk? u r!',
    'bonk deserves all the treats!',
    'bonk makes me do a big smile!',
    'bonk doin me a financial freedom!',
    'bonk to infinity and beyond!',
    'bonk coin is best doge coin!',
    'me hodl bonk forever!',
    'bonk wallet much full!',
    'bonk is the goodest boi of coins!',
    'bonk community is my pack!',
    'bonk make wallet do a grow!',
    'bonk boops all other coins!'
  ];

  constructor() {}

  // Generate dog language response by filling in variables in a template
  generateResponse(template: string, variables: Record<string, string>): string {
    let response = template;
    
    // Replace all variables in the template
    for (const [key, value] of Object.entries(variables)) {
      response = response.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    // Add randomization to make responses more unique
    const randNum = Math.random();
    
    // 30% chance to add a dog phrase at the beginning
    if (randNum < 0.3) {
      response = `${this.getRandomDogPhrase()} ${response}`;
    }
    
    // 40% chance to add a bonk reaction
    if (Math.random() < 0.4) {
      response += ` ${this.getRandomBonkReaction()}`;
    }
    
    // 30% chance to add a dog word exclamation
    if (Math.random() < 0.3) {
      response += ` ${this.getRandomDogWord()}!`;
    }
    
    // 20% chance to add another dog phrase at the end
    if (Math.random() < 0.2) {
      response += ` ${this.getRandomDogPhrase()}`;
    }
    
    return response;
  }

  // Generate a random dog sentence from scratch (for variety)
  generateRandomDogSentence(topic: string = 'bonk'): string {
    const phrases = [
      // Standard patterns
      `*${this.getRandomDogAction()}* ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogWord()}!`,
      `${this.getRandomDogPhrase()} ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogModifier()} wow!`,
      `heck! ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`,
      `${this.getRandomDogWord()}! ${topic} doin me a ${this.getRandomDogEmotion()}! ${this.getRandomDogPhrase()}`,
      
      // New patterns with more variability
      `${topic} makes me go ${this.getRandomDogWord()} ${this.getRandomDogWord()}! ${this.getRandomDogModifier()} excited!`,
      `${this.getRandomDogPhrase()} when see ${topic}! ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}!`,
      `fren! have u seen ${this.getRandomDogModifier()} ${topic}? ${this.getRandomDogPhrase()} me ${this.getRandomDogEmotion()}!`,
      `*${this.getRandomDogAction()}* me thinks ${topic} is ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}!`,
      `henlo! ${topic} does a ${this.getRandomDogEmotion()} to my heart! ${this.getRandomDogPhrase()}`,
      `oh heck! ${topic} just did a ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}! ${this.getRandomDogWord()}!`,
      `${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}! can't even! ${this.getRandomDogWord()}!`,
      `me when ${topic} does the thing: ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`,
      `${this.getRandomDogPhrase()} is it treat time? ${this.getRandomDogModifier()} ${topic} treats?`,
      `${topic} frens are best frens! ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  private getRandomDogWord(): string {
    return this.dogWords[Math.floor(Math.random() * this.dogWords.length)];
  }

  private getRandomDogPhrase(): string {
    return this.dogPhrases[Math.floor(Math.random() * this.dogPhrases.length)];
  }

  private getRandomDogModifier(): string {
    return this.dogModifiers[Math.floor(Math.random() * this.dogModifiers.length)];
  }

  private getRandomBonkReaction(): string {
    return this.bonkReactions[Math.floor(Math.random() * this.bonkReactions.length)];
  }

  private getRandomDogAction(): string {
    const actions = [
      'wags tail frantically', 
      'spins in circles', 
      'zooms around', 
      'does a happy dance', 
      'gives paw', 
      'tilts head curiously',
      'plays with tennis ball',
      'perks ears',
      'does a big leap',
      'borks at notification',
      'sniffs screen',
      'rolls on back',
      'does a sneaky snoot boop',
      'makes grabby paws',
      'does a heckin bamboozle',
      'hides under blanket',
      'gets the zoomies',
      'tippy taps excitedly',
      'brings favorite toy',
      'shows belly for rubs',
      'does puppy eyes',
      'jumps for joy',
      'protects the bonk',
      'does a stretch',
      'borfs softly',
      'sits like good doggo',
      'shakes paw vigorously',
      'monches invisible treat',
      'howls with happiness',
      'flops dramatically',
      'nuzzles phone',
      'does big steppy',
      'wiggles whole body'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private getRandomDogEmotion(): string {
    const emotions = [
      'happy', 'excite', 'bamboozle', 'concern', 'confuse', 'amaze', 'impress', 'curious',
      'delightful', 'heckin good', 'proud', 'joyful', 'playful', 'bouncy', 'enthusiastic',
      'wiggly', 'snuggly', 'ecstatic', 'waggy', 'zoomy', 'goofy', 'silly', 'mischievous',
      'adoring', 'attentive', 'loyal', 'protective', 'snoozy', 'relaxed', 'content',
      'appreciative', 'admiring', 'hopeful', 'expectant', 'patient', 'eager'
    ];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }
  
  // Additional methods for even more variable responses
  
  generateBonkTweet(): string {
    // Create completely randomized bonk-focused tweets
    const templates = [
      // Price/Market focused
      `*${this.getRandomDogAction()}* ${this.getCryptoPositivePhrase()} bonk! ${this.getRandomDogWord()}!`,
      `${this.getRandomDogPhrase()} bonk just ${this.getCryptoActionPhrase()}! ${this.getRandomDogModifier()} bullish!`,
      `my bonk senses r tingling! ${this.getCryptoPositivePhrase()} bonk! ${this.getRandomDogPhrase()}`,
      
      // Community focused
      `bonk community is ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}! ${this.getRandomDogPhrase()}`,
      `henlo bonk frens! ${this.getRandomDogPhrase()} ${this.getCommunityPhrase()}`,
      `${this.getRandomDogWord()}! ${this.getRandomDogModifier()} day to be a bonk holder! ${this.getRandomDogPhrase()}`,
      
      // Meme/fun focused
      `${this.getRandomDogPhrase()} bonk memes make me go ${this.getRandomDogWord()} ${this.getRandomDogWord()}!`,
      `me thinks bonk needs more ${this.getRandomDogModifier()} memes! ${this.getRandomDogPhrase()}`,
      `bonk iz ${this.getRandomDogModifier()} fun! ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`,
      
      // Random thoughts
      `what if... bonk ${this.getCryptoSpeculationPhrase()}? ${this.getRandomDogPhrase()} would be ${this.getRandomDogModifier()} ${this.getRandomDogEmotion()}!`,
      `*${this.getRandomDogAction()}* dreaming of ${this.getRandomDogModifier()} bonk future! ${this.getRandomBonkReaction()}`,
      `bonkers news: bonk does a ${this.getCryptoActionPhrase()}! ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private getCryptoPositivePhrase(): string {
    const phrases = [
      'much gains for', 'very bullish on', 'hodling my', 'diamond paws on', 'to the moon with',
      'never selling my', 'stacking more', 'all in on', 'buying the dip on', 'feeling rich with',
      'mooning with', 'getting rich with', 'very profit from', 'much wealth from', 'making bank with',
      'chart looking good for', 'green candles for', 'stonks up for', 'very pump for'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  private getCryptoActionPhrase(): string {
    const actions = [
      'did a big pump', 'mooned', 'broke resistance', 'went viral', 'trending',
      'hit new ath', 'did a recovery', 'getting listed', 'gaining adoption',
      'getting more volume', 'making new partnerships', 'getting famous', 'gaining momentum',
      'getting more holders', 'found support', 'bouncing back', 'breaking out',
      'getting recognition', 'looking bullish', 'getting attention'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  
  private getCryptoSpeculationPhrase(): string {
    const speculations = [
      'hit $1', 'became top 10 coin', 'was accepted everywhere', 'replaced fiat',
      'partnered with big companies', 'went mainstream', 'was used for global payments',
      'was in every wallet', 'got celebrity endorsement', 'became worldwide currency',
      'was on every exchange', 'was taught in schools', 'had its own blockchain',
      'was accepted by governments', 'became meme of the year', 'had its own metaverse',
      'had its own NFTs', 'had its own debit card', 'became dogecoin competitor',
      'became solana gem', 'got its own exchange'
    ];
    return speculations[Math.floor(Math.random() * speculations.length)];
  }
  
  private getCommunityPhrase(): string {
    const phrases = [
      'bonk frens are best frens!', 'love our bonk community!', 'bonk army strong together!',
      'bonk hodlers unite!', 'bonk fam is growing!', 'so many new bonk frens!',
      'bonk community much supportive!', 'together we make bonk moon!', 'bonk holders r smart!',
      'proud to be bonk fren!', 'bonk pack growing stronger!', 'happy to see new bonk frens!',
      'bonk community is my pack!', 'bonking together is better!', 'bonk vibes r immaculate!'
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}
