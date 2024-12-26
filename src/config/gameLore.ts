import { TimeOfDay } from '../types/game';

export const WORLD_SETTING = {
  name: 'Aethoria',
  era: 'Age of Convergence',
  description: 'A realm where magic meets technology, existing in perpetual twilight. Time is malleable, and reality shifts between dimensions.'
};

export const ESSENCE_LORE = {
  description: 'Crystallized magical energy serving as both currency and life force. Represents connection to the world\'s magic.',
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
      2: 'Personal stories shared',
      4: 'Unique preferences revealed',
      6: 'Magical moment occurs',
      8: 'Deep secret revealed',
      10: 'Partnership possible'
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
    trait: 'Mysterious, creative',
    likes: ['Star fragments', 'Dream crystals', 'Rare books'],
    story: 'Weaves dreams into art, guides newcomers to Aethoria'
  }
};

export const COTTAGE = {
  desc: 'Your magical dwelling, evolving with your journey',
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
  },
  progress: {
    ranks: ['Initiate', 'Seeker', 'Adept', 'Master', 'Sage'],
    unlocks: {
      SEEKER: 'First major quest',
      ADEPT: 'Master essence',
      MASTER: 'All districts',
      SAGE: 'All secrets'
    }
  },
  relations: {
    daily_talks: 3,
    gift_cooldown: '24h',
    points: {
      talk: 10,
      loved_gift: 100,
      liked_gift: 50,
      quest: 150
    },
    decay: {
      daily: -2,
      birthday_miss: -50,
      bad_gift: -30
    }
  },
  upgrades: {
    reqs: {
      2: 'Seeker rank, first relationship milestone',
      3: 'Master essence, one 8-heart bond',
      4: 'All district quests, one 10-heart bond'
    },
    essence_gen: {
      1: 5,
      2: 15,
      3: 40,
      4: 100
    }
  }
};

export const API_INSTRUCTIONS = {
  timeControl: {
    description: "You control the time of day (MORNING, NOON, DUSK, NIGHT) through the narrative. Change it when it makes sense for the story.",
    states: ["MORNING", "NOON", "DUSK", "NIGHT"]
  },
  sceneFormat: {
    sceneText: "Provide a vivid 2-3 sentence description of the current scene, focusing on the environment, atmosphere, and any notable visual elements. This appears in the top text box.",
    dialogText: "Format dialog as 'Speaker: message' in the bottom text box. Use 'Narrator:' for general narration, character names like 'Eve:' for dialog, or descriptive speakers like 'Mysterious Voice:' when appropriate.",
    options: "Provide 2-4 meaningful choices that advance the story or allow for exploration"
  },
  narrativeStyle: {
    tone: "Maintain a whimsical, magical tone while being grounded in the cottage-core aesthetic",
    pacing: "Balance between descriptive world-building and engaging character interactions",
    consistency: "Remember previous choices and maintain narrative continuity"
  },
  characterVoices: {
    narrator: "Observant and atmospheric, describing the magical elements with wonder",
    eve: "The mysterious guide who appears later, speaks with gentle wisdom about magic and nature",
    player: "Choices should reflect a range of reasonable reactions and intentions"
  }
};

export const INTRO_SCENE = {
  setup: {
    context: "Deep in the mystical woods, you've discovered something extraordinary - a flower unlike any you've seen before. Its petals shimmer with an otherworldly essence, resonating with the magic you carry within.",
  },
  plant: {
    cost: 200,
    description: "The flower seems to respond to your essence. Perhaps with enough energy, it could grow into something more...",
    growth_text: "As you channel your essence into the flower, it begins to grow and transform. The stem thickens into walls of living bark, branches weave together to form a roof, and leaves unfold into windows. Before your eyes, a small but cozy cottage takes shape, your very own home in these magical woods."
  },
  buttons: {
    nurture: {
      text: "(-200 ⟠) Nurture the plant"
    }
  }
}; 