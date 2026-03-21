import { Router } from 'express';
import { getRepos, getRepoDetail } from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect as any);

router.post('/repos', getRepos as any);
router.post('/repo', getRepoDetail as any);

export default router;
