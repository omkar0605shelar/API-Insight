import { ProjectRepository } from '../repositories/projectRepository.js';
import { getChannel } from '../config/rabbitmq.js';
const projectRepository = new ProjectRepository();
export class ProjectService {
    async importRepository(userId, repositoryUrl) {
        const project = await projectRepository.create(userId, repositoryUrl);
        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('api_scan_jobs', Buffer.from(JSON.stringify({ projectId: project.id, repositoryUrl })));
        }
        else {
            console.warn('RabbitMQ channel not available, job not queued');
        }
        return project;
    }
    async getProjectsByUser(userId) {
        return projectRepository.findByUserId(userId);
    }
    async getProjectById(id, userId) {
        const project = await projectRepository.findById(id, userId);
        if (!project) {
            const error = new Error('Project not found');
            error.statusCode = 404;
            throw error;
        }
        return project;
    }
}
