import { Router } from 'express';
import { EstatisticaController } from '../controllers/estatistica.controller';

const router = Router();
const controller = new EstatisticaController();

router.get('/dashboard', controller.getDashboard);

export default router;