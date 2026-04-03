# 🎯 Task Manager - Guia Rápido de Comandos

Referência rápida de comandos úteis para desenvolvimento e deployment.

## 🚀 Inicialização

### Primeira Setup
```bash
# Instalar dependências
npm install

# Setup do banco de dados
npx prisma migrate dev --name init

# Iniciar tudo com Docker
docker-compose up --build
```

### Reiniciar Serviços
```bash
# Parar tudo
docker-compose down

# Limpar volumes (CUIDADO: deleta dados!)
docker-compose down -v

# Iniciar novamente
docker-compose up
```

## 📦 Desenvolvimento

### Backend (NestJS)
```bash
# Ir para pasta backend
cd apps/backend

# Modo watch (auto-reload)
npm run start:dev

# Build para produção
npm run build

# Rodar tests
npm run test

# Rodar com coverage
npm run test:cov

# Gerar Prisma Client
npx prisma generate

# Ver schema do banco
npx prisma studio

# Criar migration
npx prisma migrate dev --name seu_nome_aqui

# Resetar banco (CUIDADO!)
npx prisma migrate reset
```

### Frontend (Next.js)
```bash
# Ir para pasta frontend
cd apps/frontend

# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🐳 Docker

### Comandos Úteis
```bash
# Ver containers rodando
docker-compose ps

# Ver logs
docker-compose logs -f              # Todos
docker-compose logs -f backend      # Backend específico
docker-compose logs -f frontend     # Frontend específico
docker-compose logs -f postgres     # Database específico

# Executar comando em container
docker-compose exec backend npm run build
docker-compose exec backend npx prisma migrate deploy

# Rebuild images
docker-compose up --build

# Limpar tudo
docker system prune -a
```

## 🗄️ Database

### Migrations
```bash
# Criar nova migration
npx prisma migrate dev --name sua_migration_name

# Deploy migrations (produção)
npx prisma migrate deploy

# Reset database (DEVELOPMENT ONLY)
npx prisma migrate reset

# Resetar seed
npx prisma db seed
```

### Inspection
```bash
# Abrir Prisma Studio (UI do banco)
npx prisma studio

# Ver schema em time real
npx prisma db push --skip-generate

# Validar schema
npx prisma validate
```

## 🔐 Segurança

### Gerar Secrets
```bash
# Gerar JWT_SECRET seguro
openssl rand -hex 32

# Gerar random token
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Usar script automatizado
./scripts/setup-railway.sh
```

### Verificar Segurança
```bash
# Checklist de dependências
npm audit

# Atualizar vulnerabilities
npm audit fix

# Verificar SSL/TLS
curl -I https://sua-url-aqui.railway.app
```

## 🚢 Deployment (Railway)

### Pré-deployment
```bash
# Validar tudo localmente
npm run lint
npm run type-check
npm run build

# Testar com Docker
docker-compose up --build

# Verificar APIs
curl http://localhost:3001/api/health
curl http://localhost:3000
```

### Deployment
```bash
# Fazer commit
git add .
git commit -m "Deploy para Railway"

# Push para GitHub (Railway decodifica)
git push origin main

# Monitorar build no Railway
# https://railway.app/dashboard -> seu projeto -> build logs
```

### Verificar Produção
```bash
# Checklist pós-deploy
curl https://seu-backend.railway.app/api/health
curl https://seu-backend.railway.app/api/docs
curl https://seu-frontend.railway.app

# Ver logs
# https://railway.app/dashboard -> seu projeto -> logs
```

## 🐛 Debugging

### Backend
```bash
# Ativar verbose logging
DEBUG=* npm run start:dev

# Debugger Node.js
node --inspect=0.0.0.0:9229 dist/main

# Conectar debugger VSCode
# Usar launch.json configurado
```

### Frontend
```bash
# Build analysis
npm run build -- --debug

# Next.js analytics
npm run dev -- --turbopack-graph

# Profiler React
# Usar React DevTools browser extension
```

### Database
```bash
# Conectar direto ao PostgreSQL
docker-compose exec postgres psql -U postgres -d task_manager

# Queries úteis no psql
\dt                    # Listar tabelas
SELECT * FROM "User";  # Ver usuários
SELECT * FROM "Task";  # Ver tarefas
\q                     # Sair
```

## 📊 Monitoramento

### Logs
```bash
# Todos os logs
docker-compose logs -f

# Filtrar por severity
docker-compose logs -f | grep ERROR
docker-compose logs -f | grep WARN

# Salvar logs em arquivo
docker-compose logs > logs.txt
```

### Performance
```bash
# Ver uso de recursos
docker stats

# Analisar build size
npm install -g webpack-bundle-analyzer
npm run build -- --analyze
```

## 🔄 CI/CD (GitHub)

### Workflows
- Automatic deployment on push to `main`
- Automatic tests on PR
- Automatic linting on PR

Ver `.github/workflows/` para configurações.

## 📚 Recursos Adicionais

- [RAILWAY.md](./RAILWAY.md) - Guia completo de deployment
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist step-by-step
- [README.md](./README.md) - Documentação principal
- [docker-compose.yml](./docker-compose.yml) - Configuração Docker

## 🆘 Emergency Commands

```bash
# Resetar tudo (cuidado!)
docker-compose down -v
docker system prune -a
docker-compose up --build

# Recuperar de erro de migration
npx prisma migrate resolve --rolled-back sua_migration_name
npx prisma migrate deploy

# Ver se está tudo bem
docker-compose ps
docker-compose logs | tail -50
curl http://localhost:3001/api/health
```

---

**Dica:** Salve este arquivo como bookmark para referência rápida!
