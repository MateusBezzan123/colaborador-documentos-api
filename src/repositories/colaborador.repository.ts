import { PrismaClient, Colaborador } from '@prisma/client';
import { IColaborador } from '../models/interfaces';

const prisma = new PrismaClient();

export class ColaboradorRepository {
  async create(data: IColaborador): Promise<Colaborador> {
    return prisma.colaborador.create({
      data: {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        dataNascimento: data.dataNascimento,
        cargo: data.cargo,
        departamento: data.departamento
      }
    });
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Colaborador[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const where = {
      deletedAt: null,
      ...filters
    };

    const [data, total] = await Promise.all([
      prisma.colaborador.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nome: 'asc' },
        include: {
          vinculos: {
            where: { status: 'ATIVO' },
            include: { tipoDocumento: true }
          }
        }
      }),
      prisma.colaborador.count({ where })
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Colaborador | null> {
    return prisma.colaborador.findFirst({
      where: { id, deletedAt: null },
      include: {
        vinculos: {
          where: { status: 'ATIVO' },
          include: { tipoDocumento: true }
        },
        documentos: {
          where: { status: 'ATIVO' },
          orderBy: { dataEnvio: 'desc' }
        }
      }
    });
  }

  async update(id: string, data: Partial<IColaborador>): Promise<Colaborador> {
    return prisma.colaborador.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string): Promise<Colaborador> {
    return prisma.colaborador.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async findByEmail(email: string): Promise<Colaborador | null> {
    return prisma.colaborador.findFirst({
      where: { email, deletedAt: null }
    });
  }

  async findByCPF(cpf: string): Promise<Colaborador | null> {
    return prisma.colaborador.findFirst({
      where: { cpf, deletedAt: null }
    });
  }
}