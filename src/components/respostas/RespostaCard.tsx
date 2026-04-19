/**
 * RespostaCard - Card component for quick responses
 * AAA Premium Design
 */

'use client';

import { memo } from 'react';
import { MessageSquare, Edit2, Trash2, Copy } from 'lucide-react';
import { RespostaRapida } from '@/store/respostasRapidasStore';
import styles from './RespostaCard.module.css';

interface Props {
  resposta: RespostaRapida;
  onEdit: (resposta: RespostaRapida) => void;
  onDelete: (resposta: RespostaRapida) => void;
  onCopy: (resposta: RespostaRapida) => void;
  copied?: boolean;
}

const RespostaCard = memo(({ resposta, onEdit, onDelete, onCopy, copied }: Props) => {
  const categoriaCores: Record<string, string> = {
    'Saudação': '#c9943a',
    'Informação': '#3498db',
    'Procedimento': '#9b59b6',
    'Financeiro': '#2ecc71',
    'Técnico': '#e74c3c',
    'Fechamento': '#f39c12',
  };

  const corCategoria = categoriaCores[resposta.categoria] || '#7a96aa';

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconWrapper} style={{ background: `linear-gradient(135deg, ${corCategoria} 0%, ${corCategoria}dd 100%)` }}>
            <MessageSquare size={20} color="#0d1f2d" />
          </div>
          <div>
            <h3 className={styles.titulo}>{resposta.titulo}</h3>
            <p className={styles.gatilho}>Gatilho: {resposta.gatilho}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.conteudo}>{resposta.conteudo}</p>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.metadata}>
          <span className={styles.categoria} style={{ borderColor: corCategoria, color: corCategoria }}>
            {resposta.categoria}
          </span>
          <span className={styles.usos}>{resposta.usos} usos</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnAction}
            onClick={() => onCopy(resposta)}
            title="Copiar resposta"
            aria-label="Copiar resposta"
          >
            {copied ? (
              <span className={styles.copied}>✓</span>
            ) : (
              <Copy size={16} />
            )}
          </button>
          <button
            className={styles.btnAction}
            onClick={() => onEdit(resposta)}
            title="Editar resposta"
            aria-label="Editar resposta"
          >
            <Edit2 size={16} />
          </button>
          <button
            className={styles.btnAction}
            onClick={() => onDelete(resposta)}
            title="Deletar resposta"
            aria-label="Deletar resposta"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

RespostaCard.displayName = 'RespostaCard';

export default RespostaCard;
