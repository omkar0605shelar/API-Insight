import prisma from '../config/client.js';

export class TestingRepository {
  async saveHistory(data: any): Promise<any> {
    return prisma.requestHistory.create({ data });
  }

  async getHistoryByEndpoint(endpointId: string): Promise<any[]> {
    return prisma.requestHistory.findMany({
      where: { endpoint_id: endpointId },
      orderBy: { created_at: 'desc' },
      take: 20
    });
  }
}
