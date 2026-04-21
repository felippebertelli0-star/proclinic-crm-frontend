/**
 * KanbanModal - Modal para Visualizar Card
 * Acessível e responsivo
 */

'use client';

import { memo, useEffect } from 'react';
import { KanbanCard } from '@/types/kanban';
import { Zap } from 'lucide-react';
import styles from './KanbanModal.module.css';

interface Props {
  card: KanbanCard | null;
  visivel: boolean;
  onFechar: () => void;
  onAbrir: (card: KanbanCard) => void;
}

const KanbanModalComponent = memo(({ card, visivel, onFechar, onAbrir }: Props) => {
  useEffect(() => {
    if (!visivel) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFechar();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [visivel, onFechar]);

  if (!visivel || !card) return null;

  const prioridadeColor = {
    Alta: '#ff6b6b',
    Média: '#ffa940',
    Baixa: '#52c41a',
  };

  return (
    <div className={styles.overlay} onClick={onFechar} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {card.nome}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onFechar}
            title="Fechar (ESC)"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        {/* Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoBlock}>
            <label className={styles.label}>Agente</label>
            <div className={styles.value}>{card.agente}</div>
          </div>

          <div className={styles.infoBlock}>
            <label className={styles.label}>Origem</label>
            <div className={styles.valueWithIcon}>
              <Zap size={12} style={{ color: '#c9943a' }} aria-hidden="true" />
              <span style={{ color: '#c9943a' }}>{card.origem}</span>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <label className={styles.label}>Prioridade</label>
            <div className={styles.value} style={{ color: prioridadeColor[card.prioridade] }}>
              {card.prioridade}
            </div>
          </div>

          <div className={styles.infoBlock}>
            <label className={styles.label}>Tempo</label>
            <div className={styles.value}>{card.tempo}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonSection}>
          <button
            className={styles.btnAbrir}
            onClick={() => {
              onAbrir(card);
              onFechar();
            }}
            title="Abrir conversa completa"
          >
            Abrir Conversa
          </button>
          <button
            className={styles.btnFechar}
            onClick={onFechar}
            title="Fechar modal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
});

KanbanModalComponent.displayName = 'KanbanModal';

export default KanbanModalComponent;
