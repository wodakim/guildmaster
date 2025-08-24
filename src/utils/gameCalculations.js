// Game calculation utilities
import { differenceInSeconds } from 'date-fns';
import { calculateResourceGeneration } from '../models/Resource';
import { calculateMissionSuccess } from '../models/Mission';

/**
 * Calculate offline progression when a player returns after being away
 * @param {Number} secondsElapsed - Time elapsed since last save
 * @param {Object} resources - Current resources state
 * @param {Array} buildings - Current buildings
 * @param {Array} missions - Active missions
 */
export const calculateOfflineProgress = (secondsElapsed, resources, buildings, missions) => {
  // Cap offline progression time
  const maxOfflineSeconds = 60 * 60 * 24; // 24 hours
  const cappedSeconds = Math.min(secondsElapsed, maxOfflineSeconds);
  
  // Calculate resource generation during offline time
  const generationRates = calculateResourceGeneration(resources, buildings);
  
  // Generate resources based on elapsed time
  Object.entries(generationRates).forEach(([resourceType, rate]) => {
    if (resources[resourceType] !== undefined) {
      const amount = rate * cappedSeconds;
      const maxAmount = resources.capacity[resourceType] || Infinity;
      resources[resourceType] = Math.min(resources[resourceType] + amount, maxAmount);
    }
  });
  
  // Process missions that would have completed during offline time
  const now = new Date();
  missions.forEach(mission => {
    if (mission.status === 'active' && mission.endTime) {
      const endTime = new Date(mission.endTime);
      if (endTime <= now) {
        // Mission completed while offline
        mission.status = 'ready';
        mission.completionTime = endTime.toISOString();
      }
    }
  });
  
  return {
    secondsElapsed: cappedSeconds,
    resourcesGenerated: Object.entries(generationRates).reduce((acc, [type, rate]) => {
      acc[type] = rate * cappedSeconds;
      return acc;
    }, {}),
    missionsCompleted: missions.filter(m => m.status === 'ready').length,
  };
};

/**
 * Calculate success chance for a mission based on adventurers' stats
 * @param {Object} mission - Mission object
 * @param {Array} adventurers - Array of adventurer objects assigned to mission
 * @param {Object} bonuses - Any additional bonuses to apply
 * @returns {Object} Success chance and details
 */
export const calculateMissionSuccessChance = (mission, adventurers, bonuses = {}) => {
  if (!mission || !adventurers || adventurers.length === 0) {
    return { chance: 0, details: { baseChance: 0, statBonus: 0, levelBonus: 0 } };
  }
  
  // Base success chance from mission difficulty
  let baseChance = mission.successChance || 0.5;
  
  // Calculate total stats of adventurers
  const totalStats = adventurers.reduce((stats, adventurer) => {
    Object.entries(adventurer.stats).forEach(([stat, value]) => {
      stats[stat] = (stats[stat] || 0) + value;
    });
    return stats;
  }, {});
  
  // Calculate stat bonus
  let statBonus = 0;
  Object.entries(mission.requiredStats || {}).forEach(([statName, requiredValue]) => {
    const statValue = totalStats[statName] || 0;
    const ratio = statValue / requiredValue;
    
    if (ratio >= 1.5) {
      statBonus += 0.15; // Greatly exceeds requirements
    } else if (ratio >= 1.0) {
      statBonus += 0.1; // Meets requirements
    } else if (ratio >= 0.75) {
      statBonus += 0; // Close to requirements
    } else {
      statBonus -= 0.1; // Far below requirements
    }
  });
  
  // Calculate level bonus
  const avgLevel = adventurers.reduce((sum, adv) => sum + adv.level, 0) / adventurers.length;
  const recommendedLevel = mission.recommendedLevel || 1;
  let levelBonus = 0;
  
  if (avgLevel >= recommendedLevel * 1.5) {
    levelBonus = 0.15; // Far above recommended level
  } else if (avgLevel >= recommendedLevel) {
    levelBonus = 0.1; // At or above recommended level
  } else if (avgLevel >= recommendedLevel * 0.75) {
    levelBonus = 0; // Close to recommended level
  } else {
    levelBonus = -0.1; // Far below recommended level
  }
  
  // Apply any external bonuses
  const totalBonus = statBonus + levelBonus + (bonuses.missionSuccess || 0);
  
  // Calculate final success chance
  let chance = baseChance + totalBonus;
  
  // Cap success chance between 0.05 and 0.95
  chance = Math.max(0.05, Math.min(0.95, chance));
  
  return {
    chance,
    details: {
      baseChance,
      statBonus,
      levelBonus,
      externalBonus: bonuses.missionSuccess || 0,
    }
  };
};

/**
 * Calculate the total cost and time to upgrade a building
 * @param {Object} building - Building to upgrade
 * @param {Object} modifiers - Cost and time modifiers
 * @returns {Object} Cost and time information
 */
export const calculateBuildingUpgrade = (building, modifiers = {}) => {
  if (!building || building.level >= building.maxLevel) {
    return null;
  }
  
  const baseCost = building.upgradeRequirements || { gold: 100, materials: 50 };
  
  // Apply cost reduction modifiers
  const costMultiplier = 1 - (modifiers.buildingCostReduction || 0);
  const cost = {
    gold: Math.max(1, Math.floor(baseCost.gold * costMultiplier)),
    materials: Math.max(1, Math.floor(baseCost.materials * costMultiplier)),
  };
  
  // Calculate upgrade time based on level (higher levels take longer)
  const baseTime = 60 + (building.level * 60); // 1 minute base + 1 minute per level
  const timeMultiplier = 1 - (modifiers.buildingTimeReduction || 0);
  const time = Math.max(10, Math.floor(baseTime * timeMultiplier)); // Minimum 10 seconds
  
  return { cost, time };
};

/**
 * Calculate experience needed for an adventurer to level up
 * @param {Object} adventurer - Adventurer object
 * @returns {Object} Experience information
 */
export const calculateExperienceProgress = (adventurer) => {
  if (!adventurer) {
    return { current: 0, required: 100, percentage: 0 };
  }
  
  const current = adventurer.experience || 0;
  const required = adventurer.experienceToNextLevel || 100;
  const percentage = Math.min(100, Math.floor((current / required) * 100));
  const remaining = Math.max(0, required - current);
  
  return { current, required, percentage, remaining };
};

export default {
  calculateOfflineProgress,
  calculateMissionSuccessChance,
  calculateBuildingUpgrade,
  calculateExperienceProgress
};