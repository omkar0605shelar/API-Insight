import api from './api';

export const explainEndpoint = async (endpointId: string) => {
  const response = await api.get(`/endpoints/${endpointId}/explain`);
  return response.data;
};
