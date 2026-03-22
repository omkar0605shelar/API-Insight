import prisma from '../config/client.js';
export class TeamRepository {
    async createTeam(name, ownerId) {
        return prisma.team.create({
            data: {
                name,
                members: {
                    create: {
                        user_id: ownerId,
                        role: 'ADMIN'
                    }
                }
            },
            include: { members: true }
        });
    }
    async findUserTeams(userId) {
        return prisma.team.findMany({
            where: {
                members: {
                    some: { user_id: userId }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });
    }
    async addMember(teamId, userId, role = 'MEMBER') {
        return prisma.teamMember.create({
            data: {
                team_id: teamId,
                user_id: userId,
                role
            }
        });
    }
    async findTeamById(id) {
        return prisma.team.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                },
                projects: true
            }
        });
    }
    async isMember(teamId, userId) {
        const member = await prisma.teamMember.findUnique({
            where: {
                team_id_user_id: {
                    team_id: teamId,
                    user_id: userId
                }
            }
        });
        return !!member;
    }
}
