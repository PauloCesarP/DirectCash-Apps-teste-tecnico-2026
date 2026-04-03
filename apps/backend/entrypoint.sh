#!/bin/sh

cd /app/apps/backend

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
node dist/main
