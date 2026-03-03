import { prisma } from '../database/prisma';

export class EstatisticaRepository {
  async getPercentualDocumentacaoCompleta(): Promise<number> {
    const colaboradoresAtivos = await prisma.colaborador.count({
      where: { deletedAt: null }
    });

    if (colaboradoresAtivos === 0) return 0;

    const vinculosAtivos = await prisma.colaboradorTipoDocumento.groupBy({
      by: ['colaboradorId'],
      where: {
        status: 'ATIVO',
        colaborador: { deletedAt: null }
      },
      _count: {
        _all: true
      }
    });

    const colaboradoresCompletos = await prisma.colaborador.count({
      where: {
        deletedAt: null,
        vinculos: {
          every: {
            status: 'ATIVO',
            documentos: {
              some: {
                status: 'ATIVO'
              }
            }
          }
        }
      }
    });

    return (colaboradoresCompletos / colaboradoresAtivos) * 100;
  }

  async getDocumentosMaisPendentes(limit: number = 5): Promise<
    {
      id: string;
      nome: string;
      quantidade_pendente: number;
    }[]
  > {
    const result = await prisma.$queryRaw<
      {
        id: string;
        nome: string;
        quantidade_pendente: bigint;
      }[]
    >`
    SELECT 
      td.id,
      td.nome,
      COUNT(ctd.id) as quantidade_pendente
    FROM "TipoDocumento" td
    INNER JOIN "ColaboradorTipoDocumento" ctd ON td.id = ctd."tipoDocumentoId"
    WHERE 
      td."deletedAt" IS NULL
      AND ctd.status = 'ATIVO'
      AND NOT EXISTS (
        SELECT 1 FROM "Documento" d 
        WHERE d."colaboradorTipoDocumentoId" = ctd.id 
        AND d.status = 'ATIVO'
      )
    GROUP BY td.id, td.nome
    ORDER BY quantidade_pendente DESC
    LIMIT ${limit}
  `;

    return result.map(item => ({
      ...item,
      quantidade_pendente: Number(item.quantidade_pendente)
    }));
  }

  async getUltimosEnvios(limit: number = 10): Promise<any[]> {
    return prisma.documento.findMany({
      where: { status: 'ATIVO' },
      take: limit,
      orderBy: { dataEnvio: 'desc' },
      include: {
        colaborador: {
          select: { nome: true, email: true }
        },
        tipoDocumento: {
          select: { nome: true }
        }
      }
    });
  }
}