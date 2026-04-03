# 🚀 Setup Local (Sem Docker)

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ rodando localmente
- npm ou yarn

## 1. Instale as dependências

```bash
cd /home/arthur/work/DirectAds

# Instalar dependências do monorepo
npm install

# Ou instalar cada parte separadamente
cd apps/backend && npm install
cd ../frontend && npm install
```

## 2. Configure PostgreSQL

Crie um banco de dados chamado `task_manager`:

```bash
# No PostgreSQL
psql -U postgres
CREATE DATABASE task_manager;
\q
```

## 3. Configure variáveis de ambiente

### Backend (`apps/backend/.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRATION="7d"
NODE_ENV="development"
PORT=3001
```

### Frontend (`apps/frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 4. Execute as migrações do Prisma

```bash
cd apps/backend

# Gere o schema
npx prisma generate

# Execute as migrações
npx prisma migrate dev --name init

# (Opcional) Ver o banco de dados
npx prisma studio
```

## 5. Inicie os servidores

### Terminal 1 - Backend

```bash
cd apps/backend
npm run start:dev
```

Você verá:
```
[Nest] 1234  - 04/01/2026, 3:46:33 PM     LOG [NestFactory] Starting Nest application...
[Nest] 1234  - 04/01/2026, 3:46:34 PM     LOG [InstanceLoader] AuthModule dependencies initialized +45ms
...
Application is running on: http://localhost:3001
```

### Terminal 2 - Frontend

```bash
cd apps/frontend
npm run dev
```

Você verá:
```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
```

## 6. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555 (quando `npx prisma studio`)

## 7. Testes

```bash
# Backend
cd apps/backend
npm test

# Frontend
cd apps/frontend  
npm test
```

## Troubleshoot

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confirme DATABASE_URL em `.env`

```bash
# Teste conexão
psql -U postgres -d task_manager -c "SELECT 1"
```

### Porta 3000/3001 já em uso
- Mude em `.env` ou feche outras aplicações

### Timeout nas migrações
```bash
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev --name init
```

---

**Pronto para desenvolver! 🎉**
