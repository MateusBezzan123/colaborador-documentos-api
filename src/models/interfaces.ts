export interface IColaborador {
  id?: string;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: Date;
  cargo: string;
  departamento: string;
}

export interface ITipoDocumento {
  id?: string;
  nome: string;
  descricao?: string;
  obrigatorio: boolean;
}

export interface IDocumento {
  id?: string;
  colaboradorId: string;
  tipoDocumentoId: string;
  arquivoNome: string;
  arquivoTamanho: number;
  mimeType: string;
  observacao?: string;
}