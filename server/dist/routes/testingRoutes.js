import express from 'express';
import { executeRequest, getRequestHistory } from '../controllers/testingController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
// Apply protect middleware to all testing routes
router.use(protect);
router.post('/execute', executeRequest);
router.get('/history/:endpointId', getRequestHistory);
export default router;
