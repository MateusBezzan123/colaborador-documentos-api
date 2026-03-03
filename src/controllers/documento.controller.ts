import { Request, Response } from 'express';
import { DocumentoService } from '../services/documento.service';

const documentoService = new DocumentoService();

export class DocumentoController {
  async enviarDocumento(req: Request, res: Response) {
    const documento = await documentoService.enviarDocumento(req.body);
    res.status(201).json(documento);
  }

  async listarPendentes(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { colaboradorId, tipoDocumentoId, dataInicio, dataFim } = req.query;

    const filters: any = {};
    if (colaboradorId) filters.colaboradorId = colaboradorId as string;
    if (tipoDocumentoId) filters.tipoDocumentoId = tipoDocumentoId as string;
    if (dataInicio) filters.dataInicio = new Date(dataInicio as string);
    if (dataFim) filters.dataFim = new Date(dataFim as string);

    const result = await documentoService.listarPendentes(page, limit, filters);
    res.json(result);
  }

  async getHistorico(req: Request, res: Response) {
    const { colaboradorId, tipoDocumentoId } = req.params;
    const historico = await documentoService.getHistorico(colaboradorId, tipoDocumentoId);
    res.json(historico);
  }

  async getUltimosEnvios(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const envios = await documentoService.getUltimosEnvios(limit);
    res.json(envios);
  }
}