# 🔴 DIAGNÓSTICO: Erro de Autenticação API Estratégias

## Problema Identificado

A rota `/api/processar-estrategia` está retornando erro **401**:
```json
{
  "sucesso": false,
  "erro": "Erro de autenticação com a API de IA. Verifique se a chave de API está configurada corretamente.",
  "detalhe": "O servidor não conseguiu se autenticar com a API do Claude."
}
```

### Causa Raiz

A variável de ambiente `ANTHROPIC_API_KEY` **não está configurada em Vercel**:
- ✅ Frontend está em: `https://www.crmproclinic.com.br` (Vercel)
- ✅ Rota está em: `/app/api/processar-estrategia/route.ts` (Frontend)
- ❌ Chave está em: Railway (não é o local correto!)
- ❌ Vercel não tem a variável configurada

### Status Atual do Código

| Arquivo | Status | Problema |
|---------|--------|----------|
| `.env.local` | ⚠️ Tem chave revogada | Não funciona mais |
| `.env.production` | ⚠️ Tem chave revogada | Não deveria estar no Git |
| Vercel | ❌ Sem configuração | Não tem chave nenhuma |
| Railway | ✅ Configurado | Mas para o backend, não frontend |

---

## Solução: Configurar Chave em Vercel

### Opção 1: Via Vercel Dashboard Web ⭐ RECOMENDADO

**Passo 1:** Abrir Vercel Dashboard
```
1. Ir para: https://vercel.com/dashboard
2. Selecionar projeto: "proclinic-crm-frontend"
```

**Passo 2:** Acessar Settings → Environment Variables
```
1. No projeto, clicar em "Settings"
2. No menu lateral, clicar em "Environment Variables"
```

**Passo 3:** Adicionar Nova Variável
```
1. Clicar em "Add New"
2. Nome: ANTHROPIC_API_KEY
3. Valor: [SUA_CHAVE_AQUI] (começa com "sk-ant-")
4. Selecionar: Production (ou todas as ambientes)
5. Clicar em "Save"
```

**Passo 4:** Fazer Re-deploy
```
1. Ir para "Deployments"
2. Selecionar deployment mais recente
3. Clicar em "Redeploy"
```

---

### Opção 2: Atualizar Localmente (Se tiver Node.js/npm)

**Passo 1:** Criar nova chave no console Anthropic
```
1. Ir para: https://console.anthropic.com/account/keys
2. Criar nova chave
3. Copiar valor completo (começa com "sk-ant-")
```

**Passo 2:** Atualizar `.env.local`
```bash
cd proclinic-crm-frontend
```

**Abrir arquivo `.env.local` e substituir:**
```
ANTHROPIC_API_KEY=sk-ant-api03-0cs_gKw9TZ4FcJGBHei1EaBZ0JckZEYSbfmjTU6dBJxpFXs-6f1AmFG9mjv9UfXHROkBz5GRRsBJeSStZE3w-KDtA7gAA
```

**Por:**
```
ANTHROPIC_API_KEY=sk-ant-[SUA_CHAVE_NOVA_AQUI]
```

**Passo 3:** Deploy
```bash
git add .env.local
git commit -m "chore: update anthropic api key for local dev"
git push origin main
```

---

## Verificação Após Configuração

### Testar em Produção
```
1. Ir para: https://www.crmproclinic.com.br/dashboard/estrategias
2. Clicar "+ Nova"
3. Colar texto com ~100 caracteres:
   "Estratégia de marketing digital para janeiro: Campanhas de tráfego pago com foco em leads qualificados."
4. Selecionar mês: Janeiro
5. Clicar "✓ Processar Estratégia"
6. Esperar 3-5 segundos
```

### Resultado Esperado ✅

```
Alert: "✅ 2 estratégias criadas automaticamente!"
Cards aparecem na página
```

### Se Ainda Não Funcionar ❌

**Abrir DevTools (F12) → Console e procurar:**
```
Se aparecer: "[ESTRATEGIAS] ✗ Erro ao processar: ..."
Significa: Vercel recebeu a chave mas ela está inválida

Solução: Verificar se a chave foi copiada completamente, sem espaços
```

---

## Checklist de Implementação

- [ ] Obter nova chave Anthropic (`sk-ant-...`)
- [ ] Configurar em Vercel Dashboard → Environment Variables
- [ ] Fazer re-deploy em Vercel
- [ ] Aguardar ~1 minuto (deploy completar)
- [ ] Testar em https://www.crmproclinic.com.br/dashboard/estrategias
- [ ] Confirmar que estratégias são criadas com sucesso

---

## Informações Importantes

### 🔐 Segurança
- ✅ Chave antiga foi revogada
- ✅ Arquivo `.env.production` foi removido do Git tracking
- ✅ Não há secrets no repositório
- ✅ Vercel armazena secrets de forma segura (encrypted)

### 📋 Referência de Endpoints

| Endpoint | Local | Ambiente |
|----------|-------|----------|
| `/api/processar-estrategia` | `localhost:3000` | Development |
| `/api/processar-estrategia` | `https://www.crmproclinic.com.br` | Production (Vercel) |

---

## Próximos Passos

Após confirmar que Estratégias funcionam:
1. Testar Pipeline (drag-drop, editar, deletar)
2. Testar Etiquetas (criar, visualizar, sincronizar)
3. Validação completa de todas as features

---

**Status**: 🔴 Bloqueado por falta de configuração Vercel
**Ação Necessária**: Configurar `ANTHROPIC_API_KEY` em Vercel (veja acima)
