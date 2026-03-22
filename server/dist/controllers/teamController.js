import { TeamService } from '../services/teamService.js';
const teamService = new TeamService();
export const createTeam = async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: 'Team name is required' });
        return;
    }
    try {
        const team = await teamService.createTeam(name, req.user.id);
        res.status(201).json(team);
    }
    catch (error) {
        next(error);
    }
};
export const inviteMember = async (req, res, next) => {
    const { teamId, email } = req.body;
    if (!teamId || !email) {
        res.status(400).json({ message: 'Team ID and Email are required' });
        return;
    }
    try {
        const member = await teamService.inviteUser(teamId, email);
        res.status(201).json(member);
    }
    catch (error) {
        next(error);
    }
};
export const getMyTeams = async (req, res, next) => {
    try {
        const teams = await teamService.getUserTeams(req.user.id);
        res.json(teams);
    }
    catch (error) {
        next(error);
    }
};
export const getTeamDetails = async (req, res, next) => {
    const { teamId } = req.params;
    try {
        const team = await teamService.getTeamDetails(teamId, req.user.id);
        res.json(team);
    }
    catch (error) {
        next(error);
    }
};
