// Resources slice for resource management
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gold: 100,
  materials: 50,
  reputation: 0,
  gems: 0, // Premium currency
  generationRates: {
    gold: 1, // Gold per second
    materials: 0.5, // Materials per second
  },
  capacity: {
    gold: 1000,
    materials: 500,
  },
};

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action) => {
      const { type, amount } = action.payload;
      
      if (state[type] !== undefined) {
        state[type] = Math.min(state[type] + amount, state.capacity[type] || Infinity);
      }
    },
    removeResource: (state, action) => {
      const { type, amount } = action.payload;
      
      if (state[type] !== undefined && state[type] >= amount) {
        state[type] -= amount;
        return true;
      }
      return false;
    },
    updateGenerationRate: (state, action) => {
      const { type, rate } = action.payload;
      
      if (state.generationRates[type] !== undefined) {
        state.generationRates[type] = rate;
      }
    },
    increaseCapacity: (state, action) => {
      const { type, amount } = action.payload;
      
      if (state.capacity[type] !== undefined) {
        state.capacity[type] += amount;
      }
    },
    generateResources: (state, action) => {
      const seconds = action.payload || 1;
      
      Object.keys(state.generationRates).forEach(resourceType => {
        if (state[resourceType] !== undefined) {
          const amount = state.generationRates[resourceType] * seconds;
          state[resourceType] = Math.min(
            state[resourceType] + amount,
            state.capacity[resourceType] || Infinity
          );
        }
      });
    },
    setResourceCapacity: (state, action) => {
      const { type, capacity } = action.payload;
      
      if (state.capacity[type] !== undefined) {
        state.capacity[type] = capacity;
      }
    },
  },
});

export const {
  addResource,
  removeResource,
  updateGenerationRate,
  increaseCapacity,
  generateResources,
  setResourceCapacity,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;