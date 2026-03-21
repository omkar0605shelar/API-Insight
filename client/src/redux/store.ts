import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import endpointReducer from './slices/endpointSlice';
import teamReducer from './slices/teamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    endpoint: endpointReducer,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
