import { EstatisticaRepository } from '../repositories/estatistica.repository';

const estatisticaRepo = new EstatisticaRepository();

export class EstatisticaService {
  async getDashboard() {
    const [percentualCompleto, documentosPendentes, ultimosEnvios] = await Promise.all([
      estatisticaRepo.getPercentualDocumentacaoCompleta(),
      estatisticaRepo.getDocumentosMaisPendentes(),
      estatisticaRepo.getUltimosEnvios(10)
    ]);

    return {
      percentualDocumentacaoCompleta: Number(percentualCompleto.toFixed(2)),
      documentosMaisPendentes: documentosPendentes,
      ultimosEnvios
    };
  }
}