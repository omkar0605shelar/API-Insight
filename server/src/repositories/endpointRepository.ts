import prisma from '../config/client.js';

export class EndpointRepository {
  async create(data: {
    project_id: string;
    method: string;
    path: string;
    request_schema?: any;
    response_schema?: any;
  }): Promise<any> {
    return prisma.endpoint.create({ data });
  }

  async findByProjectId(projectId: string): Promise<any[]> {
    return prisma.endpoint.findMany({
      where: { project_id: projectId }
    });
  }

  async findById(id: string): Promise<any | null> {
    return prisma.endpoint.findUnique({
      where: { id }
    });
  }
}
