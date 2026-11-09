import { Router } from 'express';
import { getBuilds, saveBuild, deleteBuild } from '../controllers/buildsController.js';

const router = Router();

router.get('/', getBuilds);
router.post('/', saveBuild);
router.delete('/:id', deleteBuild);

export default router;
