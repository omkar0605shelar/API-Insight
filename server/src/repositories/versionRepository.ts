import prisma from '../config/client.js';

export class VersionRepository {
  async createVersion(projectId: string, version: string, changes?: string): Promise<any> {
    return prisma.apiVersion.create({
      data: {
        project_id: projectId,
        version,
        changes
      }
    });
  }

  async findByProjectId(projectId: string): Promise<any[]> {
    return prisma.apiVersion.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: 'desc' }
    });
  }

  async findVersionById(id: string): Promise<any | null> {
    return prisma.apiVersion.findUnique({
      where: { id }
    });
  }
}
