# 📋 Task Manager - Checklist para Deployment no Railway

Use este checklist para garantir que o deployment será feito com sucesso.

## ✅ Pré-requisitos

- [ ] Conta criada em [Railway.app](https://railway.app)
- [ ] GitHub conectado ao Railway
- [ ] Repositório pushed para GitHub com o código
- [ ] Você tem acesso ao terminal/bash

## 🔐 Geração de Secrets

### 1. Gerar JWT_SECRET
```bash
# Execute este comando em seu terminal:
openssl rand -hex 32
```
- [ ] JWT_SECRET gerado e copiado
- [ ] JWT_SECRET tem 64 caracteres hexadecimais

**Alternativa automatizada:**
```bash
./scripts/setup-railway.sh
```

## 🚀 Configuração no Railway

### 2. Criar Novo Projeto
- [ ] Projeto criado no Railway dashboard
- [ ] Nome: "task-manager" (ou similar)
- [ ] Conectado ao repositório correto

### 3. Configurar PostgreSQL
- [ ] Novo "Postgres" service adicionado
- [ ] Railway gerou automaticamente DATABASE_URL
- [ ] DATABASE_URL copiado (será usada no backend)

### 4. Configurar Backend (NestJS)

#### Service Setup
- [ ] Novo "Web Service" criado
- [ ] Conectado ao repositório GitHub
- [ ] Branch configurado: `main` ou `develop`

#### Build Configuration
- [ ] Root Directory: `.` (raiz do monorepo)
- [ ] Dockerfile: `./apps/backend/Dockerfile`
- [ ] Start Command: `node dist/main`

#### Environment Variables
Configure as seguintes variáveis no Railway dashboard:

```
DATABASE_URL=postgresql://postgres:**PASSWORD**@localhost:5432/task_manager
JWT_SECRET=**COPIE_O_VALOR_GERADO_ACIMA**
JWT_EXPIRATION=7d
NODE_ENV=production
PORT=3001
```

- [ ] DATABASE_URL configurada (do Postgres service)
- [ ] JWT_SECRET configurado (gerado acima)
- [ ] JWT_EXPIRATION = 7d
- [ ] NODE_ENV = production
- [ ] PORT = 3001

#### Conectar Banco de Dados
- [ ] Backend service linkeado ao PostgreSQL service
- [ ] "Variables" do Postgres automáticamente injetadas no backend

### 5. Configurar Frontend (Next.js)

#### Service Setup
- [ ] Novo "Web Service" criado para frontend
- [ ] Conectado ao repositório GitHub
- [ ] Branch configurado: `main` ou `develop`

#### Build Configuration
- [ ] Root Directory: `.` (raiz do monorepo)
- [ ] Dockerfile: `./apps/frontend/Dockerfile`
- [ ] Start Command: `npm start` ou `next start`

#### Environment Variables
Configure a seguinte variável:

```
NEXT_PUBLIC_API_URL=https://**BACKEND_URL**.railway.app
```

**Onde BACKEND_URL é:**
- Copie a URL do seu backend service no Railway
- Formato: `https://seu-backend-abc123.railway.app`

- [ ] NEXT_PUBLIC_API_URL configurada corretamente
- [ ] URL não tem `/` no final
- [ ] URL usa HTTPS

## 🧪 Testes Pós-Deployment

### 6. Verificar Backend
- [ ] Health check: `curl https://backend-url/api/health`
- [ ] Swagger docs acessível: `https://backend-url/api/docs`
- [ ] Documentação renderiza corretamente

### 7. Testar Fluxo Completo
- [ ] Frontend carrega: `https://frontend-url`
- [ ] Página de login renderiza
- [ ] Pode fazer registro de novo usuário
- [ ] Pode fazer login
- [ ] Pode criar tarefa após login
- [ ] Pode ver tarefas no dashboard

### 8. Verificar Logs
- [ ] Sem erros no backend logs
- [ ] Sem erros no frontend logs
- [ ] Database migrations executaram
- [ ] API responding normalmente

## 🔍 Troubleshooting

Se algo não funcionar, consulte: [RAILWAY.md - Troubleshooting](./RAILWAY.md#troubleshooting)

### Problemas Comuns

**❌ 500 Error no Backend**
- [ ] Verificar JWT_SECRET está configurado
- [ ] Verificar DATABASE_URL está correto
- [ ] Verificar migrations rodaram: `npx prisma migrate deploy`

**❌ Frontend não conecta ao API**
- [ ] Verificar NEXT_PUBLIC_API_URL está correto
- [ ] Confirmar URL não tem `localhost`
- [ ] Confirmar URL usa HTTPS

**❌ Database não conecta**
- [ ] DATABASE_URL automática do Postgres service?
- [ ] Postgres service linkado ao backend?
- [ ] Ver logs do Postgres service

## 📞 Suporte

Recursos úteis:
- [Railway Docs](https://docs.railway.app)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## ✨ Próximas Melhorias (Opcional)

Após deployment bem-sucedido:

- [ ] Configurar domínio customizado
- [ ] Ativar auto-deployments na atualização de branches
- [ ] Configurar backup automático do database
- [ ] Configurar monitoring e alertas
- [ ] Adicionar custom healthcheck
- [ ] Containerizar com Redis cache
- [ ] Configurar CDN para frontend

---

**Última atualização:** 2024
**Status:** Production Ready ✅
