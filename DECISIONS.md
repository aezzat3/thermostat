## Key Architecture Decisions

### 1. Client-Wins Conflict Resolution
**Decision**: When server responds with different target temperature than requested, preserve user's intended value.
**Rationale**: User intent takes precedence over server state in thermostat control. Better to have user comfort than perfect sync.
**Trade-off**: May create slight drift but ensures predictable user experience.

### 2. Queue Coalescing Over Full History
**Decision**: Only keep latest SET_TARGET command, discard older ones.
**Rationale**: Reduces network traffic and complexity. User only cares about final desired temperature.
**Trade-off**: Loses intermediate states but gains simplicity and reliability.

### 3. Optimistic Updates Without Rollback
**Decision**: UI updates immediately and stays updated even if API fails.
**Rationale**: Provides responsive feel. Failed commands stay queued for retry rather than reverting UI.
**Trade-off**: UI may show different state than server temporarily, but user gets immediate feedback.

### 4. Single Screen Architecture
**Decision**: Keep everything on one screen to focus on core offline-first logic.
**Rationale**: Demonstrates the challenging parts (queue management, conflict resolution) without navigation complexity.
**Trade-off**: Less realistic UX but better showcases technical requirements for trial assessment.