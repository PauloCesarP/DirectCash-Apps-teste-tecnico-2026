FROM node:20-alpine

WORKDIR /app

# Copy package files da raiz
COPY package*.json ./

# Copy package files do frontend
COPY apps/frontend/package*.json ./apps/frontend/

# Copy config files do frontend
COPY apps/frontend/tsconfig.json ./apps/frontend/
COPY apps/frontend/next.config.js ./apps/frontend/
COPY apps/frontend/postcss.config.js ./apps/frontend/
COPY apps/frontend/tailwind.config.js ./apps/frontend/

# Install dependencies
RUN npm install

# Copy frontend source
COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/public ./apps/frontend/public

# Build frontend
WORKDIR /app/apps/frontend
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
