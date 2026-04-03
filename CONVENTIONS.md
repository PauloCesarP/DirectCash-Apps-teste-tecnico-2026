# Convenções do Projeto

## 📁 Estrutura de Pastas

```
apps/backend/
├── src/
│   ├── auth/          # Autenticação
│   ├── users/         # Usuários
│   ├── tasks/         # Tarefas
│   ├── prisma/        # Integração Prisma
│   ├── app.module.ts  # Módulo raiz
│   └── main.ts        # Entrada da aplicação
├── prisma/            # Configuração Prisma
└── test/              # Testes

apps/frontend/
├── src/
│   ├── app/           # App Router (páginas)
│   ├── components/    # Componentes reutilizáveis
│   ├── lib/           # Utilitários e store
│   ├── styles/        # Estilos globais
│   └── types/         # TypeScript types (se necessário)
├── public/            # Arquivos estáticos
└── .next/             # Build (ignorado)
```

## 🎨 Estilos

- Frontend usa **Tailwind CSS**
- Componentes seguem padrão de cards com shadow
- Cores primárias: Indigo e Grey
- Cores de status: Verde (completo), Azul (em progresso), Cinza (por fazer)

## 🔐 Autenticação

- JWT armazenado no localStorage
- Token enviado em `Authorization: Bearer <token>`
- Guard `JwtAuthGuard` para proteger rotas

## 📝 Nomeação

- **Arquivos TypeScript**: camelCase (authService.ts)
- **Classes**: PascalCase (AuthService, TaskController)
- **Funções/Variáveis**: camelCase (getUserById, isLoading)
- **Constants**: UPPER_SNAKE_CASE (JWT_SECRET)

## ✅ Padrões de Código

### NestJS
- DTOs para validação de entrada
- Services para lógica de negócio
- Controllers para rotas
- Guards para autenticação/autorização

### Next.js
- 'use client' em componentes interativos
- Zustand para estado global
- Axios para requisições HTTP
- Pastas dentro de app/ para routes (App Router)

## 🧪 Testes

Exemplo de teste (backend):
```typescript
describe('AuthService', () => {
  it('should register a user', async () => {
    // Teste aqui
  });
});
```

## 📦 Dependências Principais

**Backend:**
- NestJS
- Prisma
- JWT
- bcrypt

**Frontend:**
- Next.js
- React
- Zustand
- Axios
- Tailwind CSS
- date-fns

## 🚀 Deploy

### Frontend (Vercel)
```bash
vercel --cwd apps/frontend
```

### Backend (Railway/Render/AWS)
- Build: `npm run build`
- Start: `npm run start:prod`
- DATABASE_URL deve ser configurada nas variáveis de ambiente
