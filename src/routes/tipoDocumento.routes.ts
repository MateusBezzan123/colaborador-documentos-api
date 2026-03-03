import { Router } from 'express';
import { TipoDocumentoController } from '../controllers/tipoDocumento.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { tipoDocumentoSchema } from '../validations/schemas';

const router = Router();
const controller = new TipoDocumentoController();

router.post('/', validateRequest(tipoDocumentoSchema), controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put('/:id', validateRequest(tipoDocumentoSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;