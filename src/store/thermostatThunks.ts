import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './index';
import { mockApi } from '../api/api';
import { Command } from '../types';
import { 
  setTargetTemp, 
  removeCommand, 
  addCommand,
  setLastError, 
  setSyncing,
  incrementConflictCount 
} from './thermostatSlice';

export const setTargetTemperature = createAsyncThunk(
  'thermostat/setTargetTemperature',
  async (target: number, { getState, dispatch }) => {
    const state = getState() as RootState;
    const clientTs = Date.now();

    // Optimistic update - update UI immediately
    dispatch(setTargetTemp(target));

    // Create command for queue
    const command: Command = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'SET_TARGET',
      payload: target,
      clientTs,
      attempts: 0,
    };

    // Always add to queue first (it handles coalescing)
    dispatch(addCommand(command));

    // If online, process immediately
    if (!state.thermostat.isOffline) {
      await dispatch(processCommand(command));
    }

    return target;
  }
);

export const processCommand = createAsyncThunk(
  'thermostat/processCommand',
  async (command: Command, { dispatch }) => {
    dispatch(setSyncing(true));
    
    try {
      const response = await mockApi.setTarget(command.payload, command.clientTs);
      
      // Check for conflict (server returned different target)
      if (response.conflict || response.target !== command.payload) {
        dispatch(incrementConflictCount());
        // Client wins rule: keep our intended target, ignore server's different value
        console.log(`Conflict detected: requested ${command.payload}, server returned ${response.target}. Keeping client value.`);
      }
      
      // Remove from queue on success
      dispatch(removeCommand(command.id));
      dispatch(setLastError(null));
      
    } catch (error) {
      console.error('Failed to process command:', error);
      dispatch(setLastError(error instanceof Error ? error.message : 'Unknown error'));
      
      // Retry logic would go here in a real implementation
      // For this demo, we'll just keep it in the queue
    } finally {
      dispatch(setSyncing(false));
    }
  }
);

export const fetchThermostatState = createAsyncThunk(
  'thermostat/fetchState',
  async (_, { dispatch }) => {
    try {
      const state = await mockApi.fetchState();
      // Only update current temp, not target (to avoid overwriting user intent)
      // This prevents out-of-order responses from regressing the UI
      return state;
    } catch (error) {
      dispatch(setLastError(error instanceof Error ? error.message : 'Failed to fetch state'));
      throw error;
    }
  }
);

export const flushQueue = createAsyncThunk(
  'thermostat/flushQueue',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const queue = state.thermostat.commandQueue;
    
    if (queue.length === 0) return;
    
    // Process each command in queue
    for (const command of queue) {
      await dispatch(processCommand(command));
    }
  }
);