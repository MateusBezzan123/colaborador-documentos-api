import { Router } from 'express';
import colaboradorRoutes from './colaborador.routes';
import tipoDocumentoRoutes from './tipoDocumento.routes';
import documentoRoutes from './documento.routes';
import estatisticaRoutes from './estatistica.routes';

const router = Router();

router.use('/colaboradores', colaboradorRoutes);
router.use('/tipos-documento', tipoDocumentoRoutes);
router.use('/documentos', documentoRoutes);
router.use('/estatisticas', estatisticaRoutes);

export default router;