import { ColaboradorTipoDocumento } from '@prisma/client';
import { prisma } from '../database/prisma';

export class ColaboradorTipoDocumentoRepository {
  async create(colaboradorId: string, tipoDocumentoId: string): Promise<ColaboradorTipoDocumento> {
    return prisma.colaboradorTipoDocumento.create({
      data: {
        colaboradorId,
        tipoDocumentoId
      }
    });
  }

  async createMany(colaboradorId: string, tiposDocumentoIds: string[]): Promise<number> {
    const data = tiposDocumentoIds.map(tipoDocumentoId => ({
      colaboradorId,
      tipoDocumentoId
    }));

    const result = await prisma.colaboradorTipoDocumento.createMany({
      data,
      skipDuplicates: true
    });

    return result.count;
  }

  async findByColaborador(colaboradorId: string): Promise<ColaboradorTipoDocumento[]> {
    return prisma.colaboradorTipoDocumento.findMany({
      where: { 
        colaboradorId,
        status: 'ATIVO'
      },
      include: {
        tipoDocumento: true
      }
    });
  }

  async findById(id: string): Promise<ColaboradorTipoDocumento | null> {
    return prisma.colaboradorTipoDocumento.findUnique({
      where: { id },
      include: {
        tipoDocumento: true,
        colaborador: true
      }
    });
  }

  async findByColaboradorAndTipo(colaboradorId: string, tipoDocumentoId: string): Promise<ColaboradorTipoDocumento | null> {
    return prisma.colaboradorTipoDocumento.findUnique({
      where: {
        colaboradorId_tipoDocumentoId: {
          colaboradorId,
          tipoDocumentoId
        }
      }
    });
  }

  async removeVinculo(id: string): Promise<ColaboradorTipoDocumento> {
    return prisma.colaboradorTipoDocumento.update({
      where: { id },
      data: { status: 'INATIVO' }
    });
  }

  async reativarVinculo(id: string): Promise<ColaboradorTipoDocumento> {
    return prisma.colaboradorTipoDocumento.update({
      where: { id },
      data: { status: 'ATIVO' }
    });
  }
}