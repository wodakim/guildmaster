// Resource model
/**
 * Resource types and their properties
 */
export const RESOURCE_TYPES = {
  gold: {
    name: 'Gold',
    description: 'The primary currency used for most transactions.',
    icon: 'coins',
    baseGeneration: 1, // 1 per second
    baseCapacity: 1000,
    capacityIncrease: 500, // Per building level
  },
  materials: {
    name: 'Materials',
    description: 'Raw resources used for building and upgrading.',
    icon: 'boxes',
    baseGeneration: 0.5, // 0.5 per second
    baseCapacity: 500,
    capacityIncrease: 300, // Per building level
  },
  reputation: {
    name: 'Reputation',
    description: 'Your guild\'s standing in the world, unlocks new opportunities.',
    icon: 'star',
    baseGeneration: 0, // Only gained through missions
    baseCapacity: Infinity, // No upper limit
    capacityIncrease: 0,
  },
  gems: {
    name: 'Gems',
    description: 'Premium currency for special purchases and speed-ups.',
    icon: 'gem',
    baseGeneration: 0, // Only gained through special events or purchases
    baseCapacity: Infinity, // No upper limit
    capacityIncrease: 0,
  }
};

/**
 * Calculate resource generation rates based on buildings and other modifiers
 */
export const calculateResourceGeneration = (resources, buildings, modifiers = {}) => {
  const rates = { ...resources.generationRates };
  
  // Apply building effects
  buildings.forEach(building => {
    if (building.level > 0 && building.effects) {
      if (building.effects.goldGeneration) {
        rates.gold = (rates.gold || 0) + building.effects.goldGeneration;
      }
      if (building.effects.materialGeneration) {
        rates.materials = (rates.materials || 0) + building.effects.materialGeneration;
      }
    }
  });
  
  // Apply external modifiers
  Object.entries(modifiers).forEach(([resource, modifier]) => {
    if (rates[resource] !== undefined) {
      rates[resource] *= 1 + modifier;
    }
  });
  
  return rates;
};

/**
 * Calculate resource capacities based on buildings and other modifiers
 */
export const calculateResourceCapacities = (resources, buildings, modifiers = {}) => {
  const capacities = { ...resources.capacity };
  let storageBonus = 0;
  
  // Calculate total storage bonus from buildings
  buildings.forEach(building => {
    if (building.level > 0 && building.effects && building.effects.storageCapacity) {
      storageBonus += building.effects.storageCapacity;
    }
  });
  
  // Apply storage bonus to capacities
  if (storageBonus > 0) {
    Object.keys(capacities).forEach(resource => {
      capacities[resource] = Math.floor(capacities[resource] * (1 + storageBonus));
    });
  }
  
  // Apply specific building effects (like resource-specific capacity increases)
  buildings.forEach(building => {
    if (building.level > 0 && building.effects) {
      Object.entries(building.effects).forEach(([effect, value]) => {
        if (effect.endsWith('Capacity') && effect !== 'storageCapacity') {
          const resourceType = effect.replace('Capacity', '');
          if (capacities[resourceType]) {
            capacities[resourceType] += value;
          }
        }
      });
    }
  });
  
  // Apply external modifiers
  Object.entries(modifiers).forEach(([resource, modifier]) => {
    if (capacities[resource] !== undefined && capacities[resource] !== Infinity) {
      capacities[resource] *= 1 + modifier;
      capacities[resource] = Math.floor(capacities[resource]);
    }
  });
  
  return capacities;
};

export default {
  RESOURCE_TYPES,
  calculateResourceGeneration,
  calculateResourceCapacities
};