import { Request, Response } from 'express';
import { TipoDocumentoService } from '../services/tipoDocumento.service';

const tipoDocumentoService = new TipoDocumentoService();

export class TipoDocumentoController {
  async create(req: Request, res: Response) {
    const tipoDocumento = await tipoDocumentoService.create(req.body);
    res.status(201).json(tipoDocumento);
  }

  async findAll(req: Request, res: Response) {
    const includeInativos = req.query.includeInativos === 'true';
    const tipos = await tipoDocumentoService.findAll(includeInativos);
    res.json(tipos);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const tipoDocumento = await tipoDocumentoService.findById(id);
    res.json(tipoDocumento);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const tipoDocumento = await tipoDocumentoService.update(id, req.body);
    res.json(tipoDocumento);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await tipoDocumentoService.delete(id);
    res.status(204).send();
  }
}