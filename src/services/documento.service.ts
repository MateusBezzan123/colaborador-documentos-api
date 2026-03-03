import { DocumentoRepository } from '../repositories/documento.repository';
import { ColaboradorTipoDocumentoRepository } from '../repositories/colaboradorTipoDocumento.repository';
import { IDocumento } from '../models/interfaces';
import { AppError } from '../middlewares/errorHandler';
import { documentoShema } from '../validations/schemas';

const documentoRepo = new DocumentoRepository();
const vinculoRepo = new ColaboradorTipoDocumentoRepository();

export class DocumentoService {
  async enviarDocumento(data: IDocumento) {
    const { error } = documentoShema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Verificar se o colaborador tem vínculo com este tipo de documento
    const vinculo = await vinculoRepo.findByColaboradorAndTipo(
      data.colaboradorId,
      data.tipoDocumentoId
    );

    if (!vinculo || vinculo.status !== 'ATIVO') {
      throw new AppError(
        'Colaborador não está vinculado a este tipo de documento ou vínculo está inativo',
        400
      );
    }

    // Enviar documento
    const documento = await documentoRepo.create(data, vinculo.id);

    return documento;
  }

  async listarPendentes(
    page: number = 1,
    limit: number = 10,
    filters?: {
      colaboradorId?: string;
      tipoDocumentoId?: string;
      dataInicio?: Date;
      dataFim?: Date;
    }
  ) {
    return documentoRepo.findPendentes(page, limit, filters);
  }

  async getHistorico(colaboradorId: string, tipoDocumentoId: string) {
    const historico = await documentoRepo.findHistorico(colaboradorId, tipoDocumentoId);

    if (!historico) {
      throw new AppError('Nenhum documento encontrado para este colaborador e tipo', 404);
    }

    return historico;
  }

  async getUltimosEnvios(limit: number = 10) {
    return documentoRepo.findUltimosEnvios(limit);
  }
}