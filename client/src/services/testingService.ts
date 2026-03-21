import api from './api';

export const executeApiRequest = async (data: {
  endpointId: string;
  method: string;
  url: string;
  headers?: any;
  body?: any;
}) => {
  const response = await api.post('/testing/execute', data);
  return response.data;
};

export const getRequestHistory = async (endpointId: string) => {
  const response = await api.get(`/testing/history/${endpointId}`);
  return response.data;
};
