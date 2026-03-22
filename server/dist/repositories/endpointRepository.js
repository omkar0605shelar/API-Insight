import prisma from '../config/client.js';
export class EndpointRepository {
    async create(data) {
        return prisma.endpoint.create({ data });
    }
    async findByProjectId(projectId) {
        return prisma.endpoint.findMany({
            where: { project_id: projectId }
        });
    }
    async findById(id) {
        return prisma.endpoint.findUnique({
            where: { id }
        });
    }
}
