import { Request, Response } from 'express';
import { EstatisticaService } from '../services/estatistica.service';

const estatisticaService = new EstatisticaService();

export class EstatisticaController {
  async getDashboard(req: Request, res: Response) {
    const dashboard = await estatisticaService.getDashboard();
    res.json(dashboard);
  }
}