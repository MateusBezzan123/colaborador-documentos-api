import { Router } from 'express';
import { ColaboradorController } from '../controllers/colaborador.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { colaboradorSchema } from '../validations/schemas';
import { parseDateFields } from '../middlewares/dateParser';

const router = Router();
const controller = new ColaboradorController();

router.post(
  '/', 
  parseDateFields(['dataNascimento']),
  validateRequest(colaboradorSchema), 
  controller.create
);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.put(
  '/:id', 
  parseDateFields(['dataNascimento']),
  validateRequest(colaboradorSchema), 
  controller.update
);
router.delete('/:id', controller.delete);


router.post('/:id/tipos-documento', controller.vincularTiposDocumento);
router.delete('/:id/tipos-documento/:tipoDocumentoId', controller.desvincularTipoDocumento);

export default router;