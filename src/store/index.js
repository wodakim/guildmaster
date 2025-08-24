// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import guildReducer from './slices/guildSlice';
import adventurersReducer from './slices/adventurersSlice';
import missionsReducer from './slices/missionsSlice';
import buildingsReducer from './slices/buildingsSlice';
import resourcesReducer from './slices/resourcesSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    guild: guildReducer,
    adventurers: adventurersReducer,
    missions: missionsReducer,
    buildings: buildingsReducer,
    resources: resourcesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allow non-serializable data (like Date objects)
    }),
});

export default store;