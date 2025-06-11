import type { Interaction } from '../types/Interaction';
import { BASE_INTERACTION_POINTS } from '../types/Interaction';

export const initialInteractions: Interaction[] = [
  // === LUNA'S INTERACTIONS ===
  // Luna's basic chat interactions
  {
    type: 'chat',
    characterId: 'luna',
    text: "Hi there! Welcome to Café Mocha. I'm Luna, and I'll be happy to help you with any magical deliveries!",
    choices: [
      {
        text: "Nice to meet you! I'm excited to help with deliveries.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Luna seems happy about your enthusiasm!"
        }
      },
      {
        text: "The café smells wonderful. Do you make all these magical brews?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat + 1,
          description: "Luna lights up at your interest in her craft!",
          bonusPoints: {
            amount: 1,
            reason: "Showed interest in her specialty"
          }
        }
      }
    ]
  },

  // Morning-specific interaction
  {
    type: 'chat',
    characterId: 'luna',
    text: "The morning light makes the coffee beans sparkle with extra magic today!",
    requirements: {
      timeOfDay: ['morning'],
      locationId: 'cafe-mocha'
    },
    choices: [
      {
        text: "It's beautiful! No wonder your coffee is so special.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Luna appreciates your observation!"
        }
      }
    ]
  },

  // Friend-level interaction
  {
    type: 'help',
    characterId: 'luna',
    text: "I'm trying to perfect a new magical brew, but something's missing... Would you help me test some combinations?",
    requirements: {
      minRelationshipTier: 2,
      timeOfDay: ['morning', 'afternoon'],
      locationId: 'cafe-mocha'
    },
    choices: [
      {
        text: "I'd love to help! Let's find the perfect blend.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.help,
          description: "Luna is grateful for your help with her new creation!",
          bonusPoints: {
            amount: 2,
            reason: "Helping with a special project"
          }
        }
      }
    ]
  },

  // Special event - unlocks Mystic Market
  {
    type: 'special',
    characterId: 'luna',
    text: "You know, the Mystic Market has the freshest magical ingredients. I usually get my special coffee beans there. Maybe you'd like to check it out?",
    requirements: {
      minRelationshipTier: 1,
      timeOfDay: ['morning', 'afternoon'],
      locationId: 'cafe-mocha'
    },
    choices: [
      {
        text: "That sounds interesting! Could you tell me more about it?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.special,
          description: "Luna is excited to share her knowledge!",
          bonusPoints: {
            amount: 3,
            reason: "Showing interest in the magical community"
          }
        },
        unlockId: 'mystic-market'
      }
    ]
  },

  // Delivery-related interaction
  {
    type: 'delivery',
    characterId: 'luna',
    text: "These magical brews need to be delivered while they're still sparkling with energy. Think you can help?",
    choices: [
      {
        text: "Of course! I'll make sure they arrive in perfect condition.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.delivery,
          description: "Luna trusts you with her special deliveries!"
        }
      }
    ]
  },

  // === SAGE'S INTERACTIONS ===
  // Basic introduction
  {
    type: 'chat',
    characterId: 'sage',
    text: "Welcome to my humble stall. I'm Sage, purveyor of the finest magical herbs and ingredients.",
    choices: [
      {
        text: "Your herbs look amazing! How do you choose them?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat + 1,
          description: "Sage appreciates your interest in herbology!",
          bonusPoints: {
            amount: 1,
            reason: "Showing genuine interest in herb selection"
          }
        }
      },
      {
        text: "Nice to meet you! I'm helping with deliveries around town.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Sage nods approvingly at your work ethic."
        }
      }
    ]
  },

  // Market day specific
  {
    type: 'chat',
    characterId: 'sage',
    text: "Ah, the morning market air is filled with magical potential. These herbs are at their most potent right now.",
    requirements: {
      timeOfDay: ['morning'],
      locationId: 'mystic-market'
    },
    choices: [
      {
        text: "The scents are incredible! Each one tells a different story.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Sage is impressed by your sensitivity to magical herbs!"
        }
      }
    ]
  },

  // Friend-level interaction
  {
    type: 'help',
    characterId: 'sage',
    text: "I'm preparing a special batch of enhancement herbs for Luna's coffee. Would you like to learn the process?",
    requirements: {
      minRelationshipTier: 2,
      locationId: 'mystic-market'
    },
    choices: [
      {
        text: "I'd love to learn! It sounds fascinating.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.help,
          description: "Sage is pleased to share their knowledge!",
          bonusPoints: {
            amount: 2,
            reason: "Eager to learn traditional methods"
          }
        }
      }
    ]
  },

  // Special event - unlocks Spellbound Bakery
  {
    type: 'special',
    characterId: 'sage',
    text: "You know, Hazel at the Spellbound Bakery makes wonderful use of my herbs in her magical treats. Have you visited her yet?",
    requirements: {
      minRelationshipTier: 1,
      locationId: 'mystic-market'
    },
    choices: [
      {
        text: "No, but I'd love to try her magical baking!",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.special,
          description: "Sage is happy to connect you with fellow magical artisans!",
          bonusPoints: {
            amount: 3,
            reason: "Building community connections"
          }
        },
        unlockId: 'spellbound-bakery'
      }
    ]
  },

  // === HAZEL'S INTERACTIONS ===
  // Basic introduction
  {
    type: 'chat',
    characterId: 'hazel',
    text: "Welcome to Spellbound Bakery! *wipes flour off hands* I'm Hazel, and everything here is baked with a touch of magic!",
    choices: [
      {
        text: "It smells heavenly in here! What's your favorite thing to bake?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat + 1,
          description: "Hazel beams at your enthusiasm!",
          bonusPoints: {
            amount: 1,
            reason: "Showing interest in magical baking"
          }
        }
      },
      {
        text: "Nice to meet you! I'm the new delivery witch in town.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Hazel welcomes you warmly."
        }
      }
    ]
  },

  // Morning baking
  {
    type: 'chat',
    characterId: 'hazel',
    text: "There's nothing quite like the smell of magical bread baking in the morning! Want to see what's fresh out of the oven?",
    requirements: {
      timeOfDay: ['morning'],
      locationId: 'spellbound-bakery'
    },
    choices: [
      {
        text: "Yes please! Everything looks so magical and delicious!",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Hazel happily shows you her morning's work!"
        }
      }
    ]
  },

  // Friend-level interaction
  {
    type: 'help',
    characterId: 'hazel',
    text: "I'm experimenting with a new enchanted cookie recipe. Would you like to be my taste-tester?",
    requirements: {
      minRelationshipTier: 2,
      locationId: 'spellbound-bakery'
    },
    choices: [
      {
        text: "I'd be honored! What magical effects should I watch for?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.help,
          description: "Hazel is thrilled to have an enthusiastic taste-tester!",
          bonusPoints: {
            amount: 2,
            reason: "Helping with recipe development"
          }
        }
      }
    ]
  },

  // Special event - unlocks Grimoire Library
  {
    type: 'special',
    characterId: 'hazel',
    text: "You know, I learned most of my magical baking from old recipe books at the Grimoire Library. Minerva's always been so helpful with finding the right texts.",
    requirements: {
      minRelationshipTier: 1,
      locationId: 'spellbound-bakery'
    },
    choices: [
      {
        text: "A library of magical books? That sounds amazing!",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.special,
          description: "Hazel is excited to share her love of magical knowledge!",
          bonusPoints: {
            amount: 3,
            reason: "Enthusiasm for magical learning"
          }
        },
        unlockId: 'grimoire-library'
      }
    ]
  },

  // === MINERVA'S INTERACTIONS ===
  // Basic introduction
  {
    type: 'chat',
    characterId: 'minerva',
    text: "*adjusts glasses* Welcome to the Grimoire Library. I'm Minerva, the head librarian. Please keep your voice down, some of the books are quite sensitive to loud noises.",
    choices: [
      {
        text: "*whispers* Thank you! I'd love to learn about magical literature.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat + 1,
          description: "Minerva appreciates your respectful approach!",
          bonusPoints: {
            amount: 1,
            reason: "Showing proper library etiquette"
          }
        }
      },
      {
        text: "*quietly* Nice to meet you. I'm helping with deliveries around town.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Minerva acknowledges you with a gentle nod."
        }
      }
    ]
  },

  // Quiet afternoon study
  {
    type: 'chat',
    characterId: 'minerva',
    text: "The afternoon light is perfect for studying ancient texts. The magical ink becomes more legible at this hour.",
    requirements: {
      timeOfDay: ['afternoon'],
      locationId: 'grimoire-library'
    },
    choices: [
      {
        text: "That's fascinating! How does the magical ink work?",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.chat,
          description: "Minerva is pleased by your scholarly interest!"
        }
      }
    ]
  },

  // Friend-level interaction
  {
    type: 'help',
    characterId: 'minerva',
    text: "I'm cataloging a new collection of magical transportation scrolls. Would you care to assist? Your practical experience could be valuable.",
    requirements: {
      minRelationshipTier: 2,
      locationId: 'grimoire-library'
    },
    choices: [
      {
        text: "I'd love to help! Maybe I'll learn some new delivery techniques.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.help,
          description: "Minerva values your practical insights!",
          bonusPoints: {
            amount: 2,
            reason: "Contributing to magical research"
          }
        }
      }
    ]
  },

  // Special research project
  {
    type: 'special',
    characterId: 'minerva',
    text: "I've been researching ancient delivery methods used by witch couriers. Would you be interested in helping me test some theories?",
    requirements: {
      minRelationshipTier: 3,
      timeOfDay: ['afternoon', 'evening'],
      locationId: 'grimoire-library'
    },
    choices: [
      {
        text: "That sounds incredible! I'd love to learn from historical methods.",
        reward: {
          relationshipPoints: BASE_INTERACTION_POINTS.special,
          description: "Minerva is excited to have a research partner!",
          bonusPoints: {
            amount: 4,
            reason: "Advancing magical delivery knowledge"
          }
        }
      }
    ]
  }
]; 