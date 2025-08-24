// Game slice for global game state
import { createSlice } from '@reduxjs/toolkit';
import { differenceInSeconds } from 'date-fns';
import { calculateOfflineProgress } from '../../utils/gameCalculations';

const initialState = {
  initialized: false,
  lastSaveTime: new Date().toISOString(),
  lastLoginTime: new Date().toISOString(),
  tutorialCompleted: false,
  tutorialStep: 0,
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    notifications: true,
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state) => {
      state.initialized = true;
      state.lastLoginTime = new Date().toISOString();
    },
    updateLastSaveTime: (state) => {
      state.lastSaveTime = new Date().toISOString();
    },
    completeTutorial: (state) => {
      state.tutorialCompleted = true;
    },
    advanceTutorialStep: (state) => {
      state.tutorialStep += 1;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    calculateOfflineProgression: (state, action) => {
      const { resources, buildings, missions } = action.payload;
      const now = new Date();
      const lastSaveTime = new Date(state.lastSaveTime);
      const secondsElapsed = differenceInSeconds(now, lastSaveTime);
      
      if (secondsElapsed > 10) { // Only calculate if more than 10 seconds elapsed
        calculateOfflineProgress(secondsElapsed, resources, buildings, missions);
      }
      
      state.lastLoginTime = now.toISOString();
      state.lastSaveTime = now.toISOString();
    },
  },
});

export const {
  initializeGame,
  updateLastSaveTime,
  completeTutorial,
  advanceTutorialStep,
  updateSettings,
  calculateOfflineProgression,
} = gameSlice.actions;

export default gameSlice.reducer;