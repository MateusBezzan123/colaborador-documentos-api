import { PrismaClient, TipoDocumento } from '@prisma/client';
import { ITipoDocumento } from '../models/interfaces';

const prisma = new PrismaClient();

export class TipoDocumentoRepository {
  async create(data: ITipoDocumento): Promise<TipoDocumento> {
    return prisma.tipoDocumento.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        obrigatorio: data.obrigatorio
      }
    });
  }

  async findAll(includeInativos: boolean = false): Promise<TipoDocumento[]> {
    const where = includeInativos ? {} : { deletedAt: null };
    
    return prisma.tipoDocumento.findMany({
      where,
      orderBy: { nome: 'asc' }
    });
  }

  async findById(id: string): Promise<TipoDocumento | null> {
    return prisma.tipoDocumento.findFirst({
      where: { id, deletedAt: null }
    });
  }

  async findByNome(nome: string): Promise<TipoDocumento | null> {
    return prisma.tipoDocumento.findFirst({
      where: { nome, deletedAt: null }
    });
  }

  async update(id: string, data: Partial<ITipoDocumento>): Promise<TipoDocumento> {
    return prisma.tipoDocumento.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<TipoDocumento> {
    return prisma.tipoDocumento.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}