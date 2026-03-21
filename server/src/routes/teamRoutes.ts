import { Router } from 'express';
import { createTeam, inviteMember, getMyTeams, getTeamDetails } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

const router = Router();

router.use(protect as any);

router.post('/', createTeam as any);
router.post('/invite', authorize(['ADMIN']), inviteMember as any);
router.get('/', getMyTeams as any);
router.get('/:teamId', getTeamDetails as any);

export default router;
