import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { TeamService } from '../services/teamService.js';

const teamService = new TeamService();

export const createTeam = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Team name is required' });
    return;
  }

  try {
    const team = await teamService.createTeam(name, (req.user as any).id);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { teamId, email } = req.body;
  if (!teamId || !email) {
    res.status(400).json({ message: 'Team ID and Email are required' });
    return;
  }

  try {
    const member = await teamService.inviteUser(teamId, email);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

export const getMyTeams = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teams = await teamService.getUserTeams((req.user as any).id);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { teamId } = req.params;
  try {
    const team = await teamService.getTeamDetails(teamId, (req.user as any).id);
    res.json(team);
  } catch (error) {
    next(error);
  }
};
