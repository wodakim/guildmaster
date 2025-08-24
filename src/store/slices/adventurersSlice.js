// Adventurers slice for adventurer management
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { generateAdventurer } from '../../models/Adventurer';

const initialState = {
  adventurers: [
    generateAdventurer({ class: 'Warrior' }), // Start with one warrior
  ],
  recruitCost: 50, // Gold cost to recruit a new adventurer
  recruitCostMultiplier: 1.5, // Cost increases with each recruit
};

export const adventurersSlice = createSlice({
  name: 'adventurers',
  initialState,
  reducers: {
    recruitAdventurer: (state, action) => {
      const { classType, paid = true } = action.payload;
      const newAdventurer = generateAdventurer({ class: classType });
      
      state.adventurers.push(newAdventurer);
      
      if (paid) {
        state.recruitCost = Math.floor(state.recruitCost * state.recruitCostMultiplier);
      }
    },
    levelUpAdventurer: (state, action) => {
      const { adventurerId } = action.payload;
      const adventurer = state.adventurers.find(adv => adv.id === adventurerId);
      
      if (adventurer) {
        adventurer.experience = 0;
        adventurer.level += 1;
        adventurer.experienceToNextLevel = Math.floor(adventurer.experienceToNextLevel * 1.2);
        
        // Increase stats based on class
        switch (adventurer.class) {
          case 'Warrior':
            adventurer.stats.strength += 2;
            adventurer.stats.constitution += 2;
            adventurer.stats.intelligence += 1;
            break;
          case 'Mage':
            adventurer.stats.intelligence += 3;
            adventurer.stats.dexterity += 1;
            adventurer.stats.constitution += 1;
            break;
          case 'Archer':
            adventurer.stats.dexterity += 3;
            adventurer.stats.strength += 1;
            adventurer.stats.intelligence += 1;
            break;
          case 'Rogue':
            adventurer.stats.dexterity += 2;
            adventurer.stats.strength += 2;
            adventurer.stats.luck += 1;
            break;
          case 'Cleric':
            adventurer.stats.intelligence += 2;
            adventurer.stats.constitution += 2;
            adventurer.stats.luck += 1;
            break;
          default:
            // Balanced increase for other classes
            adventurer.stats.strength += 1;
            adventurer.stats.dexterity += 1;
            adventurer.stats.intelligence += 1;
            adventurer.stats.constitution += 1;
            adventurer.stats.luck += 1;
        }
      }
    },
    addAdventurerExperience: (state, action) => {
      const { adventurerId, amount } = action.payload;
      const adventurer = state.adventurers.find(adv => adv.id === adventurerId);
      
      if (adventurer) {
        adventurer.experience += amount;
      }
    },
    equipItem: (state, action) => {
      const { adventurerId, slot, item } = action.payload;
      const adventurer = state.adventurers.find(adv => adv.id === adventurerId);
      
      if (adventurer && adventurer.equipment) {
        adventurer.equipment[slot] = item;
      }
    },
    setAdventurerStatus: (state, action) => {
      const { adventurerId, status } = action.payload;
      const adventurer = state.adventurers.find(adv => adv.id === adventurerId);
      
      if (adventurer) {
        adventurer.status = status;
      }
    },
  },
});

export const {
  recruitAdventurer,
  levelUpAdventurer,
  addAdventurerExperience,
  equipItem,
  setAdventurerStatus,
} = adventurersSlice.actions;

export default adventurersSlice.reducer;