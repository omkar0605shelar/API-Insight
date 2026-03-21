import api from './api';

export const getGithubRepos = async (accessToken: string) => {
  const response = await api.post('/github/repos', { accessToken });
  return response.data;
};

export const getGithubRepoDetail = async (accessToken: string, fullName: string) => {
  const response = await api.post('/github/repo', { accessToken, fullName });
  return response.data;
};
