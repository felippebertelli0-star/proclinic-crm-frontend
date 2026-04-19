/**
 * DeleteRespostaModal - Confirmation modal for deleting quick responses
 * AAA Premium Design
 */

'use client';

import { memo } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { RespostaRapida } from '@/store/respostasRapidasStore';
import styles from './DeleteRespostaModal.module.css';

interface Props {
  resposta: RespostaRapida | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteRespostaModal = memo(({ resposta, isOpen, onConfirm, onCancel }: Props) => {
  if (!isOpen || !resposta) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} onKeyDown={handleKeyDown} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Icon */}
        <div className={styles.iconBox}>
          <AlertCircle size={32} color="#ff9999" />
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>Excluir Resposta?</h3>
          <p className={styles.message}>
            Tem certeza que deseja excluir <strong>"{resposta.titulo}"</strong>? Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Buttons */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            <Trash2 size={16} />
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteRespostaModal.displayName = 'DeleteRespostaModal';

export default DeleteRespostaModal;
