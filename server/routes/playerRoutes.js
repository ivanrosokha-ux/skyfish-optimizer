import { Router } from 'express';
import { getPlayerProfile } from '../controllers/playerController.js';

const router = Router();

router.get('/:nickname', getPlayerProfile);

export default router;
