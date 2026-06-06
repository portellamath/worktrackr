# WorkTrackr

Backend SaaS multi-tenant para gestão de projetos e tarefas, construído com foco em segurança, isolamento de dados entre empresas e arquitetura pronta para produção.

A ideia principal não é apenas ter um CRUD funcional, mas projetar uma API que assume que desenvolvedores erram, tokens vazam e endpoints podem ser abusados — e ainda assim manter os dados de cada empresa isolados e protegidos.

---

# Visão Geral

O WorkTrackr é um backend B2B multi-tenant onde:

- Cada usuário pertence a uma empresa (*tenant*);
- Cada operação é sempre executada no contexto de uma empresa;
- Esquecer de filtrar por `companyId` não vaza dados de ninguém, porque o sistema não permite isso por design.

O objetivo do projeto é colocar em prática conceitos de:

- Multi-tenancy real (*enforced* em nível de acesso a dados);
- Autenticação e autorização em APIs;
- Arquitetura de backend com TypeScript;
- Segurança aplicada a sistemas SaaS.

---

# Stack

## Linguagem e Runtime

- Node.js
- TypeScript

## Backend

- Express
- Prisma ORM
- PostgreSQL

## Autenticação e Segurança

- JWT (Access Token + Refresh Token)
- Rate Limiting
- RBAC básico (Role-Based Access Control)
- Hash de senhas (bcrypt)

---

# Principais Decisões Técnicas

## 1. Multi-Tenancy Enforced na Query

Em vez de confiar que o desenvolvedor sempre lembrará de filtrar por empresa, o isolamento de dados é implementado como restrição de arquitetura.

- O `companyId` vem do token JWT;
- Toda operação de leitura/escrita no banco é feita no contexto da empresa;
- Sem `companyId` válido, não há acesso aos dados.

Isso reduz drasticamente o risco de:

- Vazamento de dados entre empresas;
- Endpoints que esquecem de aplicar filtros de tenant.

---

## 2. JWT Enxuto

Os tokens carregam apenas as informações necessárias:

- `userId`
- `companyId`
- `role`

Nada de dados sensíveis ou informações desnecessárias no payload.

O JWT funciona apenas como identificador de contexto, não como um "dump de usuário".

---

## 3. RBAC Básico

Cada usuário possui uma role dentro da empresa.

Exemplos:

- `ADMIN`
- `USER`

As regras de autorização permitem:

- Restringir ações administrativas;
- Separar responsabilidades por tipo de usuário.

O objetivo é implementar um modelo simples, porém próximo do que sistemas B2B utilizam na prática.

---

## 4. Hardening da Aplicação

Para lidar com abuso de endpoints e gerenciamento seguro de sessões:

- Rate Limiting;
- Refresh Tokens;
- Access Tokens com tempo de vida curto.

---

# Estrutura do Projeto

```txt
worktrackr/
├── api/
│   ├── src/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── prisma/
│   │   └── index.ts
│
├── package.json
├── tsconfig.json
└── ...
```

### Diretórios

| Diretório | Responsabilidade |
|------------|------------------|
| middlewares | Autenticação, contexto de usuário, rate limiting |
| routes | Definição das rotas HTTP |
| controllers | Orquestração dos casos de uso |
| prisma | Configuração do banco e schema |
| index.ts | Bootstrap da aplicação |

O foco inicial está no backend (`api/`). O frontend será desenvolvido posteriormente.

---

# Modelo de Dados

O multi-tenancy é modelado explicitamente no Prisma.

```prisma
model Company {
  id        String   @id @default(cuid())
  name      String
  users     User[]
  projects  Project[]
  createdAt DateTime @default(now())
}

model User {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  password   String
  role       String
  companyId  String

  company    Company @relation(
    fields: [companyId],
    references: [id]
  )

  createdAt DateTime @default(now())
}

model Project {
  id         String   @id @default(cuid())
  name       String
  companyId  String

  company    Company @relation(
    fields: [companyId],
    references: [id]
  )

  createdAt DateTime @default(now())
}
```

Todos os recursos importantes são vinculados a uma `Company`.

---

# Como Rodar o Projeto

## 1. Clonar o Repositório

```bash
git clone https://github.com/portellamath/worktrackr.git

cd worktrackr
```

## 2. Instalar Dependências

```bash
npm install
```

ou

```bash
pnpm install
```

---

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/worktrackr?schema=public"

JWT_ACCESS_SECRET="sua_chave_de_access_token"

JWT_REFRESH_SECRET="sua_chave_de_refresh_token"

PORT=3333
```

---

## 4. Executar as Migrations

```bash
npx prisma migrate dev
```

---

## 5. Iniciar o Servidor

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3333
```

---

# Endpoints

## Autenticação

### Criar usuário e empresa

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

Retorna:

- Access Token
- Refresh Token

### Renovar sessão

```http
POST /auth/refresh
```

---

## Projetos

### Listar projetos

```http
GET /projects
```

Lista apenas projetos da empresa do usuário autenticado.

### Criar projeto

```http
POST /projects
```

Cria projeto vinculado ao `companyId` do usuário.

### Buscar projeto

```http
GET /projects/:id
```

### Atualizar projeto

```http
PATCH /projects/:id
```

### Remover projeto

```http
DELETE /projects/:id
```

Todas as operações respeitam automaticamente o contexto do tenant.

---

# Roadmap

## Regras de Negócio

- Cálculo de progresso de projetos;
- Estados derivados;
- Fluxos de transição;
- Permissões mais granulares.

## Qualidade

- Testes unitários;
- Testes de integração;
- Cobertura automatizada.

## Documentação

- OpenAPI
- Swagger

## Observabilidade

- Logging estruturado;
- Tracking de requisições;
- Métricas.

## Frontend

Desenvolvimento do painel web multi-tenant para consumo da API.

---

# Motivação

Este projeto nasceu de uma preocupação prática:

Muitas APIs SaaS confiam excessivamente na disciplina do desenvolvedor para lembrar de aplicar filtros de tenant e regras de segurança.

Isso funciona até o dia em que alguém esquece.

O WorkTrackr trata multi-tenancy como uma restrição estrutural da arquitetura e não como um detalhe de implementação.

Objetivos:

- Construir uma API segura desde a fundação;
- Garantir isolamento entre empresas;
- Aplicar conceitos modernos de arquitetura backend;
- Simular desafios reais de sistemas B2B.

---

# Autor

## Matheus Portella

Desenvolvedor Full Stack em formação

Jovem Aprendiz de QA Automação na Topaz

- GitHub: https://github.com/portellamath
- LinkedIn: https://linkedin.com/in/matheus-portella-899481353