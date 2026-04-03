# Task Manager







































































































































**Data: 2024****Status: Production Ready com Deploy Guide****Primeira Release Estável: v1.0.0**---Ver [FEATURES.md](./FEATURES.md) para features planejadas.### RoadmapVer [CONVENTIONS.md](./CONVENTIONS.md) para padrões de desenvolvimento.### ContribuindoPara próximas versões, siga este arquivo para tracked mudanças.### Como Atualizar## Notas de Versão---- Tudo containerizado- Secrets generator incluído- Deployment guide criado- Documentação completa- Código testado e funcionando### 📍 Status: Production Ready ✅- Ready for production on Railway- Automatic migrations on startup- DATABASE_URL format (Railway compatible)- Environment variables externalizadas- Railway.json configurado### 🚀 Deployment```- Multi-stage builds- Railway-compatible config- Docker & Docker ComposeDevOps:- Tailwind CSS- Axios- Zustand- TypeScript- React 18- Next.js 14.2.35Frontend:- bcryptjs- @nestjs/swagger- @nestjs/jwt- PostgreSQL 16- Prisma 5.8.0- NestJS 10.2.18Backend:```### 📦 Stack Técnico- ✅ Authentication: JWT flow working- ✅ Docker: Todos 3 containers rodando- ✅ Database: Migrations e dados persistindo- ✅ API: Swagger docs acessível- ✅ Frontend: Página carrega corretamente- ✅ Backend: Curl tests passando#### 🧪 Testado e Verificado- Docker multi-stage builds- Prisma database migrations- Swagger documentation server- API Health check endpoint- CORS habilitado- Password hashing com bcrypt- JWT Authentication com tokens#### 🔧 Configurado  - Environment variables externalizadas  - Docker images otimizadas  - GitHub workflows (automático com Railway)- **CI/CD Ready**  - setup-railway.sh - Gerador de JWT_SECRET e instruções- **Scripts**  - .env.production.example - Template de produção  - .env.example - Template de variáveis  - DOCS.md - Índice de documentação  - FEATURES.md - Status de features  - QUICK_REFERENCE.md - Referência de comandos  - DEPLOYMENT_CHECKLIST.md - Checklist para produção  - RAILWAY.md - Guia de deployment Railway  - CONVENTIONS.md - Convenções de código  - SETUP.md - Configuração inicial  - LOCAL_SETUP.md - Setup local passo-a-passo  - README.md - Documentação principal- **Documentação**  - Migrations automáticas via Prisma  - Relacionamento User <-> Task  - Task table com title, description, status, priority, dueDate  - User table com email, name, password- **Database (PostgreSQL)**  - Componentes reutilizáveis (TaskForm, TaskList, etc)  - Tailwind CSS para styling  - Axios com interceptador de Bearer token  - Zustand para state management (manual localStorage)  - Dashboard (/dashboard) com task list  - Register page (/auth/register)  - Login page (/auth/login)  - App Router com páginas estruturadas- **Frontend (Next.js)**  - Database migrations automáticas  - Swagger/OpenAPI documentação  - Prisma ORM integrado  - JwtAuthGuard para proteger rotas  - UsersController com gerenciamento de perfil  - TasksController com CRUD completo (GET, POST, PUT, DELETE)  - AuthController com endpoints register e login- **Backend (NestJS)**  - ESLint e Prettier configurados  - TypeScript strict mode em ambos frontend e backend  - Docker Compose com 3 serviços (backend, frontend, postgres)  - Monorepo com workspaces (backend + frontend)- **Project Setup**#### ✨ Adicionado### 🎉 Release Inicial - Completo e Pronto para Produção## [1.0.0] - 2024 - Production ReadyHistórico de mudanças e melhorias do projeto Task Manager.Um gerenciador de tarefas moderno e intuitivo construído com a stack mais moderna de desenvolvimento web.

> 📚 **Procurando documentação?** Consulte o [Índice de Documentação (DOCS.md)](./DOCS.md) para encontrar rapidamente o que precisa!

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Tokens)

## ✨ Funcionalidades

- ✅ Autenticação de usuários (Registro e Login)
- ✅ CRUD completo de tarefas
- ✅ Filtros por status (Por Fazer, Em Progresso, Completo)
- ✅ Prioridades de tarefas (Baixa, Média, Alta)
- ✅ Datas de vencimento
- ✅ Interface responsiva e moderna
- ✅ Autenticação segura com JWT

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- PostgreSQL 14+
- Docker & Docker Compose (opcional)

## 🛠️ Instalação Local

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd DirectAds
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

#### Backend (apps/backend/.env):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRATION="7d"
NODE_ENV="development"
PORT=3001
```

#### Frontend (apps/frontend/.env.local):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Configure o banco de dados

```bash
# Navegue até a pasta do backend
cd apps/backend

# Execute as migrações do Prisma
npx prisma migrate dev --name init

# Gere o cliente Prisma
npx prisma generate
```

### 5. Inicie os servidores

Em terminais separados:

```bash
# Terminal 1 - Backend
cd apps/backend
npm run start:dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🐳 Com Docker Compose

### 1. Configure o arquivo `.env` na raiz:

```env
DB_USER=user
DB_PASSWORD=password
DB_NAME=task_manager
DB_PORT=5432
JWT_SECRET=sua-chave-secreta-aqui
```

### 2. Inicie os serviços:

```bash
docker-compose up -d
```

### 3. Configure o banco de dados:

```bash
docker-compose exec backend npx prisma migrate deploy
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Estrutura do Projeto

```
DirectAds/
├── apps/
│   ├── backend/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/         # Autenticação (Login/Registro)
│   │   │   ├── tasks/        # Gerenciamento de tarefas
│   │   │   ├── users/        # Gerenciamento de usuários
│   │   │   ├── prisma/       # Configuração do Prisma
│   │   │   └── main.ts       # Entrada da aplicação
│   │   ├── prisma/
│   │   │   └── schema.prisma # Schema do banco de dados
│   │   └── package.json
│   │
│   └── frontend/             # Next.js Frontend
│       ├── src/
│       │   ├── app/          # App Router pages
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── lib/          # Funções utilitárias e store
│       │   └── styles/       # Estilos globais
│       └── package.json
│
└── docker-compose.yml        # Configuração Docker
```

## 🔌 API Endpoints

### Autenticação

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

### Tarefas

- `GET /tasks` - Listar tarefas do usuário (com filtros opcionais)
- `POST /tasks` - Criar uma nova tarefa
- `GET /tasks/:id` - Obter detalhes de uma tarefa
- `PUT /tasks/:id` - Atualizar uma tarefa
- `DELETE /tasks/:id` - Deletar uma tarefa

### Usuários

- `GET /users/me` - Obter perfil do usuário autenticado
- `PUT /users/me` - Atualizar perfil do usuário

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, o token é armazenado no localStorage e incluído em cada requisição.

## 📚 Scripts Disponíveis

### Backend

```bash
npm run start:dev      # Inicia o servidor em modo de desenvolvimento
npm run build          # Constrói o projeto
npm run start:prod     # Inicia o servidor em produção
npm run lint           # Executa o linter
npm run test           # Executa os testes
```

### Frontend

```bash
npm run dev            # Inicia o servidor de desenvolvimento
npm run build          # Faz o build da aplicação
npm run start          # Inicia o servidor de produção
npm run lint           # Executa o linter
```

## 🧪 Testes

```bash
# Backend
cd apps/backend
npm test

# Frontend
cd apps/frontend
npm test
```

## 📦 Deploy

### Deploy no Railway (Recomendado para Full Stack)

Para um guia completo de deployment em produção, consulte [RAILWAY.md](./RAILWAY.md).

1. Crie uma conta em [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente necessárias
4. Railway fará deploy automático a cada push

**Variáveis de ambiente necessárias:**
- `DATABASE_URL` - Fornecida automaticamente pelo PostgreSQL service
- `JWT_SECRET` - Gere com: `openssl rand -hex 32`
- `NEXT_PUBLIC_API_URL` - URL do seu backend no Railway

### Deploy no Vercel (Frontend)

```bash
vercel --cwd=apps/frontend
```

### Deploy Manual do Backend (Render, AWS, etc.)

1. Configure as variáveis de ambiente no seu provedor
2. Use o comando de build: `npm run build`
3. Use o comando de start: `npm run start:prod`

## 📚 Documentação

### Guias Disponíveis

- **[RAILWAY.md](./RAILWAY.md)** - Guia completo de deployment no Railway (Full Stack)
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist passo-a-passo para deployment
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Referência rápida de comandos úteis
- **[API Swagger](http://localhost:3001/api/docs)** - Documentação interativa da API (quando rodando localmente)

### Ferramentas de Produção

Gerador automático de configurações seguras:

```bash
./scripts/setup-railway.sh
```

Este script gera um JWT_SECRET seguro e fornece instruções passo-a-passo para deployment.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Se encontrar problemas, abra uma issue no repositório.

## 🔄 Próximas Melhorias

- [ ] Autenticação com Google/GitHub
- [ ] Dark mode
- [ ] Exportar tarefas (PDF, CSV)
- [ ] Notificações de tarefas vencidas
- [ ] Categorias/Labels para tarefas
- [ ] Colaboração em tarefas
- [ ] Integração com calendário
- [ ] Mobile app

---

**Desenvolvido com ❤️**
