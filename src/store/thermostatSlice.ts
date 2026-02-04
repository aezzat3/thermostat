import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThermostatState, Command } from '../types';

const initialState: ThermostatState = {
  currentTemp: 22,
  targetTemp: 22,
  isOffline: false,
  isSyncing: false,
  commandQueue: [],
  lastSyncError: null,
  conflictCount: 0,
};

const thermostatSlice = createSlice({
  name: 'thermostat',
  initialState,
  reducers: {
    setTargetTemp: (state, action: PayloadAction<number>) => {
      state.targetTemp = action.payload;
    },
    setCurrentTemp: (state, action: PayloadAction<number>) => {
      state.currentTemp = action.payload;
    },
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    addCommand: (state, action: PayloadAction<Command>) => {
      // Coalesce commands - keep only the latest SET_TARGET command
      state.commandQueue = state.commandQueue.filter(
        cmd => cmd.type !== 'SET_TARGET'
      );
      state.commandQueue.push(action.payload);
    },
    removeCommand: (state, action: PayloadAction<string>) => {
      state.commandQueue = state.commandQueue.filter(
        cmd => cmd.id !== action.payload
      );
    },
    setLastError: (state, action: PayloadAction<string | null>) => {
      state.lastSyncError = action.payload;
    },
    incrementConflictCount: (state) => {
      state.conflictCount += 1;
    },
    clearQueue: (state) => {
      state.commandQueue = [];
    },
  },
});

export const {
  setTargetTemp,
  setCurrentTemp,
  setOffline,
  setSyncing,
  addCommand,
  removeCommand,
  setLastError,
  incrementConflictCount,
  clearQueue,
} = thermostatSlice.actions;

export default thermostatSlice.reducer;