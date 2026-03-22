import { TeamRepository } from '../repositories/teamRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
const teamRepository = new TeamRepository();
const userRepository = new UserRepository();
export class TeamService {
    async createTeam(name, ownerId) {
        return teamRepository.createTeam(name, ownerId);
    }
    async getUserTeams(userId) {
        return teamRepository.findUserTeams(userId);
    }
    async inviteUser(teamId, email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const error = new Error('User with this email not found');
            error.statusCode = 404;
            throw error;
        }
        const isMember = await teamRepository.isMember(teamId, user.id);
        if (isMember) {
            const error = new Error('User is already a member of this team');
            error.statusCode = 400;
            throw error;
        }
        return teamRepository.addMember(teamId, user.id, 'MEMBER');
    }
    async getTeamDetails(teamId, userId) {
        const isMember = await teamRepository.isMember(teamId, userId);
        if (!isMember) {
            const error = new Error('You do not have access to this team');
            error.statusCode = 403;
            throw error;
        }
        const team = await teamRepository.findTeamById(teamId);
        if (!team) {
            const error = new Error('Team not found');
            error.statusCode = 404;
            throw error;
        }
        return team;
    }
}
