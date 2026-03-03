import { Router } from 'express';
import { DocumentoController } from '../controllers/documento.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { documentoShema } from '../validations/schemas';

const router = Router();
const controller = new DocumentoController();

router.post('/', validateRequest(documentoShema), controller.enviarDocumento);
router.get('/pendentes', controller.listarPendentes);
router.get('/ultimos-envios', controller.getUltimosEnvios);
router.get('/historico/:colaboradorId/:tipoDocumentoId', controller.getHistorico);

export default router;