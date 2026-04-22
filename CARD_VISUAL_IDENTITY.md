# 🎨 ID Visual dos Cards de Estratégia

## Estrutura HTML do Card

```tsx
<div className={styles.estrategiaCard}>
  {/* Header com Título e Tipo */}
  <div className={styles.cardHeader}>
    <h3 className={styles.cardTitle}>{est.nome}</h3>
    <span className={styles.cardType}>{est.tipo}</span>
  </div>

  {/* Descrição */}
  <p className={styles.cardDescription}>{est.descricao}</p>

  {/* Estatísticas */}
  <div className={styles.cardStats}>
    <div className={styles.statItem}>
      <span className={styles.statItemLabel}>Status</span>
      <span className={`${styles.statusBadge} ${est.ativa ? styles.ativa : styles.inativa}`}>
        {est.ativa ? '🟢 Ativa' : '⭕ Inativa'}
      </span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statItemLabel}>Taxa de Sucesso</span>
      <span className={styles.statItemValue}>{est.taxaSucesso}%</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statItemLabel}>Execuções</span>
      <span className={styles.statItemValue}>{est.totalExecutions}</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statItemLabel}>Criada em</span>
      <span className={styles.statItemValue}>{est.dataCriacao}</span>
    </div>
  </div>
</div>
```

## Cores e Paleta

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| Fundo | Azul Escuro | #0d1f2d | Container principal |
| Card Background | Azul Médio | #132636 | Fundo dos cards |
| Primária (Ouro) | Ouro | #c9943a | Destaques, hover, valores |
| Texto Principal | Cinza Claro | #e8edf2 | Títulos, textos principais |
| Texto Secundário | Cinza Médio | #7a96aa | Labels, descrições |
| Status Ativa | Verde | #2ecc71 | Badge ativa |
| Status Inativa | Vermelho | #e74c3c | Badge inativa |

## Estilos CSS Detalhados

### Card Container
```css
.estrategiaCard {
  background: #132636;
  border: 1px solid rgba(201, 148, 58, 0.2);  /* Ouro com transparência */
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  position: relative;
}
```

### Hover Effect
```css
.estrategiaCard:hover {
  border-color: #c9943a;                      /* Ouro sólido */
  transform: translateY(-2px);                /* Elevar 2px */
  box-shadow: 0 8px 16px rgba(201, 148, 58, 0.15);  /* Sombra ouro */
}
```

### Card Header (Título + Tipo)
```css
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.cardTitle {
  font-size: 14px;
  font-weight: 700;
  color: #e8edf2;
  flex: 1;
}

.cardType {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(201, 148, 58, 0.15);  /* Ouro com 15% opacidade */
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  color: #c9943a;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  white-space: nowrap;
  flex-shrink: 0;
}
```

### Card Description
```css
.cardDescription {
  font-size: 12px;
  color: #7a96aa;
  line-height: 1.4;
}
```

### Card Stats Grid
```css
.cardStats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 colunas */
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(201, 148, 58, 0.1);  /* Linha divisória sutil */
}

.statItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.statItemLabel {
  font-size: 10px;
  color: #7a96aa;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.statItemValue {
  font-size: 13px;
  font-weight: 700;
  color: #c9943a;  /* Ouro */
}
```

### Status Badge
```css
.statusBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.statusBadge.ativa {
  background: rgba(46, 204, 113, 0.15);  /* Verde com 15% opacidade */
  color: #2ecc71;
}

.statusBadge.inativa {
  background: rgba(231, 76, 60, 0.15);   /* Vermelho com 15% opacidade */
  color: #e74c3c;
}
```

## Layout Responsivo

### Desktop (default)
- Grid: `repeat(auto-fill, minmax(280px, 1fr))`
- Gap: 16px
- Card width: ~280px a mais

### Tablet (max-width: 1024px)
- Sem mudança significativa

### Mobile (max-width: 768px)
- Grid: `1fr` (uma coluna)
- Padding container: reduzido para 16px

## Transições e Animações

- **Transition padrão**: `all 0.2s ease-out`
- **Hover**: Elevação 2px + borda ouro + sombra
- **Cursor**: `pointer` (indica clicabilidade)

## Dados Requeridos por Card

```typescript
interface EstrategiaCard {
  id: number;              // ID único
  nome: string;            // Título do card (14px, bold)
  descricao: string;       // Descrição (12px, cinza)
  tipo: string;            // Badge tipo (uppercase)
  ativa: boolean;          // Status (emoji + cor)
  taxaSucesso: number;     // Percentual (0-100)
  totalExecutions: number; // Quantidade de execuções
  dataCriacao: string;     // Data (formato: YYYY-MM-DD)
}
```

## Checklist para Novos Cards

✅ Mesmo container `estrategiaCard`
✅ Mesmos estilos CSS importados
✅ Header com título + type badge
✅ Descrição em 12px cinza
✅ Grid 2x2 de stats
✅ Status badge com emoji (ativa/inativa)
✅ Hover effect (elevação + borda ouro + sombra)
✅ Transição suave 0.2s

## Notas Importantes

1. O **ouro #c9943a** é a cor primária em todo o design
2. Todos os valores de dados aparecem em **ouro bold**
3. A borda do card usa **ouro com 20% opacidade** como padrão
4. Em hover, a borda muda para **ouro sólido**
5. O padding interno é sempre **16px**
6. Gap entre elementos do card: **12px**
7. Timestamps devem estar em formato **YYYY-MM-DD** (ex: 2025-01-15)
