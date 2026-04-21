# Teste de Persistência - Estratégias com Backend API

## 🎯 Objetivo
Validar que as estratégias criadas persistem no backend (`data/estrategias.json`) e carregam corretamente após page reload ou navegação.

---

## ✅ Componentes Implementados

### 1. Backend API (`app/api/estrategias/route.ts`)
- **GET /api/estrategias** → Carrega todas estratégias do arquivo
- **POST /api/estrategias** → Cria novas e salva no arquivo
- **PUT /api/estrategias/[id]** → Atualiza estratégia no arquivo
- **DELETE /api/estrategias/[id]** → Deleta do arquivo
- Todas as operações persistem em `data/estrategias.json`

### 2. Store Zustand (`src/store/estrategiasStore.ts`)
- Gerencia estado centralizado
- Sincroniza automaticamente com backend
- Auto-reload após cada mutação

### 3. Component (`src/components/crm/pages/Estrategias.tsx`)
- Integrado com `useEstrategiasStore`
- `useEffect` carrega estratégias no mount
- `handleSalvarEstrategia` persiste via `adicionarEstrategias()`
- Mostra loading state durante operações

---

## 🧪 Plano de Teste

### Teste 1: Criar Estratégia e Verificar Persistência
1. Abrir página Estratégias
2. Clicar "+ Nova"
3. Preencher:
   - Mês: "Abril"
   - Texto: "Sistema de contato para leads frios usando WhatsApp com respostas automáticas de IA para qualificação inicial. Taxa esperada de 75% de sucesso na qualificação."
4. Clicar "✓ Processar Estratégia"
5. **Esperado:** 
   - ✅ Nova estratégia aparece na lista
   - ✅ Console mostra: `[ESTRATEGIAS] ✓ Sucesso! X estratégias criadas`
   - ✅ Console mostra: `[ESTRATEGIAS_STORE] ✓ Estratégias salvas com sucesso`

### Teste 2: Page Reload (Persistência Local)
1. Recarregar a página (F5 ou Cmd+R)
2. **Esperado:**
   - ✅ Console mostra: `[ESTRATEGIAS] Componente montado, carregando estratégias do backend...`
   - ✅ Estratégias criadas aparecem novamente (não desaparecem!)
   - ✅ Dados foram restaurados de `data/estrategias.json`

### Teste 3: Navegação e Volta
1. Criar estratégia (se não existir)
2. Navegar para outro menu (ex: Kanban)
3. Voltar para Estratégias
4. **Esperado:**
   - ✅ Estratégias persistem
   - ✅ Nenhum dado foi perdido

### Teste 4: Deletar Estratégia (Futuro - quando botão implementado)
1. Criar estratégia
2. Clicar delete
3. Confirmar
4. **Esperado:**
   - ✅ Remove da UI
   - ✅ Remove de `data/estrategias.json`
5. Recarregar página
6. **Esperado:**
   - ✅ Não aparece mais (deletado permanentemente)

### Teste 5: Filtro por Mês com Dados Persistidos
1. Criar múltiplas estratégias em diferentes meses
2. Selecionar mês diferente (ex: "Janeiro")
3. **Esperado:**
   - ✅ Mostra apenas estratégias do mês selecionado
4. Recarregar página
5. **Esperado:**
   - ✅ Filtro mantém a seleção
   - ✅ Dados persistem

### Teste 6: Erro de API (Simular com DevTools)
1. Abrir DevTools (F12)
2. Network tab → Throttle to Offline
3. Tentar criar estratégia
4. **Esperado:**
   - ✅ Alert mostra erro de conexão
   - ✅ Console mostra `[ESTRATEGIAS] ✗ Erro fatal`
5. Voltar online
6. Tentar novamente
7. **Esperado:**
   - ✅ Funciona normalmente

---

## 📊 Dados de Teste

### Textos Válidos para Processar:

**Texto 1 - Follow-up:**
```
Sistema de follow-up automático para leads que visualizaram página de preços mas não converteram. 
Envio de email educativo 24h após visualização, seguido de SMS 48h depois. 
Meta: aumentar conversão de leads em 40%. Taxa esperada de sucesso: 65%.
```

**Texto 2 - Reativação:**
```
Campanha de reativação de pacientes inativos há 6 meses. 
Envio de vale de desconto 20% para agendamento de consulta, 
com comunicação via WhatsApp e email. 
Objetivo: recuperar 30% dos inativos. Taxa esperada: 45%.
```

**Texto 3 - Aquisição:**
```
Tráfego pago no Google Ads direcionado para leads frios interessados em tratamentos estéticos.
Landing page otimizada com vídeo antes/depois e depoimentos. 
Retargeting de 30 dias para quem clicou mas não agendou.
Meta: 50 agendamentos/mês com ROAS 4:1. Taxa esperada: 8% de conversão.
```

---

## 🔍 Verificações de Console

### Esperado ao Criar:
```
[ESTRATEGIAS] Iniciando processamento de texto de estratégia
[ESTRATEGIAS] Texto: XXX caracteres, Mês: Abril
[ESTRATEGIAS] Enviando para API: {...}
[ESTRATEGIAS] ✓ Sucesso! 1 estratégias criadas
[ESTRATEGIAS] Salvando no backend via store...
[ESTRATEGIAS_STORE] Salvando 1 estratégias...
[ESTRATEGIAS_STORE] ✓ Estratégias salvas com sucesso
[ESTRATEGIAS_STORE] Carregando estratégias do backend...
[ESTRATEGIAS_STORE] ✓ Estratégias carregadas: 1
```

### Esperado ao Recarregar:
```
[ESTRATEGIAS] Componente montado, carregando estratégias do backend...
[ESTRATEGIAS_STORE] Carregando estratégias do backend...
[ESTRATEGIAS_STORE] ✓ Estratégias carregadas: 1
```

---

## 📁 Arquivos de Backup

Antes de testar, fazer backup de:
- `data/estrategias.json` (será criado automaticamente)

---

## 🚀 Checklist Final

- [ ] Backend API funciona (GET/POST/PUT/DELETE)
- [ ] Store sincroniza corretamente
- [ ] Component carrega estratégias no mount
- [ ] Nova estratégia persiste após reload
- [ ] Navegação não perde dados
- [ ] Filtro por mês funciona
- [ ] Mensagens de erro aparecem corretamente
- [ ] Console mostra logs esperados
- [ ] Sem erros em DevTools

---

## 🔧 Deploy para Vercel

Após testes locais, fazer deploy:

```bash
git add .
git commit -m "feat: persistence system for estratégias with backend API"
git push origin main
```

Vercel fará deploy automaticamente e `data/estrategias.json` será criado em runtime.

---

## 📝 Notas

- Arquivo de dados: `data/estrategias.json`
- Se arquivo não existir, API cria automaticamente no primeiro POST
- Dados persistem até ser deletado manualmente
- Para produção futura: migrar para PostgreSQL/MongoDB

