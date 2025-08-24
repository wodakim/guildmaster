// Building model
import { v4 as uuidv4 } from 'uuid';

// Building types and their base properties
const BUILDING_TYPES = {
  'Guild Hall': {
    description: 'The center of your guild operations.',
    baseEffects: { maxAdventurers: 3, maxMissions: 2, reputationBonus: 0 },
    baseCost: { gold: 0, materials: 0 }, // First level is free (starting building)
    upgradeMultiplier: 1.5,
    maxLevel: 10,
  },
  'Training Ground': {
    description: 'Train your adventurers to level up faster.',
    baseEffects: { experienceBonus: 0.1 }, // +10% experience gain
    baseCost: { gold: 100, materials: 50 },
    upgradeMultiplier: 1.5,
    maxLevel: 5,
  },
  'Tavern': {
    description: 'Attracts potential recruits to your guild.',
    baseEffects: { recruitCostReduction: 0.05 }, // -5% recruit cost
    baseCost: { gold: 150, materials: 75 },
    upgradeMultiplier: 1.6,
    maxLevel: 5,
  },
  'Blacksmith': {
    description: 'Craft and improve equipment for your adventurers.',
    baseEffects: { equipmentQuality: 0.15 }, // +15% equipment quality
    baseCost: { gold: 200, materials: 100 },
    upgradeMultiplier: 1.7,
    maxLevel: 5,
  },
  'Library': {
    description: 'Research new technologies and skills for your guild.',
    baseEffects: { researchSpeed: 0.2 }, // +20% research speed
    baseCost: { gold: 250, materials: 125 },
    upgradeMultiplier: 1.8,
    maxLevel: 5,
  },
  'Market': {
    description: 'Trade resources for better prices.',
    baseEffects: { tradeProfitBonus: 0.1 }, // +10% trade profit
    baseCost: { gold: 300, materials: 150 },
    upgradeMultiplier: 1.6,
    maxLevel: 5,
  },
  'Storage': {
    description: 'Increase your resource storage capacity.',
    baseEffects: { storageCapacity: 0.2 }, // +20% storage capacity
    baseCost: { gold: 200, materials: 150 },
    upgradeMultiplier: 1.4,
    maxLevel: 10,
  },
  'Mine': {
    description: 'Generates materials over time.',
    baseEffects: { materialGeneration: 0.2 }, // +0.2 materials per second
    baseCost: { gold: 400, materials: 100 },
    upgradeMultiplier: 1.7,
    maxLevel: 8,
  },
  'Bank': {
    description: 'Generates gold over time.',
    baseEffects: { goldGeneration: 0.4 }, // +0.4 gold per second
    baseCost: { gold: 500, materials: 250 },
    upgradeMultiplier: 1.8,
    maxLevel: 8,
  },
};

/**
 * Generate a building with specified parameters or default ones
 */
export const generateBuilding = ({
  id = uuidv4(),
  type = 'Guild Hall',
  level = 0, // 0 means not built yet
  description = null,
  effects = null,
  upgradeRequirements = null,
  maxLevel = null,
  unlocked = null,
  unlockRequirements = null,
} = {}) => {
  // Get building settings for the specified type
  const buildingSettings = BUILDING_TYPES[type] || BUILDING_TYPES['Guild Hall'];
  
  // Use provided values or defaults from settings
  const buildingDescription = description || buildingSettings.description;
  const buildingMaxLevel = maxLevel !== null ? maxLevel : buildingSettings.maxLevel;
  
  // Calculate effects based on level and type
  let buildingEffects = effects;
  if (!buildingEffects) {
    buildingEffects = {};
    Object.entries(buildingSettings.baseEffects).forEach(([key, baseValue]) => {
      buildingEffects[key] = level > 0 ? baseValue * level : 0;
    });
  }
  
  // Calculate upgrade requirements based on level and type
  let buildingUpgradeRequirements = upgradeRequirements;
  if (!buildingUpgradeRequirements) {
    const baseCost = buildingSettings.baseCost;
    const multiplier = buildingSettings.upgradeMultiplier;
    const levelMultiplier = level > 0 ? Math.pow(multiplier, level) : 1;
    
    buildingUpgradeRequirements = {
      gold: Math.floor(baseCost.gold * levelMultiplier),
      materials: Math.floor(baseCost.materials * levelMultiplier),
    };
  }
  
  // Determine if building is unlocked
  let buildingUnlocked = unlocked;
  if (buildingUnlocked === null) {
    buildingUnlocked = type === 'Guild Hall' || level > 0;
  }
  
  return {
    id,
    type,
    level,
    description: buildingDescription,
    effects: buildingEffects,
    upgradeRequirements: buildingUpgradeRequirements,
    maxLevel: buildingMaxLevel,
    unlocked: buildingUnlocked,
    unlockRequirements: unlockRequirements || {},
  };
};

export const calculateBuildingEffects = (buildings = []) => {
  const effects = {
    maxAdventurers: 0,
    maxMissions: 0,
    reputationBonus: 0,
    experienceBonus: 0,
    recruitCostReduction: 0,
    equipmentQuality: 0,
    researchSpeed: 0,
    tradeProfitBonus: 0,
    storageCapacity: 0,
    materialGeneration: 0,
    goldGeneration: 0,
  };
  
  // Sum up all building effects
  buildings.forEach(building => {
    if (building.level > 0 && building.effects) {
      Object.entries(building.effects).forEach(([effect, value]) => {
        if (effects[effect] !== undefined) {
          effects[effect] += value;
        } else {
          effects[effect] = value;
        }
      });
    }
  });
  
  return effects;
};

export default {
  generateBuilding,
  calculateBuildingEffects,
  BUILDING_TYPES
};