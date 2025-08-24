// Buildings slice for building management
import { createSlice } from '@reduxjs/toolkit';
import { generateBuilding } from '../../models/Building';

const initialState = {
  buildings: [
    // Start with guild hall at level 1
    generateBuilding({ 
      type: 'Guild Hall', 
      level: 1,
      description: 'The center of your guild operations.',
      effects: { maxAdventurers: 3, maxMissions: 2, reputationBonus: 0 },
      upgradeRequirements: { gold: 200, materials: 100 },
      maxLevel: 10
    }),
    // Unlocked but not built
    generateBuilding({
      type: 'Training Ground', 
      level: 0,
      description: 'Train your adventurers to level up faster.',
      effects: { experienceBonus: 0 },
      upgradeRequirements: { gold: 100, materials: 50 },
      maxLevel: 5,
      unlocked: true
    }),
    // Locked until guild hall level 2
    generateBuilding({
      type: 'Tavern', 
      level: 0,
      description: 'Attracts potential recruits to your guild.',
      effects: { recruitCostReduction: 0 },
      upgradeRequirements: { gold: 150, materials: 75 },
      maxLevel: 5,
      unlocked: false,
      unlockRequirements: { 'Guild Hall': 2 }
    }),
  ],
};

export const buildingsSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    upgradeBuilding: (state, action) => {
      const { buildingId } = action.payload;
      const building = state.buildings.find(b => b.id === buildingId);
      
      if (building && building.level < building.maxLevel) {
        building.level += 1;
        
        // Update effects based on building type
        switch (building.type) {
          case 'Guild Hall':
            building.effects.maxAdventurers = 3 + Math.floor(building.level / 2);
            building.effects.maxMissions = 2 + Math.floor(building.level / 3);
            building.effects.reputationBonus = building.level * 5;
            break;
          case 'Training Ground':
            building.effects.experienceBonus = building.level * 0.1; // +10% per level
            break;
          case 'Tavern':
            building.effects.recruitCostReduction = building.level * 0.05; // -5% per level
            break;
          case 'Blacksmith':
            building.effects.equipmentQuality = building.level * 0.15; // +15% per level
            break;
          case 'Library':
            building.effects.researchSpeed = building.level * 0.2; // +20% per level
            break;
          case 'Market':
            building.effects.tradeProfitBonus = building.level * 0.1; // +10% per level
            break;
          default:
            // Generic upgrade
            Object.keys(building.effects).forEach(effect => {
              building.effects[effect] *= 1.2; // Increase by 20%
            });
        }
        
        // Increase upgrade costs for next level
        building.upgradeRequirements.gold = Math.floor(building.upgradeRequirements.gold * 1.5);
        building.upgradeRequirements.materials = Math.floor(building.upgradeRequirements.materials * 1.5);
        
        // Check if new buildings should be unlocked
        state.buildings.forEach(b => {
          if (!b.unlocked && b.unlockRequirements) {
            const requirements = Object.entries(b.unlockRequirements);
            const allMet = requirements.every(([reqType, reqLevel]) => {
              const reqBuilding = state.buildings.find(bld => bld.type === reqType);
              return reqBuilding && reqBuilding.level >= reqLevel;
            });
            
            if (allMet) {
              b.unlocked = true;
            }
          }
        });
      }
    },
    unlockBuilding: (state, action) => {
      const { buildingType } = action.payload;
      const building = state.buildings.find(b => b.type === buildingType);
      
      if (building) {
        building.unlocked = true;
      }
    },
    constructBuilding: (state, action) => {
      const { buildingId } = action.payload;
      const building = state.buildings.find(b => b.id === buildingId);
      
      if (building && building.unlocked && building.level === 0) {
        building.level = 1;
        
        // Initialize effects based on building type
        switch (building.type) {
          case 'Guild Hall':
            building.effects.maxAdventurers = 3;
            building.effects.maxMissions = 2;
            building.effects.reputationBonus = 5;
            break;
          case 'Training Ground':
            building.effects.experienceBonus = 0.1; // +10% experience
            break;
          case 'Tavern':
            building.effects.recruitCostReduction = 0.05; // -5% recruit cost
            break;
          case 'Blacksmith':
            building.effects.equipmentQuality = 0.15; // +15% equipment quality
            break;
          case 'Library':
            building.effects.researchSpeed = 0.2; // +20% research speed
            break;
          case 'Market':
            building.effects.tradeProfitBonus = 0.1; // +10% trade profit
            break;
        }
        
        // Update upgrade costs for next level
        building.upgradeRequirements.gold = Math.floor(building.upgradeRequirements.gold * 1.5);
        building.upgradeRequirements.materials = Math.floor(building.upgradeRequirements.materials * 1.5);
      }
    },
    addNewBuilding: (state, action) => {
      const newBuilding = generateBuilding(action.payload);
      state.buildings.push(newBuilding);
    },
  },
});

export const {
  upgradeBuilding,
  unlockBuilding,
  constructBuilding,
  addNewBuilding,
} = buildingsSlice.actions;

export default buildingsSlice.reducer;