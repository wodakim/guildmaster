// Missions slice for mission management
import { createSlice } from '@reduxjs/toolkit';
import { generateMission } from '../../models/Mission';
import { addSeconds } from 'date-fns';

const initialState = {
  availableMissions: [
    generateMission({ difficulty: 'easy' }),
    generateMission({ difficulty: 'easy' }),
    generateMission({ difficulty: 'medium' }),
  ],
  activeMissions: [],
  completedMissions: [],
  missionRefreshCost: 25, // Gold cost to refresh available missions
  nextMissionRefresh: addSeconds(new Date(), 3600).toISOString(), // Auto-refresh every hour
};

export const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    refreshAvailableMissions: (state, action) => {
      const { paid = false, count = 3, difficultyDistribution = { easy: 0.5, medium: 0.3, hard: 0.2 } } = action.payload || {};
      
      state.availableMissions = [];
      
      // Generate new missions based on difficulty distribution
      for (let i = 0; i < count; i++) {
        const random = Math.random();
        let difficulty;
        
        if (random < difficultyDistribution.easy) {
          difficulty = 'easy';
        } else if (random < difficultyDistribution.easy + difficultyDistribution.medium) {
          difficulty = 'medium';
        } else {
          difficulty = 'hard';
        }
        
        state.availableMissions.push(generateMission({ difficulty }));
      }
      
      // Set next auto-refresh time
      state.nextMissionRefresh = addSeconds(new Date(), 3600).toISOString();
      
      // Increase refresh cost if paid refresh
      if (paid) {
        state.missionRefreshCost = Math.floor(state.missionRefreshCost * 1.2);
      }
    },
    startMission: (state, action) => {
      const { missionId, adventurerIds } = action.payload;
      const mission = state.availableMissions.find(m => m.id === missionId);
      
      if (mission) {
        // Remove from available missions
        state.availableMissions = state.availableMissions.filter(m => m.id !== missionId);
        
        // Set mission start time, end time, and assigned adventurers
        const now = new Date();
        mission.startTime = now.toISOString();
        mission.endTime = addSeconds(now, mission.duration).toISOString();
        mission.assignedAdventurers = adventurerIds;
        mission.status = 'active';
        
        // Add to active missions
        state.activeMissions.push(mission);
      }
    },
    completeMission: (state, action) => {
      const { missionId, success = true } = action.payload;
      const missionIndex = state.activeMissions.findIndex(m => m.id === missionId);
      
      if (missionIndex !== -1) {
        const mission = state.activeMissions[missionIndex];
        mission.status = success ? 'completed' : 'failed';
        mission.completionTime = new Date().toISOString();
        
        // Move from active to completed
        state.completedMissions.push(mission);
        state.activeMissions.splice(missionIndex, 1);
      }
    },
    checkActiveMissions: (state) => {
      const now = new Date();
      
      state.activeMissions.forEach(mission => {
        const endTime = new Date(mission.endTime);
        
        if (now >= endTime && mission.status === 'active') {
          mission.status = 'ready';
          mission.completionTime = endTime.toISOString();
        }
      });
    },
    claimMissionRewards: (state, action) => {
      const { missionId } = action.payload;
      const missionIndex = state.activeMissions.findIndex(m => m.id === missionId);
      
      if (missionIndex !== -1 && state.activeMissions[missionIndex].status === 'ready') {
        const mission = state.activeMissions[missionIndex];
        mission.status = 'completed';
        mission.claimed = true;
        
        // Move from active to completed
        state.completedMissions.push(mission);
        state.activeMissions.splice(missionIndex, 1);
      }
    },
  },
});

export const {
  refreshAvailableMissions,
  startMission,
  completeMission,
  checkActiveMissions,
  claimMissionRewards,
} = missionsSlice.actions;

export default missionsSlice.reducer;