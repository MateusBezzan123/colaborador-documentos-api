import { Request, Response } from 'express';
import { ColaboradorService } from '../services/colaborador.service';

const colaboradorService = new ColaboradorService();

export class ColaboradorController {
  async create(req: Request, res: Response) {
    const colaborador = await colaboradorService.create(req.body);
    res.status(201).json(colaborador);
  }

  async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { nome, departamento, cargo } = req.query;

    const filters: any = {};
    if (nome) filters.nome = { contains: nome, mode: 'insensitive' };
    if (departamento) filters.departamento = departamento;
    if (cargo) filters.cargo = { contains: cargo, mode: 'insensitive' };

    const result = await colaboradorService.findAll(page, limit, filters);
    res.json(result);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const colaborador = await colaboradorService.findById(id);
    res.json(colaborador);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const colaborador = await colaboradorService.update(id, req.body);
    res.json(colaborador);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await colaboradorService.delete(id);
    res.status(204).send();
  }

  async vincularTiposDocumento(req: Request, res: Response) {
    const { id } = req.params;
    const { tiposDocumentoIds } = req.body;

    if (!tiposDocumentoIds || !Array.isArray(tiposDocumentoIds)) {
      return res.status(400).json({ error: 'tiposDocumentoIds deve ser um array' });
    }

    const result = await colaboradorService.vincularTiposDocumento(id, tiposDocumentoIds);
    res.json(result);
  }

  async desvincularTipoDocumento(req: Request, res: Response) {
    const { id, tipoDocumentoId } = req.params;
    const result = await colaboradorService.desvincularTiposDocumento(id, tipoDocumentoId);
    res.json(result);
  }
}