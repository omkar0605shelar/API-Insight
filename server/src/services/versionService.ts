import { VersionRepository } from '../repositories/versionRepository.js';
import { ProjectRepository } from '../repositories/projectRepository.js';

const versionRepository = new VersionRepository();
const projectRepository = new ProjectRepository();

export class VersionService {
  async createVersion(projectId: string, version: string, userId: string, changes?: string) {
    // 1. Check access
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
       const error = new Error('Project not found or unauthorized');
       (error as any).statusCode = 404;
       throw error;
    }

    // 2. Create version
    return versionRepository.createVersion(projectId, version, changes);
  }

  async getProjectVersions(projectId: string, userId: string) {
    // 1. Check access
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
       const error = new Error('Project not found or unauthorized');
       (error as any).statusCode = 404;
       throw error;
    }

    return versionRepository.findByProjectId(projectId);
  }
}
