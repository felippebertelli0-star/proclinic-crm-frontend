'use client';

import { useState } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { useEtiquetasStore, Etiqueta } from '@/store/etiquetasStore';
import { useKanbanStore } from '@/store/kanbanStore';
import CreateEtiquetaModal from './Etiquetas/CreateEtiquetaModal';
import ViewEtiquetaCardsModal from './Etiquetas/ViewEtiquetaCardsModal';
import styles from './Etiquetas.module.css';

export function Etiquetas() {
  const { etiquetas } = useEtiquetasStore();
  const { colunas } = useKanbanStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEtiqueta, setSelectedEtiqueta] = useState<Etiqueta | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleEtiquetaClick = (etiqueta: Etiqueta) => {
    setSelectedEtiqueta(etiqueta);
    setViewModalOpen(true);
  };

  const getTicketsCount = (etiquetaId: string): number => {
    // Para agora, retorna o total de cards das colunas
    // Futuramente, seria necessário adicionar relação etiqueta-card
    return colunas.reduce((total, col) => total + col.cards.length, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Etiquetas</h1>
          <p className={styles.subtitle}>Organize e classifique seus atendimentos</p>
        </div>
        <button
          className={styles.btnNovaEtiqueta}
          onClick={() => setCreateModalOpen(true)}
        >
          + Nova Etiqueta
        </button>
      </div>

      <div className={styles.grid}>
        {etiquetas.map((etiqueta) => (
          <button
            key={etiqueta.id}
            className={styles.etiquetaCard}
            onClick={() => handleEtiquetaClick(etiqueta)}
            style={{ borderColor: etiqueta.cor }}
          >
            <div
              className={styles.iconBox}
              style={{ backgroundColor: etiqueta.cor }}
            >
              <TagIcon size={20} color="#fff" />
            </div>
            <div className={styles.content}>
              <div className={styles.nomeComTitulo}>
                <div className={styles.nome}>{etiqueta.nome}</div>
                <div className={styles.cardCount} style={{ color: etiqueta.cor }}>
                  {getTicketsCount(etiqueta.id)} card{getTicketsCount(etiqueta.id) !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Etiqueta Badge - Discreto com opacidade, sem ícone */}
              <div
                className={styles.etiquetaBadge}
                style={{
                  backgroundColor: `${etiqueta.cor}1a`, // 10% opacidade
                  borderColor: `${etiqueta.cor}40`, // 25% opacidade
                  color: etiqueta.cor,
                }}
              >
                <span>{etiqueta.nome}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL DE CRIAR ETIQUETA */}
      {createModalOpen && (
        <CreateEtiquetaModal
          onClose={() => setCreateModalOpen(false)}
        />
      )}

      {/* MODAL DE VISUALIZAR CARDS */}
      {viewModalOpen && selectedEtiqueta && (
        <ViewEtiquetaCardsModal
          etiqueta={selectedEtiqueta}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedEtiqueta(null);
          }}
        />
      )}
    </div>
  );
}
