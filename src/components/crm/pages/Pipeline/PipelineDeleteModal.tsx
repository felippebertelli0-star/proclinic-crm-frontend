/**
 * PipelineDeleteModal - Modal de confirmação de exclusão
 * Dialog simples com ícone de alerta
 */

'use client';

import { memo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Opportunity } from '@/store/pipelineStore';
import styles from './PipelineDeleteModal.module.css';

interface Props {
  opportunity: Opportunity;
  onConfirm: () => void;
  onCancel: () => void;
}

const PipelineDeleteModal = memo(({ opportunity, onConfirm, onCancel }: Props) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div className={styles.modal} role="alertdialog" aria-modal="true">
        {/* Icon */}
        <div className={styles.iconWrapper}>
          <AlertCircle size={40} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2>Deletar Oportunidade</h2>
          <p>
            Tem certeza que deseja excluir <strong>{opportunity.nome}</strong>?
          </p>
          <p className={styles.subtitle}>
            Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.btnCancel}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className={styles.btnDelete}
            onClick={onConfirm}
          >
            Sim, Deletar
          </button>
        </div>
      </div>
    </div>
  );
});

PipelineDeleteModal.displayName = 'PipelineDeleteModal';

export default PipelineDeleteModal;
