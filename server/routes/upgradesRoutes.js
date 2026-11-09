import { Router } from 'express';
import { getUpgrades } from '../controllers/upgradesController.js';

const router = Router();

router.get('/', getUpgrades);

export default router;
