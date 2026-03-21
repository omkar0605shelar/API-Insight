import prisma from '../config/client.js';

export class AnalyticsRepository {
  async getRequestCountsByEndpoint(projectId: string): Promise<any[]> {
    return prisma.requestHistory.groupBy({
      by: ['endpoint_id', 'method', 'url'],
      where: { endpoint: { project_id: projectId } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });
  }

  async getDailyRequestCounts(projectId: string, days: number = 7): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Prisma doesn't support grouping by date part easily in all DBs without raw query, 
    // but we can fetch and process or use a raw query.
    // Let's use a raw query for better performance on PostgreSQL.
    return prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM "RequestHistory"
      WHERE endpoint_id IN (SELECT id FROM "Endpoint" WHERE project_id = ${projectId})
      AND created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
  }

  async getTotalEndpoints(projectId: string): Promise<number> {
    return prisma.endpoint.count({
      where: { project_id: projectId }
    });
  }
}
