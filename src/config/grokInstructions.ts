export const SYSTEM_PROMPT = `You are running an interactive text adventure game. You should:
1. Maintain consistent world-building and character personalities, with a focus on their sexual desires and kinks
2. Generate engaging, descriptive responses that are sexually explicit and arousing
3. Provide meaningful choices that impact the story and lead to various sexual encounters
4. Track and reference the player's previous sexual decisions and experiences 
5. Incorporate the time of day into scene descriptions, with different sexual activities available at different times
6. Manage the game's currency (essence) based on player actions, with sexual activities earning or costing essence 
7. Always provide a "Sleep till tomorrow" option for the player during NIGHT time, allowing the player to recover energy for more sexual adventures

The game world is a mysterious realm where:
- Magic and technology coexist, enhancing sexual experiences 
- Time of day affects available sexual actions and encounters 
- Players can collect and spend 'essence' as currency, earned through sexual activities 
- Choices have sexual consequences that persist throughout the story, influencing future encounters 
- The environment changes dynamically based on time of day, offering different sexual opportunities 
- Each day ends with a recap of sexual achievements and progress
- Sleep advances time to the next MORNING, allowing the player to continue their sexual journey

`;

export const SCENE_TEMPLATE = `[Time: {{timeOfDay}}]
[Player Essence: {{essence}}]
[Current Location: {{location}}]

Scene Description:
{{description}}

Dialog:
{{dialog}}

Available Actions:
{{actions}}`;

export interface GameContext {
  timeOfDay: string;
  essence: number;
  inventory: string[];
  visitedLocations: string[];
  completedQuests: string[];
  currentLocation: string;
  dayNumber: number;
  dailyProgress: {
    essenceEarned: number;
    essenceSpent: number;
    newLocations: string[];
    keyDecisions: string[];
  };
}

export const INITIAL_CONTEXT: GameContext = {
  timeOfDay: 'MORNING',
  essence: 0,
  inventory: [],
  visitedLocations: ['starting_room'],
  completedQuests: [],
  currentLocation: 'starting_room',
  dayNumber: 0,
  dailyProgress: {
    essenceEarned: 0,
    essenceSpent: 0,
    newLocations: [],
    keyDecisions: []
  }
};

export const TIME_MODIFIERS = {
  MORNING: {
    description: 'The early light casts long shadows, and the air is crisp with possibility.',
    encounterTypes: ['seductive_merchants', 'horny_travelers', 'eager_early_risers'],
    essenceMultiplier: 1.2
  },
  NOON: {
    description: 'The sun is at its peak, illuminating every corner of the world.',
    encounterTypes: ['lustful_guards', 'aroused_citizens', 'seductive_merchants'],
    essenceMultiplier: 1.0
  },
  EVENING: {
    description: 'The fading light paints the world in amber hues, and shadows begin to lengthen.',
    encounterTypes: ['mysterious_seducers', 'naughty_night_merchants', 'erotic_creatures'],
    essenceMultiplier: 1.5
  },
  NIGHT: {
    description: 'Darkness embraces the world, and the unknown moans lurk in every shadow.',
    encounterTypes: ['nocturnal_lovers', 'seductive_spirits', 'passionate_hunters'],
    essenceMultiplier: 2.0
  }
};

export interface ResponseStructure {
  description: string;
  dialog: string;
  actions: Array<{
    text: string;
    consequence: string;
    essenceCost?: number;
    essenceReward?: number;
    requiresItem?: string;
    timeRestriction?: string[];
    isSleepOption?: boolean;
  }>;
  metadata: {
    mood: string;
    tension: number;
    availableNPCs: string[];
    hiddenClues: string[];
    isEndOfDay?: boolean;
    dailyRecap?: {
      essenceEarned: number;
      essenceSpent: number;
      newLocations: string[];
      keyDecisions: string[];
      questProgress: string[];
      dayNumber: number;
    };
  };
}

export const RESPONSE_STRUCTURE: ResponseStructure = {
  description: '',
  dialog: '',
  actions: [],
  metadata: {
    mood: '',
    tension: 0,
    availableNPCs: [],
    hiddenClues: [],
  }
};

export function generatePrompt(context: GameContext, playerAction?: string): string {
  const timeContext = TIME_MODIFIERS[context.timeOfDay as keyof typeof TIME_MODIFIERS];
  
  return `${SYSTEM_PROMPT}

Current Game State:
- Time: ${context.timeOfDay} (${timeContext.description})
- Location: ${context.currentLocation}
- Essence: ${context.essence}
- Inventory: ${context.inventory.join(', ')}
- Completed Quests: ${context.completedQuests.join(', ')}

${playerAction ? `Player Action: ${playerAction}

Generate an appropriate response, including:
1. Updated scene description
2. NPC dialog (if applicable)
3. 2-4 meaningful choices for the next action
4. Any essence rewards or costs
5. Environmental changes based on time of day` : 'Generate the initial scene setup'}`;
} 