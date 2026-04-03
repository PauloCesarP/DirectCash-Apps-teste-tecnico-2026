FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files da raiz
COPY package*.json ./

# Copy package files do backend
COPY apps/backend/package*.json ./apps/backend/

# Copy tsconfig e nest-cli do backend
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/nest-cli.json ./apps/backend/

# Copy prisma schema do backend
COPY apps/backend/prisma ./apps/backend/prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Copy backend source
COPY apps/backend/src ./src

# Build backend
RUN npm run build

# Copy entrypoint script
COPY apps/backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/app/entrypoint.sh"]
