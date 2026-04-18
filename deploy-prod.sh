#!/bin/bash

# 🚀 Script de Deploy Automático para Produção
# Use: ./deploy-prod.sh "Sua mensagem de commit aqui"

set -e

COMMIT_MSG="${1:-Deploy automático para produção}"

echo "🚀 Iniciando deploy automático para produção..."
echo ""

# 1. Compilar projeto
echo "📦 Compilando projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falhou. Deploy cancelado."
    exit 1
fi

echo "✅ Build bem-sucedido!"
echo ""

# 2. Fazer commit das mudanças
echo "💾 Commitando mudanças..."
git add -A
git commit -m "$COMMIT_MSG" || echo "⚠️  Nenhuma mudança para committar"

echo ""

# 3. Fazer push para GitHub
echo "📤 Fazendo push para GitHub (main branch)..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Push falhou. Verifique sua conexão Git."
    exit 1
fi

echo "✅ Push bem-sucedido!"
echo ""

# 4. Deploy para Vercel
echo "🌍 Deployando para Vercel produção..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ ✨ ✨ DEPLOY CONCLUÍDO COM SUCESSO! ✨ ✨ ✨"
    echo ""
    echo "🎉 Produção atualizada:"
    echo "   URL: https://www.crmproclinic.com.br/conversas"
    echo ""
else
    echo "❌ Deploy Vercel falhou. Verifique os logs acima."
    exit 1
fi
