#!/bin/bash

# ============================================================================
# VERIFICADOR DE VARIÁVEIS DE AMBIENTE
# ============================================================================
# Execute: bash verify-env.sh
# Verifica se as configurações necessárias estão corretas

echo "🔍 Verificando configuração de ambiente..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# ============================================================================
# 1. Verificar se .env.local existe
# ============================================================================
echo "📋 Verificação 1: Arquivo .env.local"
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓ .env.local existe${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ .env.local não encontrado${NC}"
  echo "  Copie de .env.example: cp .env.example .env.local"
  ((CHECKS_FAILED++))
fi
echo ""

# ============================================================================
# 2. Verificar se ANTHROPIC_API_KEY está presente
# ============================================================================
echo "📋 Verificação 2: ANTHROPIC_API_KEY"
if grep -q "^ANTHROPIC_API_KEY=" .env.local 2>/dev/null; then
  KEY_VALUE=$(grep "^ANTHROPIC_API_KEY=" .env.local | cut -d= -f2)

  if [[ "$KEY_VALUE" == "[SUBSTITUIR_COM_CHAVE_NOVA_sk-ant-...]" ]]; then
    echo -e "${YELLOW}⚠ ANTHROPIC_API_KEY ainda é placeholder${NC}"
    echo "  ❌ AÇÃO NECESSÁRIA: Substitua por uma chave real de Anthropic"
    echo "  Obtenha em: https://console.anthropic.com/account/keys"
    ((CHECKS_FAILED++))
  elif [[ "$KEY_VALUE" == sk-ant-* ]]; then
    echo -e "${GREEN}✓ ANTHROPIC_API_KEY tem formato válido (sk-ant-...)${NC}"
    if [ ${#KEY_VALUE} -ge 50 ]; then
      echo -e "${GREEN}✓ ANTHROPIC_API_KEY tem comprimento adequado${NC}"
      ((CHECKS_PASSED++))
    else
      echo -e "${RED}✗ ANTHROPIC_API_KEY é muito curta (deve ter 80+ caracteres)${NC}"
      ((CHECKS_FAILED++))
    fi
  else
    echo -e "${RED}✗ ANTHROPIC_API_KEY não começa com sk-ant-${NC}"
    echo "  Valor: $KEY_VALUE"
    ((CHECKS_FAILED++))
  fi
else
  echo -e "${RED}✗ ANTHROPIC_API_KEY não encontrada em .env.local${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# ============================================================================
# 3. Verificar NEXT_PUBLIC_API_URL
# ============================================================================
echo "📋 Verificação 3: NEXT_PUBLIC_API_URL"
if grep -q "^NEXT_PUBLIC_API_URL=" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓ NEXT_PUBLIC_API_URL está configurada${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ NEXT_PUBLIC_API_URL não encontrada${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# ============================================================================
# 4. Verificar se .env.production existe (não deveria!)
# ============================================================================
echo "📋 Verificação 4: Segurança (.env.production)"
if [ -f ".env.production" ]; then
  echo -e "${RED}✗ .env.production ainda existe (RISCO DE SEGURANÇA!)${NC}"
  echo "  Remova com: rm .env.production"
  echo "  Git status: git status | grep env.production"
  ((CHECKS_FAILED++))
else
  echo -e "${GREEN}✓ .env.production não existe (seguro)${NC}"
  ((CHECKS_PASSED++))
fi
echo ""

# ============================================================================
# 5. Verificar .gitignore
# ============================================================================
echo "📋 Verificação 5: .gitignore"
if grep -q "\.env\*" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓ .env* está no .gitignore${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ .env* NÃO está no .gitignore${NC}"
  ((CHECKS_FAILED++))
fi
echo ""

# ============================================================================
# RESUMO
# ============================================================================
TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))
echo "═══════════════════════════════════════════════════════════════"
echo "📊 RESUMO: $CHECKS_PASSED/$TOTAL verificações passaram"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ TUDO CONFIGURADO CORRETAMENTE!${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. npm run dev        # Iniciar desenvolvimento"
  echo "2. Acessar: http://localhost:3000"
  echo "3. Testar Estratégias: Dashboard → Estratégias → + Nova"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $CHECKS_FAILED VERIFICAÇÕES FALHARAM${NC}"
  echo ""
  echo "Ações necessárias:"
  echo "1. Adicione sua chave de Anthropic (sk-ant-...) em .env.local"
  echo "2. Remova .env.production se existir"
  echo "3. Execute novamente: bash verify-env.sh"
  echo ""
  exit 1
fi
