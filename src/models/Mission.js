// Mission model
import { v4 as uuidv4 } from 'uuid';
import { addSeconds } from 'date-fns';

// Mission difficulties and their properties
const MISSION_DIFFICULTIES = {
  easy: {
    minDuration: 2 * 60, // 2 minutes
    maxDuration: 10 * 60, // 10 minutes
    minReward: 20,
    maxReward: 50,
    expReward: 10,
    recommendedLevel: 1,
    successChance: 0.9,
  },
  medium: {
    minDuration: 10 * 60, // 10 minutes
    maxDuration: 30 * 60, // 30 minutes
    minReward: 50,
    maxReward: 100,
    expReward: 25,
    recommendedLevel: 3,
    successChance: 0.7,
  },
  hard: {
    minDuration: 30 * 60, // 30 minutes
    maxDuration: 120 * 60, // 2 hours
    minReward: 100,
    maxReward: 300,
    expReward: 50,
    recommendedLevel: 5,
    successChance: 0.5,
  },
  epic: {
    minDuration: 180 * 60, // 3 hours
    maxDuration: 480 * 60, // 8 hours
    minReward: 300,
    maxReward: 800,
    expReward: 100,
    recommendedLevel: 8,
    successChance: 0.4,
  },
  legendary: {
    minDuration: 480 * 60, // 8 hours
    maxDuration: 720 * 60, // 12 hours
    minReward: 800,
    maxReward: 2000,
    expReward: 250,
    recommendedLevel: 12,
    successChance: 0.3,
  },
};

// Mission types with their descriptions
const MISSION_TYPES = [
  {
    name: 'Hunt',
    description: 'Hunt dangerous creatures threatening the area.',
    primaryStat: 'strength',
    secondaryStat: 'dexterity',
  },
  {
    name: 'Explore',
    description: 'Explore uncharted territories for valuable resources.',
    primaryStat: 'dexterity',
    secondaryStat: 'intelligence',
  },
  {
    name: 'Escort',
    description: 'Escort a merchant or important person safely to their destination.',
    primaryStat: 'constitution',
    secondaryStat: 'strength',
  },
  {
    name: 'Investigation',
    description: 'Investigate strange occurrences or solve a mystery.',
    primaryStat: 'intelligence',
    secondaryStat: 'luck',
  },
  {
    name: 'Artifact Recovery',
    description: 'Recover a valuable artifact from a dangerous location.',
    primaryStat: 'luck',
    secondaryStat: 'intelligence',
  },
  {
    name: 'Rescue',
    description: 'Rescue kidnapped villagers or trapped explorers.',
    primaryStat: 'strength',
    secondaryStat: 'constitution',
  },
  {
    name: 'Bounty',
    description: 'Track down and capture or eliminate a wanted criminal.',
    primaryStat: 'dexterity',
    secondaryStat: 'strength',
  },
  {
    name: 'Diplomacy',
    description: 'Resolve a dispute or negotiate an agreement between parties.',
    primaryStat: 'intelligence',
    secondaryStat: 'constitution',
  },
  {
    name: 'Gathering',
    description: 'Gather rare resources from dangerous locations.',
    primaryStat: 'luck',
    secondaryStat: 'dexterity',
  },
];

/**
 * Generate a mission with specified parameters or random ones
 */
export const generateMission = ({
  id = uuidv4(),
  name,
  description,
  type = MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)],
  difficulty = 'easy',
  duration,
  rewards = {},
  requiredStats = {},
  status = 'available', // available, active, completed, failed
  startTime = null,
  endTime = null,
  completionTime = null,
  assignedAdventurers = [],
  claimed = false,
  location = null,
} = {}) => {
  // Get difficulty settings or default to easy
  const difficultySettings = MISSION_DIFFICULTIES[difficulty] || MISSION_DIFFICULTIES.easy;
  
  // Generate random duration within difficulty range
  const missionDuration = duration || Math.floor(
    Math.random() * (difficultySettings.maxDuration - difficultySettings.minDuration) + 
    difficultySettings.minDuration
  );
  
  // Generate random gold reward within difficulty range
  const goldReward = Math.floor(
    Math.random() * (difficultySettings.maxReward - difficultySettings.minReward) + 
    difficultySettings.minReward
  );
  
  // Generate random material reward based on difficulty
  const materialReward = Math.floor(goldReward * 0.4);
  
  // Default rewards
  const missionRewards = {
    gold: goldReward,
    materials: materialReward,
    experience: difficultySettings.expReward,
    reputation: Math.floor(difficultySettings.expReward / 2),
    ...rewards
  };
  
  // Generate mission name if not provided
  const missionName = name || `${type.name}: ${type.description.split('.')[0]}`;
  
  // Generate mission description if not provided
  const missionDescription = description || type.description;
  
  // Build required stats based on type
  const missionRequiredStats = requiredStats || {
    [type.primaryStat]: difficultySettings.recommendedLevel * 2,
    [type.secondaryStat]: difficultySettings.recommendedLevel
  };

  // Generate random location if not provided
  const locations = [
    'Dark Forest', 'Ancient Ruins', 'Mountain Pass', 'Underground Caverns',
    'Misty Valley', 'Abandoned Castle', 'Coastal Cliffs', 'Desert Outpost',
    'Enchanted Woods', 'Frozen Tundra', 'Volcanic Crater', 'Haunted Village'
  ];
  const missionLocation = location || locations[Math.floor(Math.random() * locations.length)];
  
  return {
    id,
    name: missionName,
    description: missionDescription,
    type: type.name,
    difficulty,
    duration: missionDuration,
    rewards: missionRewards,
    requiredStats: missionRequiredStats,
    successChance: difficultySettings.successChance,
    recommendedLevel: difficultySettings.recommendedLevel,
    status,
    startTime,
    endTime,
    completionTime,
    assignedAdventurers,
    claimed,
    location: missionLocation
  };
};

export const calculateMissionSuccess = (mission, adventurers, bonuses = {}) => {
  if (!mission || !adventurers || adventurers.length === 0) {
    return { success: false, bonusRewards: {} };
  }

  // Base success chance from mission difficulty
  let successChance = mission.successChance || 0.5;
  
  // Calculate total stats of adventurers
  const totalStats = adventurers.reduce((stats, adventurer) => {
    Object.entries(adventurer.stats).forEach(([stat, value]) => {
      stats[stat] = (stats[stat] || 0) + value;
    });
    return stats;
  }, {});
  
  // Check if required stats are met
  const statBonus = Object.entries(mission.requiredStats).reduce((bonus, [statName, requiredValue]) => {
    const statValue = totalStats[statName] || 0;
    return bonus + (statValue >= requiredValue ? 0.1 : -0.1);
  }, 0);
  
  // Adjust success chance based on stats
  successChance += statBonus;
  
  // Apply any external bonuses (from buildings, items, etc.)
  if (bonuses.successChance) {
    successChance += bonuses.successChance;
  }
  
  // Cap success chance between 0.1 and 0.95
  successChance = Math.max(0.1, Math.min(0.95, successChance));
  
  // Determine if mission is successful
  const roll = Math.random();
  const success = roll < successChance;
  
  // Calculate any bonus rewards
  const bonusRewards = {};
  if (success) {
    // For critical success (roll much lower than needed), add bonus rewards
    if (roll < successChance * 0.5) {
      Object.entries(mission.rewards).forEach(([rewardType, amount]) => {
        if (typeof amount === 'number') {
          bonusRewards[rewardType] = Math.floor(amount * 0.3); // 30% bonus
        }
      });
    }
  }
  
  return {
    success,
    successChance,
    roll,
    bonusRewards,
    criticalSuccess: Object.keys(bonusRewards).length > 0
  };
};

export default {
  generateMission,
  calculateMissionSuccess,
  MISSION_DIFFICULTIES,
  MISSION_TYPES
};