// Guild slice for guild management
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  id: uuidv4(),
  name: 'New Guild',
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  reputation: 0,
  maxAdventurers: 3,
  maxMissions: 2,
};

export const guildSlice = createSlice({
  name: 'guild',
  initialState,
  reducers: {
    renameGuild: (state, action) => {
      state.name = action.payload;
    },
    addExperience: (state, action) => {
      state.experience += action.payload;
      
      // Level up if enough experience
      while (state.experience >= state.experienceToNextLevel) {
        state.experience -= state.experienceToNextLevel;
        state.level += 1;
        state.experienceToNextLevel = Math.floor(state.experienceToNextLevel * 1.5);
        
        // Increase max adventurers every 3 levels
        if (state.level % 3 === 0) {
          state.maxAdventurers += 1;
        }
        
        // Increase max missions every 5 levels
        if (state.level % 5 === 0) {
          state.maxMissions += 1;
        }
      }
    },
    addReputation: (state, action) => {
      state.reputation += action.payload;
    },
    increaseMaxAdventurers: (state, action) => {
      state.maxAdventurers += action.payload || 1;
    },
    increaseMaxMissions: (state, action) => {
      state.maxMissions += action.payload || 1;
    },
  },
});

export const {
  renameGuild,
  addExperience,
  addReputation,
  increaseMaxAdventurers,
  increaseMaxMissions,
} = guildSlice.actions;

export default guildSlice.reducer;