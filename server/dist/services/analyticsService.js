import { AnalyticsRepository } from '../repositories/analyticsRepository.js';
const analyticsRepository = new AnalyticsRepository();
export class AnalyticsService {
    async getProjectAnalytics(projectId) {
        try {
            const [requestCounts, dailyCounts, totalEndpoints] = await Promise.all([
                analyticsRepository.getRequestCountsByEndpoint(projectId),
                analyticsRepository.getDailyRequestCounts(projectId),
                analyticsRepository.getTotalEndpoints(projectId)
            ]);
            return {
                totalEndpoints,
                mostUsedEndpoints: requestCounts.slice(0, 5),
                dailyUsage: dailyCounts
            };
        }
        catch (error) {
            console.error('Analytics Service Error:', error);
            throw new Error('Failed to fetch project analytics');
        }
    }
}
