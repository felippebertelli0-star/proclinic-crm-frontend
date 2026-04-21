/**
 * ViewEtiquetaCardsModal - Modal para visualizar cards de uma etiqueta
 */

'use client';

import { memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Briefcase, ExternalLink } from 'lucide-react';
import { useKanbanStore } from '@/store/kanbanStore';
import { Etiqueta } from '@/store/etiquetasStore';
import { KanbanCard } from '@/types/kanban';
import styles from './ViewEtiquetaCardsModal.module.css';

interface Props {
  etiqueta: Etiqueta;
  onClose: () => void;
}

const ViewEtiquetaCardsModal = memo(({ etiqueta, onClose }: Props) => {
  const router = useRouter();
  const { colunas } = useKanbanStore();

  // Busca todos os cards das colunas
  const allCards: KanbanCard[] = colunas.flatMap((col) => col.cards);

  // Simula filtro por etiqueta (cards que pertencem a essa etiqueta)
  // Para implementação completa, seria necessário adicionar campo "etiquetas" no KanbanCard
  const cardsDoEtiqueta = allCards;

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta':
        return '#e74c3c';
      case 'Média':
        return '#f39c12';
      case 'Baixa':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAbrirTicket = (card: KanbanCard) => {
    // Navega para conversas com a pessoa como parâmetro de busca
    const url = `/dashboard/conversas?pessoa=${encodeURIComponent(card.nome)}`;
    console.log('Redirecionando para:', url);
    router.push(url);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* HEADER */}
        <div className={styles.header} style={{ borderTopColor: etiqueta.cor }}>
          <div className={styles.headerContent}>
            <div
              className={styles.etiquetaBadge}
              style={{ backgroundColor: etiqueta.cor }}
            >
              <Briefcase size={16} color="#fff" />
            </div>
            <div>
              <h3 className={styles.title}>{etiqueta.nome}</h3>
              <p className={styles.subtitle}>
                {cardsDoEtiqueta.length} card{cardsDoEtiqueta.length !== 1 ? 's' : ''} associado
                {cardsDoEtiqueta.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {cardsDoEtiqueta.length > 0 ? (
            <div className={styles.cardsList}>
              {cardsDoEtiqueta.map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{card.nome}</div>
                    <button
                      className={styles.btnAbrirTicket}
                      onClick={() => handleAbrirTicket(card)}
                      title="Abrir ticket em conversas"
                      style={{ borderColor: etiqueta.cor, color: etiqueta.cor }}
                    >
                      <ExternalLink size={14} />
                      <span>Abrir Ticket</span>
                    </button>
                  </div>
                  <div className={styles.cardDetails}>
                    <span className={styles.cardMeta}>
                      <strong>Agente:</strong> {card.agente}
                    </span>
                    <span className={styles.cardMeta}>
                      <strong>Origem:</strong> {card.origem}
                    </span>
                    <span className={styles.cardMeta}>
                      <strong>Tempo:</strong> {card.tempo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <h4 className={styles.emptyTitle}>Nenhum card encontrado</h4>
              <p className={styles.emptyText}>
                Ainda não há cards associados a esta etiqueta
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.btnClose} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
});

ViewEtiquetaCardsModal.displayName = 'ViewEtiquetaCardsModal';

export default ViewEtiquetaCardsModal;
