import { configureStore } from '@reduxjs/toolkit';
import thermostatReducer from './thermostatSlice';

export const store = configureStore({
  reducer: {
    thermostat: thermostatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;