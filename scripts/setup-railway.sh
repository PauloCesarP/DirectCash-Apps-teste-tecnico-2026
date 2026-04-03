#!/bin/bash

# Script para gerar configurações seguras para deployment

echo "🚀 Task Manager - Gerador de Configurações para Production"
echo "=========================================================="
echo ""

# Gerar JWT_SECRET
JWT_SECRET=$(openssl rand -hex 32)

echo "✅ JWT_SECRET gerado (copie este valor para o Railway):"
echo ""
echo "=================================================="
echo "$JWT_SECRET"
echo "=================================================="
echo ""

# Informações sobre DATABASE_URL
echo "📦 DATABASE_URL:"
echo "   Railway criará esta variável automaticamente"
echo "   Formato: postgresql://user:pass@host:port/db"
echo ""

# Instruções
echo "📋 Próximos passos:"
echo "1. Acesse https://railway.app"
echo "2. Crie um novo projeto"
echo "3. Configure a variável JWT_SECRET com o valor acima"
echo "4. Configure NEXT_PUBLIC_API_URL com a URL do seu backend"
echo "5. Faça um push para ativar o deployment automático"
echo ""

# Informações de segurança
echo "🔒 Dicas de Segurança:"
echo "- NUNCA compartilhe o JWT_SECRET"
echo "- Use um JWT_SECRET diferente para cada ambiente"
echo "- Mude o JWT_SECRET regularmente em produção"
echo "- Mantenha o NEXT_PUBLIC_API_URL protegido por HTTPS"
echo ""
