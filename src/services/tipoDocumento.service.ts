import { TipoDocumentoRepository } from '../repositories/tipoDocumento.repository';
import { ITipoDocumento } from '../models/interfaces';
import { AppError } from '../middlewares/errorHandler';
import { tipoDocumentoSchema } from '../validations/schemas';

const tipoDocumentoRepo = new TipoDocumentoRepository();

export class TipoDocumentoService {
  async create(data: ITipoDocumento) {
    const { error } = tipoDocumentoSchema.validate(data);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const nomeExists = await tipoDocumentoRepo.findByNome(data.nome);
    if (nomeExists) {
      throw new AppError('Tipo de documento já cadastrado', 400);
    }

    return tipoDocumentoRepo.create(data);
  }

  async findAll(includeInativos: boolean = false) {
    return tipoDocumentoRepo.findAll(includeInativos);
  }

  async findById(id: string) {
    const tipoDocumento = await tipoDocumentoRepo.findById(id);
    
    if (!tipoDocumento) {
      throw new AppError('Tipo de documento não encontrado', 404);
    }

    return tipoDocumento;
  }

  async update(id: string, data: Partial<ITipoDocumento>) {
    await this.findById(id);

    if (data.nome) {
      const nomeExists = await tipoDocumentoRepo.findByNome(data.nome);
      if (nomeExists && nomeExists.id !== id) {
        throw new AppError('Nome já cadastrado', 400);
      }
    }

    return tipoDocumentoRepo.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);
    return tipoDocumentoRepo.softDelete(id);
  }
}