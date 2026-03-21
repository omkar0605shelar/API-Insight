import api from './api';

export const createTeam = async (name: string) => {
  const response = await api.post('/teams', { name });
  return response.data;
};

export const getMyTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const inviteMember = async (teamId: string, email: string) => {
  const response = await api.post('/teams/invite', { teamId, email });
  return response.data;
};

export const getTeamDetails = async (teamId: string) => {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
};
