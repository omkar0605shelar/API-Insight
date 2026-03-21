import { Request, Response, NextFunction } from 'express';
import prisma from '../config/client.js';

export const handleMockRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { projectId } = req.params;
  // Express 4 path-to-regexp uses * as index 0 in req.params if not named
  const mockPath = req.params[0] ? `/${req.params[0]}` : '/';
  const method = req.method.toUpperCase();

  try {
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        project_id: projectId,
        method: method,
        path: mockPath
      }
    });

    if (!endpoint) {
      res.status(404).json({ 
        error: 'Mock endpoint not found',
        method,
        path: mockPath,
        project_id: projectId
      });
      return;
    }

    // Return the configured mock response schema
    res.status(200).json(endpoint.response_schema || { message: "No mock response configured" });
  } catch (error) {
    next(error);
  }
};
