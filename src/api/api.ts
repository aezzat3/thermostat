import { SetTargetResponse, FetchStateResponse } from '../types';

// Debug flag to force conflicts
let forceConflictOnce = false;

// Mock API service with random latency and occasional failures
export const mockApi = {
  async setTarget(target: number, clientTs: number): Promise<SetTargetResponse> {
    // Random latency between 500-2000ms
    const latency = Math.random() * 1500 + 500;
    await new Promise(resolve => setTimeout(resolve, latency));

    // 10% chance of failure
    if (Math.random() < 0.1) {
      throw new Error('Network error: Failed to set target temperature');
    }

    // Force conflict if debug flag is set
    if (forceConflictOnce) {
      forceConflictOnce = false;
      return {
        success: true,
        target: target + 2, // Return different target to simulate conflict
        serverTs: Date.now(),
        conflict: true,
      };
    }

    return {
      success: true,
      target,
      serverTs: Date.now(),
    };
  },

  async fetchState(): Promise<FetchStateResponse> {
    // Random latency between 300-1000ms
    const latency = Math.random() * 700 + 300;
    await new Promise(resolve => setTimeout(resolve, latency));

    // 5% chance of failure
    if (Math.random() < 0.05) {
      throw new Error('Network error: Failed to fetch state');
    }

    return {
      currentTemp: 20 + Math.random() * 5, // Mock current temp between 20-25°C
      targetTemp: 22,
      lastUpdated: Date.now(),
    };
  },

  // Debug function to force conflict on next setTarget call
  forceConflictOnce() {
    forceConflictOnce = true;
  },
};