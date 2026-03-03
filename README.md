# API de Gerenciamento de Documentação de Colaboradores

API RESTful para gerenciar o fluxo de documentação de colaboradores, permitindo cadastro, vinculação de documentos, envio e acompanhamento de pendências.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Jest (testes)

## Funcionalidades

- ✅ CRUD de Colaboradores (com soft delete)
- ✅ CRUD de Tipos de Documento (com soft delete)
- ✅ Vinculação/Desvinculação de colaboradores a tipos de documento
- ✅ Envio de documentos com versionamento
- ✅ Listagem de documentos pendentes com paginação e filtros
- ✅ Estatísticas gerais (percentual completo, documentos mais pendentes, últimos envios)
- ✅ Histórico de versões de documentos

## Requisitos Atendidos

- Versionamento de documentos com histórico
- Operações atômicas (vinculação + criação de pendências)
- Soft delete em todas as entidades
- Tratamento de erros consistente
- Testes automatizados

