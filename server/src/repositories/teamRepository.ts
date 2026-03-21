import prisma from '../config/client.js';

export class TeamRepository {
  async createTeam(name: string, ownerId: string): Promise<any> {
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

  async findUserTeams(userId: string): Promise<any[]> {
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

  async addMember(teamId: string, userId: string, role: any = 'MEMBER'): Promise<any> {
    return prisma.teamMember.create({
      data: {
        team_id: teamId,
        user_id: userId,
        role
      }
    });
  }

  async findTeamById(id: string): Promise<any | null> {
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

  async isMember(teamId: string, userId: string): Promise<boolean> {
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
