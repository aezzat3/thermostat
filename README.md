# Thermostat Demo - Expo React Native

This is a single-screen Expo React Native demo showcasing offline-first architecture with Redux + Thunk, optimistic updates, conflict resolution, and performance optimization.

## Features

### Core Functionality
- **Offline-first thermostat control** with optimistic updates
- **Redux + Thunk** state management with command queue coalescing
- **Conflict resolution** using "client wins" rule
- **Performance comparison** showing before/after React Native optimization

### UI Components
- Current and target temperature display
- +/- stepper buttons for temperature adjustment
- Offline mode toggle with connection status
- Command queue visualization
- Error handling with retry functionality
- Schedules section with 24 toggle rows (performance demo)

### Technical Highlights
- **Optimistic Updates**: UI updates instantly, commands queued for sync
- **Queue Coalescing**: Only latest SET_TARGET command is kept
- **Conflict Resolution**: Client intent preserved over server state
- **Performance Fix**: React.memo + local state isolation reduces re-renders by 96%

## Architecture

### Redux State Shape
```typescript
interface ThermostatState {
  currentTemp: number;
  targetTemp: number;
  isOffline: boolean;
  isSyncing: boolean;
  commandQueue: Command[];
  lastSyncError: string | null;
  conflictCount: number;
}
```

### Mock API Features
- Random latency (500-2000ms for setTarget, 300-1000ms for fetchState)
- 10% failure rate for setTarget, 5% for fetchState
- Conflict simulation via "Force Conflict Once" button
- Out-of-order response protection

## Performance Demo

The app includes two versions of the schedules section:

### Bug Version (SchedulesSection)
- All toggle state in parent component
- Toggling one row triggers 25 re-renders (1 parent + 24 children)
- Demonstrates common React Native performance issue

### Fixed Version (SchedulesSectionFixed)
- Local state in individual rows with React.memo
- Toggling one row triggers only 1 re-render
- **96% reduction** in unnecessary re-renders

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Scan the QR code with the Expo Go app on your device

## Testing the Features

### Offline-first Behavior
1. Toggle "Offline Mode" ON
2. Adjust temperature with +/- buttons
3. Observe UI updates instantly (optimistic)
4. Toggle "Offline Mode" OFF - queue flushes automatically

### Conflict Resolution
1. Click "Force Conflict Once" button
2. Adjust temperature
3. Observe conflict detection and "client wins" rule application

### Performance Comparison
1. Open browser console to see render counts
2. Toggle switches in both schedule sections
3. Compare render counts between bug and fixed versions

## Key Files

- `src/store/thermostatSlice.ts` - Redux slice with coalescing logic
- `src/store/thermostatThunks.ts` - Thunk actions for optimistic updates
- `src/api/api.ts` - Mock API with latency and conflict simulation
- `src/components/SchedulesSection.tsx` - Performance bug version
- `src/components/SchedulesSectionFixed.tsx` - Optimized version
- `src/hooks/useRenderCount.ts` - Performance measurement hook

## Architecture Decisions

See [DECISIONS.md](DECISIONS.md) for detailed trade-offs and rationale.

## Performance Analysis

See [PERF_NOTES.md](PERF_NOTES.md) for performance bug analysis and fix details.