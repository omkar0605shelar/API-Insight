import { Router } from 'express';
import { getRepos, getRepoDetail } from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.use(protect);
router.post('/repos', getRepos);
router.post('/repo', getRepoDetail);
export default router;
