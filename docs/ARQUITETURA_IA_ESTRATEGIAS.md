# Arquitetura: Sistema de Monitoramento de Estratégias com IA

**Data de Criação:** 22 de Abril de 2026
**Status:** Documentação para Implementação Futura
**Versão:** 1.0

---

## 📋 Visão Geral

Sistema completo para:
- Ler estratégias criadas automaticamente
- Direcionar para portal das IAs
- Executar estratégias com IA responsável
- Alimentar automaticamente `totalExecutions` e `taxaSucesso`
- Monitorar e exibir progresso em tempo real

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────┐
│  Estratégias Criadas            │
│  (localStorage + BD)             │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Monitor de Estratégias (IA)    │
│  /api/monitorar-estrategias     │
│  - Lê estratégias ativas        │
│  - Mapeia para IA responsável   │
│  - Inicia execução              │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┬──────────┐
      ▼             ▼          ▼
  ┌────────┐  ┌────────┐  ┌────────┐
  │IA Email│  │IA SMS  │  │IA WhatsApp
  │Manager │  │Manager │  │Manager │
  └────────┘  └────────┘  └────────┘
      │             │          │
      └──────┬──────┴──────────┘
             ▼
┌─────────────────────────────────┐
│  Webhook/Callback               │
│  /api/atualizar-execucao        │
│  - Recebe resultado da IA       │
│  - Atualiza totalExecutions     │
│  - Atualiza taxaSucesso         │
│  - Persiste no BD               │
└─────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Dashboard (Real-time)          │
│  Mostra progresso das           │
│  execuções em tempo real        │
└─────────────────────────────────┘
```

---

## 📊 Estrutura de Dados

### Estratégia (já existente)
```typescript
interface EstrategiaExtraida {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;              // Email, SMS, WhatsApp, etc
  ativa: boolean;
  dataCriacao: string;       // YYYY-MM-DD
  totalExecutions: number;   // Será atualizado pela IA
  taxaSucesso: number;       // Será atualizado pela IA
  criadoPor: string;
}
```

### Request para Monitoramento
```typescript
interface MonitorarEstrategiaRequest {
  estrategiaId: number;
  tipo: string;
  descricao: string;
  nome: string;
}

interface MonitorarEstrategiaResponse {
  sucesso: boolean;
  agenteResponsavel: string;
  statusExecucao: "iniciada" | "processando" | "concluida";
  webhookUrl: string;
  erro?: string;
}
```

### Request para Atualizar Execução
```typescript
interface AtualizarExecucaoRequest {
  estrategiaId: number;
  totalExecutions: number;
  taxaSucesso: number;
  detalhes: {
    enviados: number;
    sucesso: number;
    falhas: number;
    timestamp: string;
    logs?: string[];
  };
}

interface AtualizarExecucaoResponse {
  sucesso: boolean;
  estrategiaAtualizada: boolean;
  novosTotais: {
    totalExecutions: number;
    taxaSucesso: number;
  };
}
```

---

## 🔄 Fluxo de Execução

### 1. Monitoramento de Estratégias Ativas
```
Timer/Cron → GET /api/monitorar-estrategias
  ├─ Busca estratégias onde ativa = true
  ├─ Agrupa por tipo
  └─ Envia para IA responsável
```

### 2. Mapeamento de Tipos para IAs
```typescript
const mapaIAs = {
  "email": {
    endpoint: "https://seu-portal-ia.com/ia-email",
    timeout: 3600,        // 1 hora
    prioridade: "alta",
    retentativas: 3
  },
  "sms": {
    endpoint: "https://seu-portal-ia.com/ia-sms",
    timeout: 1800,        // 30 minutos
    prioridade: "alta",
    retentativas: 3
  },
  "whatsapp": {
    endpoint: "https://seu-portal-ia.com/ia-whatsapp",
    timeout: 3600,
    prioridade: "normal",
    retentativas: 2
  },
  // Adicionar mais conforme necessário
};
```

### 3. Callback/Webhook da IA
```
IA completa execução → POST /api/atualizar-execucao
  ├─ Valida dados
  ├─ Atualiza localStorage
  ├─ Atualiza Banco de Dados
  ├─ Notifica UI em tempo real (WebSocket)
  └─ Retorna confirmação
```

---

## 🛠️ APIs a Implementar

### 1. `/app/api/monitorar-estrategias/route.ts`
**Responsabilidade:** Ler estratégias ativas e enviar para IAs

**Método:** POST
**Body:**
```json
{
  "estrategiaId": 1234567890,
  "tipo": "email",
  "nome": "Limpeza completa dos pacientes",
  "descricao": "Enviar email com conteúdo detalhado..."
}
```

**Response:**
```json
{
  "sucesso": true,
  "agenteResponsavel": "IA Email Manager v2.0",
  "statusExecucao": "iniciada",
  "webhookUrl": "https://crmproclinic.com.br/api/atualizar-execucao"
}
```

---

### 2. `/app/api/atualizar-execucao/route.ts`
**Responsabilidade:** Receber resultados da IA e atualizar estratégia

**Método:** POST
**Body:**
```json
{
  "estrategiaId": 1234567890,
  "totalExecutions": 156,
  "taxaSucesso": 78,
  "detalhes": {
    "enviados": 200,
    "sucesso": 156,
    "falhas": 44,
    "timestamp": "2026-04-22T15:30:00Z",
    "logs": [
      "Email enviado para 156 contatos",
      "44 erros de entrega",
      "Taxa de abertura: 45%"
    ]
  }
}
```

**Response:**
```json
{
  "sucesso": true,
  "estrategiaAtualizada": true,
  "novosTotais": {
    "totalExecutions": 156,
    "taxaSucesso": 78
  }
}
```

---

### 3. `/app/api/listar-estrategias-ativas/route.ts`
**Responsabilidade:** Listar estratégias que precisam ser executadas

**Método:** GET
**Query Params:**
- `tipo` (opcional): Filtrar por tipo
- `limite` (optional): Máximo de estratégias

**Response:**
```json
{
  "sucesso": true,
  "estrategias": [
    {
      "id": 1234567890,
      "nome": "Estratégia 1",
      "tipo": "email",
      "ativa": true,
      "totalExecutions": 50,
      "taxaSucesso": 75
    }
  ],
  "total": 1
}
```

---

## 💾 Banco de Dados - Schema

### Tabela: `estrategias`
```sql
CREATE TABLE estrategias (
  id BIGINT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(500),
  tipo VARCHAR(50) NOT NULL,
  ativa BOOLEAN DEFAULT true,
  dataCriacao DATE NOT NULL,
  totalExecutions INT DEFAULT 0,
  taxaSucesso INT DEFAULT 0,
  criadoPor VARCHAR(100),
  dataUltimaExecucao TIMESTAMP,
  dataUltimaAtualizacao TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_tipo ON estrategias(tipo);
CREATE INDEX idx_ativa ON estrategias(ativa);
CREATE INDEX idx_dataCriacao ON estrategias(dataCriacao);
```

### Tabela: `execucoes_estrategia` (Auditoria)
```sql
CREATE TABLE execucoes_estrategia (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  estrategiaId BIGINT NOT NULL,
  statusExecucao VARCHAR(50),
  totalEnviados INT,
  totalSucesso INT,
  totalFalhas INT,
  taxaSucesso INT,
  logs JSON,
  dataExecucao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (estrategiaId) REFERENCES estrategias(id)
);

CREATE INDEX idx_estrategiaId ON execucoes_estrategia(estrategiaId);
CREATE INDEX idx_dataExecucao ON execucoes_estrategia(dataExecucao);
```

---

## 🔌 Integração com Portal das IAs

### Contrato de Requisição
```typescript
interface RequisicaoParaIA {
  id: string;                    // Identificador único
  estrategiaId: number;
  tipo: string;                  // email, sms, whatsapp
  nome: string;
  descricao: string;
  conteudo: string;
  destinatarios?: {
    lista?: string[];
    segmentacao?: string;
  };
  configuracoesEspecificas?: {
    // Customizável por tipo
    horarioEnvio?: string;
    frequencia?: string;
    tentativas?: number;
  };
  webhookCallback: string;       // URL para callback
  timeoutSegundos: number;
}
```

### Contrato de Resposta da IA
```typescript
interface RespostaExecucaoIA {
  id: string;                    // Mesmo da requisição
  estrategiaId: number;
  sucesso: boolean;
  statusExecucao: "concluida" | "erro" | "pendente";
  resumo: {
    totalEnviados: number;
    totalSucesso: number;
    totalFalhas: number;
    taxaSucesso: number;
    tempoExecucaoSegundos: number;
  };
  detalhes: {
    timestamp: string;
    mensagemErro?: string;
    logs: string[];
  };
}
```

---

## 📈 Progresso em Tempo Real

### Opção 1: WebSocket
```typescript
// Frontend
const socket = io('https://seu-servidor.com');
socket.on('estrategia:atualizada', (dados) => {
  // Atualizar UI com novos totalExecutions e taxaSucesso
});
```

### Opção 2: Server-Sent Events (SSE)
```typescript
// Frontend
const eventSource = new EventSource('/api/stream-execucoes');
eventSource.onmessage = (event) => {
  const dados = JSON.parse(event.data);
  // Atualizar UI
};
```

### Opção 3: Polling
```typescript
// Frontend - A cada 10 segundos
setInterval(async () => {
  const response = await fetch('/api/estrategias-com-progresso');
  // Atualizar UI
}, 10000);
```

---

## 🧪 Testes Recomendados

```typescript
// Teste de Monitoramento
test('deve rotear estratégia de email para IA responsável', async () => {
  // Implementar
});

// Teste de Callback
test('deve atualizar totalExecutions ao receber callback', async () => {
  // Implementar
});

// Teste de Persistência
test('deve salvar execução no banco de dados', async () => {
  // Implementar
});

// Teste de Validação
test('deve rejeitar callback com dados inválidos', async () => {
  // Implementar
});
```

---

## 📋 Checklist de Implementação

- [ ] Criar banco de dados (escolher plataforma)
- [ ] Criar API `/api/monitorar-estrategias`
- [ ] Criar API `/api/atualizar-execucao`
- [ ] Criar API `/api/listar-estrategias-ativas`
- [ ] Implementar mapeamento de tipos para IAs
- [ ] Configurar webhooks de segurança (assinatura)
- [ ] Implementar sistema de retry
- [ ] Adicionar logging detalhado
- [ ] Criar dashboard de progresso
- [ ] Implementar real-time updates (WebSocket/SSE)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Deploy em staging
- [ ] Testes em produção
- [ ] Documentação final

---

## 📚 Referências

**Arquivos já existentes que servem como padrão:**
- `/app/api/processar-estrategia/route.ts` - Padrão de API route
- `/src/components/crm/pages/EstrategiasModal.tsx` - Padrão de modal
- `/app/dashboard/estrategias/page.tsx` - UI que será atualizada em tempo real
- `/src/lib/estrategias-salvas.ts` - Padrão de persistência

**Data de Criação:** 2026-04-22
**Pronto para:** Implementação quando solicitado

---

## 💡 Notas Importantes

1. **Segurança:** Implementar validação de webhooks (HMAC/JWT)
2. **Performance:** Usar filas (Bull/RabbitMQ) para processamento assíncrono
3. **Resiliência:** Implementar retry automático com exponential backoff
4. **Monitoramento:** Usar Sentry/DataDog para acompanhar erros
5. **Escalabilidade:** Considerar microserviços se crescer muito

---

**Documento preparado para**: Implementação Futura do Sistema de Execução Automática de Estratégias com IA
