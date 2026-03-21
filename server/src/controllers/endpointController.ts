import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { EndpointService } from '../services/endpointService.js';

const endpointService = new EndpointService();

export const getProjectEndpoints = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { projectId } = req.params;
  
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const endpoints = await endpointService.getProjectEndpoints(projectId as string, (req.user as any).id);
    res.json(endpoints);
  } catch (error) {
    next(error);
  }
};
