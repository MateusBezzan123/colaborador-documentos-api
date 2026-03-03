import { ColaboradorRepository } from '../repositories/colaborador.repository';
import { ColaboradorTipoDocumentoRepository } from '../repositories/colaboradorTipoDocumento.repository';
import { IColaborador } from '../models/interfaces';
import { AppError } from '../middlewares/errorHandler';
import { colaboradorSchema } from '../validations/schemas';

const colaboradorRepo = new ColaboradorRepository();
const vinculoRepo = new ColaboradorTipoDocumentoRepository();

export class ColaboradorService {
async create(data: IColaborador) {
    const { error } = colaboradorSchema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const emailExists = await colaboradorRepo.findByEmail(data.email);
    if (emailExists) {
      throw new AppError('Email já cadastrado', 400);
    }

    const cpfExists = await colaboradorRepo.findByCPF(data.cpf);
    if (cpfExists) {
      throw new AppError('CPF já cadastrado', 400);
    }

    let dataNascimento: Date;
    
    if (typeof data.dataNascimento === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.dataNascimento)) {
        dataNascimento = new Date(data.dataNascimento + 'T12:00:00Z');
      } else {
        dataNascimento = new Date(data.dataNascimento);
      }
    } else if (data.dataNascimento instanceof Date) {
      dataNascimento = data.dataNascimento;
    } else {
      throw new AppError('Formato de data inválido', 400);
    }

    if (isNaN(dataNascimento.getTime())) {
      throw new AppError('Data de nascimento inválida', 400);
    }

    console.log('Data convertida:', dataNascimento);
    const colaboradorData = {
      ...data,
      dataNascimento
    };

    const colaborador = await colaboradorRepo.create(colaboradorData);

    return colaborador;
  }

  async findAll(page: number, limit: number, filters?: any) {
    return colaboradorRepo.findAll(page, limit, filters);
  }

  async findById(id: string) {
    const colaborador = await colaboradorRepo.findById(id);
    
    if (!colaborador) {
      throw new AppError('Colaborador não encontrado', 404);
    }

    return colaborador;
  }

  async update(id: string, data: Partial<IColaborador>) {
    const colaborador = await this.findById(id);

    if (data.email && data.email !== colaborador.email) {
      const emailExists = await colaboradorRepo.findByEmail(data.email);
      if (emailExists) {
        throw new AppError('Email já cadastrado', 400);
      }
    }

    if (data.cpf && data.cpf !== colaborador.cpf) {
      const cpfExists = await colaboradorRepo.findByCPF(data.cpf);
      if (cpfExists) {
        throw new AppError('CPF já cadastrado', 400);
      }
    }

    return colaboradorRepo.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return colaboradorRepo.softDelete(id);
  }

  async vincularTiposDocumento(colaboradorId: string, tiposDocumentoIds: string[]) {
    const colaborador = await this.findById(colaboradorId);

    const quantidadeVinculada = await vinculoRepo.createMany(colaboradorId, tiposDocumentoIds);

    return {
      message: `${quantidadeVinculada} tipos de documento vinculados com sucesso`,
      quantidade: quantidadeVinculada
    };
  }

  async desvincularTiposDocumento(colaboradorId: string, tipoDocumentoId: string) {
    const vinculo = await vinculoRepo.findByColaboradorAndTipo(colaboradorId, tipoDocumentoId);

    if (!vinculo) {
      throw new AppError('Vínculo não encontrado', 404);
    }

    await vinculoRepo.removeVinculo(vinculo.id);

    return { message: 'Vínculo removido com sucesso' };
  }
}