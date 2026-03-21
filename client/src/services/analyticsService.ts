import api from './api';

export const getProjectAnalytics = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/analytics`);
  return response.data;
};
