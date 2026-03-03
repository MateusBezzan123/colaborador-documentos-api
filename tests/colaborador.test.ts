import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Colaborador Controller', () => {
  beforeAll(async () => {
    await prisma.documento.deleteMany();
    await prisma.colaboradorTipoDocumento.deleteMany();
    await prisma.colaborador.deleteMany();
    await prisma.tipoDocumento.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar um novo colaborador', async () => {
    const response = await request(app)
      .post('/api/colaboradores')
      .send({
        nome: 'João Silva',
        email: 'joao@email.com',
        cpf: '12345678901',
        dataNascimento: '1990-01-01',
        cargo: 'Desenvolvedor',
        departamento: 'TI'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('João Silva');
  });

  it('não deve criar colaborador com email duplicado', async () => {
    const response = await request(app)
      .post('/api/colaboradores')
      .send({
        nome: 'Maria Santos',
        email: 'joao@email.com',
        cpf: '98765432101',
        dataNascimento: '1992-02-02',
        cargo: 'Analista',
        departamento: 'RH'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email já cadastrado');
  });

  it('deve listar colaboradores com paginação', async () => {
    const response = await request(app)
      .get('/api/colaboradores?page=1&limit=10');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('total');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});