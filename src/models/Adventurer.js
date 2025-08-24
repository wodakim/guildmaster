// Adventurer model
import { v4 as uuidv4 } from 'uuid';

// Available adventurer classes
const ADVENTURER_CLASSES = [
  'Warrior',
  'Mage',
  'Archer',
  'Rogue',
  'Cleric',
];

// Random name generators for different classes
const NAMES = {
  Warrior: [
    'Thorne', 'Garen', 'Darius', 'Valira', 'Krom',
    'Lyra', 'Brom', 'Sten', 'Olaf', 'Freya',
    'Alistair', 'Gareth', 'Leona', 'Ornn', 'Baldr',
  ],
  Mage: [
    'Merlin', 'Seraph', 'Lux', 'Ryze', 'Veigar',
    'Syndra', 'Morgana', 'Vex', 'Azrael', 'Elara',
    'Lydia', 'Kaelen', 'Thalia', 'Orion', 'Zephyr',
  ],
  Archer: [
    'Ashe', 'Robin', 'Varus', 'Artemis', 'Hawk',
    'Quinn', 'Kindred', 'Willow', 'Fletcher', 'Sylvan',
    'Thorne', 'Reed', 'Luna', 'Orion', 'Cora',
  ],
  Rogue: [
    'Zed', 'Kira', 'Talon', 'Raven', 'Shadow',
    'Echo', 'Vex', 'Drake', 'Jinx', 'Lark',
    'Wren', 'Vesper', 'Grey', 'Ash', 'Shade',
  ],
  Cleric: [
    'Sona', 'Mercy', 'Grace', 'Auriel', 'Lumen',
    'Seraph', 'Hope', 'Raiden', 'Kayle', 'Faith',
    'Lucius', 'Divine', 'Bennet', 'Soraka', 'Taric',
  ],
};

// Generate base stats for different classes
const BASE_STATS = {
  Warrior: { strength: 7, dexterity: 5, intelligence: 3, constitution: 8, luck: 4 },
  Mage: { strength: 3, dexterity: 5, intelligence: 10, constitution: 4, luck: 5 },
  Archer: { strength: 5, dexterity: 9, intelligence: 5, constitution: 5, luck: 6 },
  Rogue: { strength: 5, dexterity: 8, intelligence: 5, constitution: 4, luck: 7 },
  Cleric: { strength: 4, dexterity: 5, intelligence: 8, constitution: 6, luck: 5 },
};

// Equipment slots available to adventurers
const EQUIPMENT_SLOTS = [
  'weapon',
  'armor',
  'helmet',
  'accessory',
];

// Generate a random adventurer name based on class
const getRandomName = (classType) => {
  const names = NAMES[classType] || NAMES.Warrior;
  return names[Math.floor(Math.random() * names.length)];
};

/**
 * Generate a new adventurer with specified parameters or random ones
 */
export const generateAdventurer = ({
  id = uuidv4(),
  name,
  class: classType = ADVENTURER_CLASSES[Math.floor(Math.random() * ADVENTURER_CLASSES.length)],
  level = 1,
  experience = 0,
  experienceToNextLevel = 100,
  stats = null,
  equipment = {},
  skills = [],
  status = 'idle'  // idle, mission, training, etc.
} = {}) => {
  // Generate name if not provided
  const adventurerName = name || getRandomName(classType);
  
  // Get base stats for the class or use default warrior stats
  const baseStats = BASE_STATS[classType] || BASE_STATS.Warrior;
  
  // Use provided stats or generate based on class and level
  const adventurerStats = stats || {
    strength: baseStats.strength + Math.floor(Math.random() * 3),
    dexterity: baseStats.dexterity + Math.floor(Math.random() * 3),
    intelligence: baseStats.intelligence + Math.floor(Math.random() * 3),
    constitution: baseStats.constitution + Math.floor(Math.random() * 3),
    luck: baseStats.luck + Math.floor(Math.random() * 3)
  };
  
  // Apply level bonuses if level > 1
  if (level > 1) {
    for (let i = 1; i < level; i++) {
      switch (classType) {
        case 'Warrior':
          adventurerStats.strength += 2;
          adventurerStats.constitution += 2;
          adventurerStats.dexterity += 1;
          break;
        case 'Mage':
          adventurerStats.intelligence += 3;
          adventurerStats.constitution += 1;
          adventurerStats.luck += 1;
          break;
        case 'Archer':
          adventurerStats.dexterity += 3;
          adventurerStats.strength += 1;
          adventurerStats.luck += 1;
          break;
        case 'Rogue':
          adventurerStats.dexterity += 2;
          adventurerStats.luck += 2;
          adventurerStats.strength += 1;
          break;
        case 'Cleric':
          adventurerStats.intelligence += 2;
          adventurerStats.constitution += 2;
          adventurerStats.luck += 1;
          break;
        default:
          // Generic level up
          adventurerStats.strength += 1;
          adventurerStats.dexterity += 1;
          adventurerStats.intelligence += 1;
          adventurerStats.constitution += 1;
      }
    }
  }
  
  // Initialize empty equipment slots
  const defaultEquipment = {};
  EQUIPMENT_SLOTS.forEach(slot => {
    defaultEquipment[slot] = equipment[slot] || null;
  });
  
  return {
    id,
    name: adventurerName,
    class: classType,
    level,
    experience,
    experienceToNextLevel,
    stats: adventurerStats,
    equipment: defaultEquipment,
    skills: skills || [],
    status,
  };
};

export default {
  generateAdventurer,
  ADVENTURER_CLASSES,
  EQUIPMENT_SLOTS
};