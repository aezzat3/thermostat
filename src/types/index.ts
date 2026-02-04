export interface ThermostatState {
  currentTemp: number;
  targetTemp: number;
  isOffline: boolean;
  isSyncing: boolean;
  commandQueue: Command[];
  lastSyncError: string | null;
  conflictCount: number;
}

export interface Command {
  id: string;
  type: 'SET_TARGET';
  payload: number;
  clientTs: number;
  attempts: number;
}

export interface SetTargetResponse {
  success: boolean;
  target: number;
  serverTs: number;
  conflict?: boolean;
}

export interface FetchStateResponse {
  currentTemp: number;
  targetTemp: number;
  lastUpdated: number;
}

export interface ScheduleItem {
  id: string;
  name: string;
  enabled: boolean;
  time: string;
}