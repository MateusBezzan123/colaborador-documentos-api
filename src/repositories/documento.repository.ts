import { Documento, Prisma } from '@prisma/client';
import { prisma } from '../database/prisma';
import { IDocumento } from '../models/interfaces';


export class DocumentoRepository {
  async create(data: IDocumento, colaboradorTipoDocumentoId: string): Promise<Documento> {
    const documentoAtivo = await prisma.documento.findFirst({
      where: {
        colaboradorId: data.colaboradorId,
        tipoDocumentoId: data.tipoDocumentoId,
        status: 'ATIVO'
      }
    });

    let versao = 1;

    if (documentoAtivo) {
      await prisma.documento.update({
        where: { id: documentoAtivo.id },
        data: { status: 'SUBSTITUIDO' }
      });

      await prisma.documentoVersao.create({
        data: {
          documentoId: documentoAtivo.id,
          versao: documentoAtivo.versao,
          dataEnvio: documentoAtivo.dataEnvio,
          arquivoNome: documentoAtivo.arquivoNome,
          arquivoTamanho: documentoAtivo.arquivoTamanho,
          mimeType: documentoAtivo.mimeType,
          observacao: documentoAtivo.observacao
        }
      });

      versao = documentoAtivo.versao + 1;
    }

    return prisma.documento.create({
      data: {
        colaboradorId: data.colaboradorId,
        tipoDocumentoId: data.tipoDocumentoId,
        colaboradorTipoDocumentoId,
        versao,
        arquivoNome: data.arquivoNome,
        arquivoTamanho: data.arquivoTamanho,
        mimeType: data.mimeType,
        observacao: data.observacao
      },
      include: {
        colaborador: true,
        tipoDocumento: true
      }
    });
  }

  async findPendentes(
    page: number = 1, 
    limit: number = 10, 
    filters?: {
      colaboradorId?: string;
      tipoDocumentoId?: string;
      dataInicio?: Date;
      dataFim?: Date;
    }
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.ColaboradorTipoDocumentoWhereInput = {
      status: 'ATIVO',
      colaborador: { deletedAt: null },
      tipoDocumento: { deletedAt: null },
      documentos: {
        none: {
          status: 'ATIVO'
        }
      }
    };

    if (filters?.colaboradorId) {
      where.colaboradorId = filters.colaboradorId;
    }

    if (filters?.tipoDocumentoId) {
      where.tipoDocumentoId = filters.tipoDocumentoId;
    }

    const [data, total] = await Promise.all([
      prisma.colaboradorTipoDocumento.findMany({
        where,
        skip,
        take: limit,
        include: {
          colaborador: true,
          tipoDocumento: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.colaboradorTipoDocumento.count({ where })
    ]);

    return { data, total };
  }

  async findUltimosEnvios(limit: number = 10): Promise<Documento[]> {
    return prisma.documento.findMany({
      where: {
        status: 'ATIVO'
      },
      take: limit,
      orderBy: {
        dataEnvio: 'desc'
      },
      include: {
        colaborador: true,
        tipoDocumento: true
      }
    });
  }

  async findHistorico(colaboradorId: string, tipoDocumentoId: string): Promise<any> {
    const documento = await prisma.documento.findFirst({
      where: {
        colaboradorId,
        tipoDocumentoId,
        status: 'ATIVO'
      },
      include: {
        versoesAnteriores: {
          orderBy: { versao: 'desc' }
        }
      }
    });

    if (!documento) return null;

    return {
      atual: documento,
      historico: documento.versoesAnteriores
    };
  }
}