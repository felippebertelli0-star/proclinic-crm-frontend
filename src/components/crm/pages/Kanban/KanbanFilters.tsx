/**
 * KanbanFilters - Filtros e Ações do Kanban
 * Acessível e responsivo
 */

'use client';

import { memo } from 'react';
import { PrioridadeType } from '@/types/kanban';
import styles from './KanbanFilters.module.css';

interface Props {
  filterAgente: string;
  filterPrioridade: PrioridadeType | 'Todas';
  agentes: string[];
  onFilterAgente: (agente: string) => void;
  onFilterPrioridade: (prioridade: PrioridadeType | 'Todas') => void;
}

const KanbanFiltersComponent = memo(({
  filterAgente,
  filterPrioridade,
  agentes,
  onFilterAgente,
  onFilterPrioridade,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        {/* Filtro Agente */}
        <div className={styles.filterItem}>
          <label htmlFor="filter-agente" className={styles.label}>
            AGENTE:
          </label>
          <select
            id="filter-agente"
            className={styles.select}
            value={filterAgente}
            onChange={(e) => onFilterAgente(e.target.value)}
            aria-label="Filtrar por agente"
          >
            <option value="Todos">Todos</option>
            {agentes.map((agente) => (
              <option key={agente} value={agente}>
                {agente}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Prioridade */}
        <div className={styles.filterItem}>
          <label htmlFor="filter-prioridade" className={styles.label}>
            PRIORIDADE:
          </label>
          <select
            id="filter-prioridade"
            className={styles.select}
            value={filterPrioridade}
            onChange={(e) => onFilterPrioridade(e.target.value as PrioridadeType | 'Todas')}
            aria-label="Filtrar por prioridade"
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Média">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
        </div>
      </div>

      {/* Ações */}
      <div className={styles.actions}>
        <button
          className={styles.btnReset}
          onClick={() => {
            onFilterAgente('Todos');
            onFilterPrioridade('Todas');
          }}
          title="Limpar todos os filtros"
          aria-label="Limpar filtros"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
});

KanbanFiltersComponent.displayName = 'KanbanFilters';

export default KanbanFiltersComponent;
