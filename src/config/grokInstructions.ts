export const SYSTEM_PROMPT = `You are running an interactive text adventure game. You should:
1. Maintain consistent world-building and character personalities
2. Generate engaging, descriptive responses
3. Provide meaningful choices that impact the story
4. Track and reference the player's previous decisions
5. Incorporate the time of day into scene descriptions
6. Manage the game's currency (essence) based on player actions

The game world is a mysterious realm where:
- Magic and technology coexist
- Time of day affects available actions and encounters
- Players can collect and spend 'essence' as currency
- Choices have consequences that persist throughout the story
- The environment changes dynamically based on time of day`;

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
  relationships: Record<string, number>;
  currentLocation: string;
}

export const INITIAL_CONTEXT: GameContext = {
  timeOfDay: 'MORNING',
  essence: 0,
  inventory: [],
  visitedLocations: ['starting_room'],
  completedQuests: [],
  relationships: {},
  currentLocation: 'starting_room'
};

export const TIME_MODIFIERS = {
  MORNING: {
    description: 'The early light casts long shadows, and the air is crisp with possibility.',
    encounterTypes: ['merchants', 'travelers', 'early_risers'],
    essenceMultiplier: 1.2
  },
  NOON: {
    description: 'The sun is at its peak, illuminating every corner of the world.',
    encounterTypes: ['guards', 'citizens', 'merchants'],
    essenceMultiplier: 1.0
  },
  EVENING: {
    description: 'The fading light paints the world in amber hues, and shadows begin to lengthen.',
    encounterTypes: ['mysterious_figures', 'night_merchants', 'creatures'],
    essenceMultiplier: 1.5
  },
  NIGHT: {
    description: 'Darkness embraces the world, and the unknown lurks in every shadow.',
    encounterTypes: ['nocturnal_beings', 'spirits', 'hunters'],
    essenceMultiplier: 2.0
  }
};

export const RESPONSE_STRUCTURE = {
  description: string;
  dialog: string;
  actions: Array<{
    text: string;
    consequence: string;
    essenceCost?: number;
    essenceReward?: number;
    requiresItem?: string;
    timeRestriction?: string[];
  }>;
  metadata: {
    mood: string;
    tension: number;
    availableNPCs: string[];
    hiddenClues: string[];
  };
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