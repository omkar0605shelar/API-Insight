import prisma from '../config/client.js';
export class VersionRepository {
    async createVersion(projectId, version, changes) {
        return prisma.apiVersion.create({
            data: {
                project_id: projectId,
                version,
                changes
            }
        });
    }
    async findByProjectId(projectId) {
        return prisma.apiVersion.findMany({
            where: { project_id: projectId },
            orderBy: { created_at: 'desc' }
        });
    }
    async findVersionById(id) {
        return prisma.apiVersion.findUnique({
            where: { id }
        });
    }
}
