import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { VersionService } from '../services/versionService.js';

const versionService = new VersionService();

export const createVersion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { projectId, version, changes } = req.body;
  
  if (!projectId || !version) {
    res.status(400).json({ message: 'Project ID and Version name are required' });
    return;
  }

  try {
    const result = await versionService.createVersion(projectId, version, (req.user as any).id, changes);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getVersions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { projectId } = req.params;
  
  try {
    const versions = await versionService.getProjectVersions(projectId, (req.user as any).id);
    res.json(versions);
  } catch (error) {
    next(error);
  }
};
