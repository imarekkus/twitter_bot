export class DogLanguageService {
  private dogWords: string[] = [
    'woof', 'bark', 'bork', 'howl', 'arf', 'ruff', 'yip', 'awoo'
  ];
  
  private dogPhrases: string[] = [
    '*wags tail*', 
    '*tilts head*', 
    '*perks ears*', 
    '*sniffs*', 
    '*zooms around*', 
    '*does a bork*',
    '*paws at you*',
    '*drops tennis ball*'
  ];
  
  private dogModifiers: string[] = [
    'much', 'very', 'so', 'such', 'many', 'wow', 'amaze', 'excite'
  ];
  
  private bonkReactions: string[] = [
    'bonk to the moon!',
    'much bonk! very coin!',
    'bonk is doin me a happy!',
    'bonk coin best coin!',
    'woof for bonk!',
    'me loves the bonk!'
  ];

  constructor() {}

  // Generate dog language response by filling in variables in a template
  generateResponse(template: string, variables: Record<string, string>): string {
    let response = template;
    
    // Replace all variables in the template
    for (const [key, value] of Object.entries(variables)) {
      response = response.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    // Add some randomization to make responses more unique
    if (Math.random() > 0.5) {
      response += ` ${this.getRandomBonkReaction()}`;
    }
    
    if (Math.random() > 0.7) {
      response += ` ${this.getRandomDogWord()}!`;
    }
    
    return response;
  }

  // Generate a random dog sentence from scratch (for variety)
  generateRandomDogSentence(topic: string = 'bonk'): string {
    const phrases = [
      `*${this.getRandomDogAction()}* ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogWord()}!`,
      `${this.getRandomDogPhrase()} ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogModifier()} wow!`,
      `heck! ${this.getRandomDogModifier()} ${topic}! ${this.getRandomDogPhrase()} ${this.getRandomDogWord()}!`,
      `${this.getRandomDogWord()}! ${topic} doin me a ${this.getRandomDogEmotion()}! ${this.getRandomDogPhrase()}`
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
      'perks ears'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private getRandomDogEmotion(): string {
    const emotions = [
      'happy', 'excite', 'bamboozle', 'concern', 'confuse', 'amaze', 'impress', 'curious'
    ];
    return emotions[Math.floor(Math.random() * emotions.length)];
  }
}
