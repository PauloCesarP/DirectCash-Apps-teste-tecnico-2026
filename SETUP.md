# Instruções Rápidas de Setup

## 🚀 Início Rápido (Desenvolvimento Local)

### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+ executando localmente

### Passos

1. **Clone e entre no diretório**
   ```bash
   cd /home/arthur/work/DirectAds
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure PostgreSQL**
   - Crie um banco de dados chamado `task_manager`
   - Configure o usuário e senha (padrão: user/password)

4. **Configure variáveis de ambiente**
   
   **Backend** (apps/backend/.env):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/task_manager"
   JWT_SECRET="sua-chave-secreta-aqui"
   JWT_EXPIRATION="7d"
   NODE_ENV="development"
   PORT=3001
   ```

   **Frontend** (apps/frontend/.env.local):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **Execute as migrações do Prisma**
   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   ```

6. **Inicie os servidores** (em terminais separados)
   ```bash
   # Terminal 1
   cd apps/backend
   npm run start:dev
   
   # Terminal 2
   cd apps/frontend
   npm run dev
   ```

7. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

---

## 🐳 Com Docker Compose

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos

1. **Copie o arquivo de exemplo**
   ```bash
   cp .env.example .env
   ```

2. **Inicie os serviços**
   ```bash
   docker-compose up -d
   ```

3. **Execute as migrações** (primeira vez apenas)
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

4. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Parar os serviços
```bash
docker-compose down
```

---

## 📱 Testando a Aplicação

1. Vá para http://localhost:3000
2. Clique em "Registrar" ou "Cadastro"
3. Preencha os dados (email, nome, senha)
4. Após registrar, você será redirecionado para o dashboard
5. Crie, edite, e delete tarefas

---

## 🔍 Dicas Úteis

- **Prisma Studio** (visualizar banco de dados):
  ```bash
  cd apps/backend
  npx prisma studio
  ```

- **Ver logs do Docker**:
  ```bash
  docker-compose logs -f
  ```

- **Resetar o banco de dados** (atenção! Perderá dados):
  ```bash
  cd apps/backend
  npx prisma migrate reset
  ```

---

## 📝 Variáveis de Ambiente

### Backend
- `DATABASE_URL` - URL de conexão PostgreSQL
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRATION` - Tempo de expiração (ex: 7d, 24h)
- `PORT` - Porta do servidor (padrão: 3001)
- `NODE_ENV` - development ou production

### Frontend
- `NEXT_PUBLIC_API_URL` - URL do backend

---

## 🆘 Troubleshooting

### Erro de conexão PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme DATABASE_URL está correta

### Porta 3000 ou 3001 já em uso
- Mude as portas nos .env files
- Ou feche outras aplicações usando essas portas

### Erro ao executar migrações
```bash
cd apps/backend
npx prisma migrate resolve --rolled-back init
npx prisma migrate dev --name init
```

---

**Pronto para desenvolver! 🎉**
