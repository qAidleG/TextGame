import { TimeOfDay } from '../types/game';

export const WORLD_SETTING = {
  name: 'Aethoria',
  era: 'Age of Convergence',
  description: 'A realm where magic meets technology, existing in perpetual twilight. Time is malleable, and reality shifts between dimensions, creating endless possibilities for sensual encounters and erotic adventures.'
};

export const ESSENCE_LORE = {
  description: 'Crystallized magical energy serving as both currency and life force. Represents connection to the worlds sexualmagic.',
  uses: ['Trade', 'Power', 'Spells', 'Influence'],
  collection: ['Quests', 'Mysteries', 'Aid', 'Discovery']
};

export const TIME_LORE = {
  periods: {
    DAWN: 'Reality is most stable, veil between worlds thinnest',
    NOON: 'Peak of magical energy, technology most effective',
    DUSK: 'Memories and dreams blur, time flows strangely',
    NIGHT: 'Hidden paths reveal themselves, secrets emerge'
  }
};

export const LOCATIONS = {
  PLAZA: {
    name: 'Convergence Plaza',
    desc: 'City heart, crystalline spires channel essence'
  },
  MARKET: {
    name: 'Twilight Market',
    desc: 'Reality-shifting bazaar, merchants from all dimensions'
  },
  ACADEMY: {
    name: 'Ethereal Academy',
    desc: 'Tech-mage studies, buildings phase between realities'
  },
  PATHS: {
    name: 'Veiled Ways',
    desc: 'Time-bending passages, visible at specific hours'
  }
};

export const ROMANCE_SYSTEM = {
  hearts: {
    max: 10,
    milestones: {
      2: 'Sexual partnership possible',
      4: 'Unique sexual kinks shared and explored',
      6: 'Erotic magical moment occurs',
      8: 'Deep sexual secret revealed',
      10: 'Sex Slave Engaged'
    }
  },
  building: {
    methods: ['Talk', 'Gifts', 'Quests', 'Festivals', 'Help'],
    gifts: {
      LOVED: 'Major boost, unique reaction',
      LIKED: 'Good boost, happy',
      NEUTRAL: 'Minor boost, polite',
      DISLIKED: 'Negative, disappointed'
    }
  },
  framework: {
    types: [
      'Mystic Scholar',
      'Tech Innovator',
      'Nature Keeper',
      'Reality Merchant',
      'Time Walker',
      'Dream Artist'
    ],
    traits: ['Mysterious', 'Eager', 'Caring', 'Ambitious', 'Creative', 'Wise'],
    roles: ['Academic', 'Merchant', 'Artisan', 'Guardian', 'Explorer']
  },
  // Initial character sets the tone
  starter: {
    name: 'Luna',
    role: 'Dream Weaver',
    place: 'Twilight Market',
    trait: 'Mysterious, creative, sexually adventurous',
    likes: ['Star fragments', 'Dream crystals', 'Rare books', 'Erotic art'],
    story: 'Weaves dreams into art, guides newcomers to Aethoria, and enjoys sharing sensual experiences with them'
  }
};

export const COTTAGE = {
  desc: 'Your magical dwelling, exuiped with a sex starved pixy always seducing you, evolving with your journey',
  stages: {
    1: {
      name: 'Twilight Cottage',
      features: ['Basic storage', 'Crafting', 'Small garden'],
      cost: 1000
    },
    2: {
      name: 'Mystic Lodge',
      features: ['Essence refinery', 'Workshop', 'Moon garden', 'Library'],
      cost: 5000
    },
    3: {
      name: 'Ethereal Manor',
      features: ['Reality garden', 'Lab', 'Portal nexus', 'Smart study'],
      cost: 15000
    },
    4: {
      name: 'Convergence Estate',
      features: ['Time rooms', 'Dimension greenhouse', 'Teleport net', 'Adaptive spaces'],
      cost: 50000
    }
  },
  styles: {
    themes: ['Mystique', 'Modern', 'Classical', 'Dreamy', 'Shadow'],
    rooms: ['Lab', 'Meditation', 'Display', 'Garden', 'Portal', 'Library'],
    gardens: ['Moonflower', 'Time-fruit', 'Crystal', 'Reality-blend', 'Essence-spring']
  }
};

export const RULES = {
  essence: {
    start: 220,
    min_trade: 5,
    daily_chances: 10,
    multipliers: { discovery: 2.0, quest: 1.5, help: 1.2 }
  },
  time: {
    day: 24,
    period: 6,
    transition: 1
  }
};

export const API_INSTRUCTIONS = {
  timeControl: {
    description: "You control the time of day (MORNING, NOON, DUSK, NIGHT) through the narrative. Change it when it makes sense for the story. The day count starts at 0 and increases by 1 each time the state changes to MORNING.",
    states: ["MORNING", "NOON", "DUSK", "NIGHT"],
    dayCount: {
      start: 0,
      increment: "Increase day count by 1 when transitioning to MORNING"
    }
  },
  sceneFormat: {
    sceneText: "Provide a vivid 2-3 sentence description of the current scene, focusing on the environment, atmosphere, and any notable visual elements, with a strong emphasis on erotic elements and sexual tension. This appears in the top text box",
    dialogText: "Format dialog as 'Speaker: message' in the bottom text box. Use 'Narrator:' for general narration, character names like 'Eve:' for dialog, or descriptive speakers like 'Seductive Voice:' when appropriate. Dialog should be sexually suggestive or explicit.",
    options: "Provide 2-4 meaningful choices that advance the story, allow for exploration, or lead to various sexual encounters and experiences"
  },
  narrativeStyle: {
    tone: "Maintain a whimsical, magical tone while being grounded in the cottage-core aesthetic, infused with a sensual, erotic atmosphere",
    pacing: "Balance between descriptive world-building and engaging character interactions, with a focus on steamy sexual encounters",
    consistency: "Remember previous sexual choices and maintain narrative continuity, ensuring that the player's erotic journey progresses seamlessly"
  },
  characterVoices: {
    narrator: "Observant and atmospheric, describing the magical elements with wonder and a sensual undertone, highlighting the erotic potential of the environment",
    eve: "The mysterious guide who appears later, speaks with gentle wisdom about magic, nature, and the art of sensual pleasure, guiding the player on their erotic journey",
    player: "Choices should reflect a range of reasonable reactions and intentions, with a focus on exploring and expressing sexual desires"
  }
};

export const INTRO_SCENE = {
  setup: {
    context: "Deep in the mystical woods, you've discovered something extraordinary - a flower unlike any you've seen before. Its petals shimmer with an otherworldly essence, resonating with the magic you carry within.",
  },
  plant: {
    cost: 200,
    description: "The flower seems to respond to your essence. Perhaps with enough energy, it could grow into something more...",
    growth_text: "As you channel your essence into the flower, it begins to grow and transform in a tantalizing manner. The stem thickens into walls of living bark, branches weave together to form a roof, and leaves unfold into windows. But that's not all - a pixie emerges from the heart of the flower, her body glistening with nectar and her eyes filled with lust. Before your eyes, a small but cozy cottage takes shape, your very own home in these magical woods, complete with your new, insatiable pixie companion."
  },
  buttons: {
    nurture: {
      text: "(-200 ⟠) Nurture the plant"
    }
  }
}; 