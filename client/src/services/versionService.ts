import api from './api';

export const createVersion = async (projectId: string, version: string, changes?: string) => {
  const response = await api.post(`/projects/${projectId}/version`, { projectId, version, changes });
  return response.data;
};

export const getProjectVersions = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/versions`);
  return response.data;
};
