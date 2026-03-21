import { Router } from 'express';
import { handleMockRequest } from '../controllers/mockController.js';

const router = Router();

// Match any method and any subpath under the projectId
// The (*) is a named wildcard in some Express versions or index-based in others.
// We'll use the asterisk and handle it in the controller.
router.all('/:projectId/*', handleMockRequest as any);

export default router;
