# 🏗️ Task Manager - Project Architecture

Visão geral da arquitetura do Task Manager e como os componentes se conectam.

## 🔗 Diagrama de Fluxo Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP/HTTPS (Port 3000)
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        V                                     V
┌────────────────────┐              ┌────────────────────┐
│   Frontend App     │              │     Backend API    │
│  (Next.js Port    ├──────────────►│ (NestJS Port 3001) │
│   3000 / CDN)     │  HTTP/HTTPS   │                    │
│                   │ /api/* calls  │                    │
│ • Login/Register  │               │ • Auth Routes      │
│ • Dashboard       │◄──────────────┤ • Task Routes      │
│ • Task Form       │  JSON Resp.   │ • User Routes      │
│ • Task List       │               │ • Swagger Docs     │
│ • Responsive UI   │               │ • JWT Validation   │
└────────────────────┘               └──────┬────────────┘
        │                                    │
        │ localStorage                       │
        │ (JWT Token)                 TCP 5432 (PostgreSQL)
        │                                    │
        └────────────────────┬───────────────┘
                             │
                             V
                    ┌────────────────────┐
                    │   PostgreSQL       │
                    │   Database         │
                    │                    │
                    │ • Users table      │
                    │ • Tasks table      │
                    │ • Persistent Data  │
                    └────────────────────┘
```

## 📦 Estrutura de Containers Docker

```
Docker Host (Linux/Mac/Windows)
│
├─ Backend Container (Port 3001)
│  ├─ NestJS Application
│  ├─ Express Server
│  ├─ Prisma Client
│  └─ Environment: .env
│
├─ Frontend Container (Port 3000)
│  ├─ Next.js Application
│  ├─ React Components
│  ├─ Node.js Server
│  └─ Environment: .env.local
│
└─ PostgreSQL Container (Port 5432)
   ├─ Database Engine
   ├─ Persistent Volume
   └─ task_manager Database

All containers connected via Docker network
```

## 🔐 Fluxo de Autenticação

```
User submits login credentials
            ↓
Frontend (apps/frontend)
    • Validation on client
    • Send POST /auth/login
            ↓
Backend (apps/backend)
    • AuthController.login()
    • Validate email/password against DB
    • Compare password with bcrypt
            ↓
Success ✓
    • Generate JWT token (valid for 7 days)
    • Return token to frontend
            ↓
Frontend stores token
    • Save in localStorage
    • Add to Axios interceptor
            ↓
Future requests
    • All API calls include "Authorization: Bearer {token}"
    • Backend validates token before processing
    • Extract userId from token payload
```

## 📊 Data Flow - Create Task

```
User creates task in Frontend
    ↓
Frontend (apps/frontend/components/TaskForm.tsx)
    • Collect: title, description, priority, dueDate
    • Validate form
    • Call API: POST /tasks
    ↓
Backend (apps/backend/src/tasks/tasks.controller.ts)
    • JwtAuthGuard validates token
    • Extract userId from request
    • Call TasksService.create()
    ↓
Prisma (apps/backend/prisma/schema.prisma)
    • Validate against schema
    • Insert into Task table
    • Automatically set createdAt
    ↓
PostgreSQL
    • Store task with:
      - id (UUID)
      - title
      - description
      - priority
      - status (default: TODO)
      - dueDate
      - userId (foreign key)
      - createdAt/updatedAt
    ↓
Backend returns Task object (201 Created)
    ↓
Frontend updates state (Zustand)
    ↓
UI automatically re-renders task list
```

## 🏗️ Backend Architecture (NestJS)

```
apps/backend/
│
├─ src/
│  │
│  ├─ main.ts
│  │  └─ App bootstrap, Swagger setup, listen on port 3001
│  │
│  ├─ app.module.ts
│  │  └─ Root module, import all modules
│  │
│  ├─ auth/
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts (POST /auth/register, /auth/login)
│  │  ├─ auth.service.ts (JWT generation, bcrypt validation)
│  │  ├─ jwt.strategy.ts (Passport JWT strategy)
│  │  ├─ jwt-auth.guard.ts (Protection for routes)
│  │  └─ dto/ (LoginDto, RegisterDto with validation)
│  │
│  ├─ users/
│  │  ├─ users.module.ts
│  │  ├─ users.controller.ts (GET /users/me, PUT /users/me)
│  │  ├─ users.service.ts (CRUD operations)
│  │  └─ dto/ (UpdateUserDto)
│  │
│  ├─ tasks/
│  │  ├─ tasks.module.ts
│  │  ├─ tasks.controller.ts (All CRUD endpoints)
│  │  │  ├─ POST /tasks (create)
│  │  │  ├─ GET /tasks (list with filters)
│  │  │  ├─ GET /tasks/:id (read)
│  │  │  ├─ PUT /tasks/:id (update)
│  │  │  └─ DELETE /tasks/:id (delete)
│  │  ├─ tasks.service.ts (Business logic)
│  │  └─ dto/ (CreateTaskDto, UpdateTaskDto)
│  │
│  └─ prisma/
│     └─ prisma.service.ts (Database connection)
│
├─ prisma/
│  ├─ schema.prisma (User & Task models)
│  ├─ migrations/ (Database version control)
│  └─ seed.ts (Optional: seed data)
│
├─ Dockerfile
├─ nest-cli.json
└─ package.json (dependencies)
```

## 🎨 Frontend Architecture (Next.js)

```
apps/frontend/
│
├─ src/
│  │
│  ├─ app/
│  │  ├─ layout.tsx (Root layout with navbar)
│  │  ├─ page.tsx (Home /index)
│  │  │
│  │  ├─ auth/
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx (Login form)
│  │  │  │
│  │  │  └─ register/
│  │  │     └─ page.tsx (Register form)
│  │  │
│  │  ├─ dashboard/
│  │  │  └─ page.tsx (Main dashboard with tasks)
│  │  │
│  │  └─ api/
│  │     └─ (Optional: API routes if needed)
│  │
│  ├─ components/
│  │  ├─ Navbar.tsx (Navigation bar)
│  │  ├─ TaskForm.tsx (Create/Edit task form)
│  │  ├─ TaskList.tsx (List of tasks)
│  │  ├─ TaskCard.tsx (Single task display)
│  │  └─ ... (other components)
│  │
│  ├─ lib/
│  │  ├─ store.ts (Zustand store - state management)
│  │  ├─ api.ts (Axios client with interceptor)
│  │  └─ types.ts (TypeScript interfaces)
│  │
│  └─ styles/
│     └─ globals.css (Tailwind/global styles)
│
├─ Dockerfile
├─ tailwind.config.js (Styling configuration)
├─ next.config.js
└─ package.json (dependencies)
```

## 🗄️ Database Schema (Prisma/PostgreSQL)

```
User
├─ id (UUID, primary key)
├─ email (String, unique)
├─ name (String)
├─ password (String, hashed)
├─ createdAt (DateTime)
├─ updatedAt (DateTime)
└─ tasks (Task[], relation)

Task
├─ id (UUID, primary key)
├─ title (String)
├─ description (String)
├─ priority ('LOW' | 'MEDIUM' | 'HIGH')
├─ status ('TODO' | 'IN_PROGRESS' | 'COMPLETED')
├─ dueDate (DateTime, optional)
├─ createdAt (DateTime)
├─ updatedAt (DateTime)
├─ userId (UUID, foreign key)
└─ user (User, relation)
```

## 🚀 Deployment Architecture (Railway)

```
GitHub Repository
    ↓ (auto-trigger on push)
Railway Project
    │
    ├─ PostgreSQL Service
    │  └─ Cloud database (managed by Railway)
    │     • Auto provides DATABASE_URL
    │     • Automatic backups
    │     • High availability
    │
    ├─ Backend Service
    │  ├─ Docker build from ./apps/backend/Dockerfile
    │  ├─ Runs: node dist/main
    │  ├─ Environment:
    │  │  - DATABASE_URL (from Postgres service)
    │  │  - JWT_SECRET (configured in Railway)
    │  │  - JWT_EXPIRATION
    │  │  - NODE_ENV=production
    │  │  - PORT=3001
    │  └─ Output: https://backend-xxx.railway.app
    │
    └─ Frontend Service
       ├─ Docker build from ./apps/frontend/Dockerfile
       ├─ Runs: next start
       ├─ Environment:
       │  └─ NEXT_PUBLIC_API_URL=https://backend-xxx.railway.app
       └─ Output: https://frontend-xxx.railway.app
```

## 🔄 Request/Response Cycle Example

### Example: User tries to login

```
1. Browser (Frontend)
   → User fills login form, click submit
   
2. React Component (TaskForm.tsx)
   → Validates form locally
   → Calls: api.post('/auth/login', { email, password })
   
3. Axios Interceptor (lib/api.ts)
   → No token yet (login request)
   → Makes HTTP POST to http://localhost:3001/auth/login
   
4. NestJS Backend
   → Route: POST /auth/login matches AuthController.login()
   → No JwtAuthGuard (login is public)
   → Receives: { email, password }
   
5. AuthService
   → Find user by email in database
   → Compare password (bcrypt.compare)
   → Generate JWT token: jwt.sign({ sub: user.id }, JWT_SECRET)
   
6. Database (PostgreSQL)
   → Query: SELECT FROM users WHERE email = ?
   → Returns: User object with hashed password
   
7. Backend Response
   → HTTP 200 OK
   → Body: { accessToken: "eyJhbGc...", user: { id, email, name } }
   
8. Axios Response Handler
   → Extracts token from response
   → Gets token: "eyJhbGc..."
   
9. React State (Zustand)
   → Updates global store: { user, token }
   → Calls: localStorage.setItem('auth-token', token)
   
10. Future Requests
    → Axios interceptor reads from localStorage
    → Headers: { Authorization: "Bearer eyJhbGc..." }
    → Backend JwtAuthGuard validates token
    → Extract user.id from token payload
```

## 📈 Performance Considerations

```
Frontend Performance
├─ Next.js image optimization
├─ Code splitting (automatic)
├─ CSS-in-JS (Tailwind)
└─ Client-side caching with Zustand

Backend Performance
├─ Database indexes on userId, email
├─ JWT validation (fast, no DB call)
├─ Prisma query caching
└─ Docker resource limits

Database Performance
├─ PostgreSQL indexes
├─ Connection pooling (Prisma)
├─ Query optimization
└─ Data normalization
```

## 🔐 Security Layers

```
Frontend
├─ XSS protection (React automatically escapes)
├─ CSRF protection (SameSite cookies)
└─ Local storage for non-sensitive data

Network
├─ HTTPS/TLS encryption
├─ CORS headers validation
└─ JWT token validation

Backend
├─ Input validation (class-validator)
├─ Password hashing (bcrypt)
├─ JWT signature verification
├─ Database prepared statements (Prisma)
└─ Environment variables (no secrets in code)

Database
├─ User data encryption
├─ Foreign key constraints
├─ Row-level permissions (via JWT userId)
└─ Backup and recovery
```

## 📚 Documentation Map in Code

```
/
├─ README.md (Start here)
├─ DOCS.md (Documentation index)
├─ DEPLOYMENT_CHECKLIST.md (Step-by-step deploy)
├─ RAILWAY.md (Railway guide)
├─ QUICK_REFERENCE.md (Commands)
├─ FEATURES.md (Feature status)
├─ CHANGELOG.md (Version history)
├─ LOCAL_SETUP.md (Local setup)
├─ SETUP.md (Initial setup)
├─ CONVENTIONS.md (Code standards)
│
├─ apps/backend/
│  └─ README.md (Backend specific)
│
└─ apps/frontend/
   └─ README.md (Frontend specific)
```

---

This architecture is **production-ready** and **scalable** to handle growth.

For details on any component, see the specific documentation files referenced above.
