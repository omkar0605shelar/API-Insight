import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Endpoint {
  id: string;
  project_id: string;
  method: string;
  path: string;
  request_schema: any;
  response_schema: any;
  ai_explanation?: any;
  history?: any[];
}

interface EndpointState {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  loading: boolean;
}

const initialState: EndpointState = {
  endpoints: [],
  selectedEndpoint: null,
  loading: false,
};

const endpointSlice = createSlice({
  name: 'endpoint',
  initialState,
  reducers: {
    setEndpoints: (state, action: PayloadAction<Endpoint[]>) => {
      state.endpoints = action.payload;
      if (!state.selectedEndpoint && action.payload.length > 0) {
        state.selectedEndpoint = action.payload[0];
      }
    },
    setSelectedEndpoint: (state, action: PayloadAction<Endpoint | null>) => {
      state.selectedEndpoint = action.payload;
    },
    setAiExplanation: (state, action: PayloadAction<{ endpointId: string; explanation: any }>) => {
      const endpoint = state.endpoints.find(e => e.id === action.payload.endpointId);
      if (endpoint) {
        endpoint.ai_explanation = action.payload.explanation;
      }
      if (state.selectedEndpoint?.id === action.payload.endpointId) {
        state.selectedEndpoint.ai_explanation = action.payload.explanation;
      }
    },
    setHistory: (state, action: PayloadAction<{ endpointId: string; history: any[] }>) => {
      const endpoint = state.endpoints.find(e => e.id === action.payload.endpointId);
      if (endpoint) {
        endpoint.history = action.payload.history;
      }
      if (state.selectedEndpoint?.id === action.payload.endpointId) {
        state.selectedEndpoint.history = action.payload.history;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setEndpoints, setSelectedEndpoint, setAiExplanation, setHistory, setLoading } = endpointSlice.actions;
export default endpointSlice.reducer;
