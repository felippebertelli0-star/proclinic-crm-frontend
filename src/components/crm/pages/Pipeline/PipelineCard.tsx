/**
 * PipelineCard - Card Individual de Oportunidade
 * Com suporte a drag-and-drop (Draggable) e ações interativas
 */

'use client';

import { memo, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/navigation';
import { Edit, Eye, Trash2, Sparkles, Zap, Palette, Users, Phone, Wrench } from 'lucide-react';
import { Opportunity } from '@/store/pipelineStore';
import { usePipelineStore } from '@/store/pipelineStore';
import PipelineEditModal from './PipelineEditModal';
import PipelineDeleteModal from './PipelineDeleteModal';
import styles from './PipelineCard.module.css';

const TIPO_ICONS: Record<string, React.ReactNode> = {
  'Limpeza': <Sparkles size={14} />,
  'Implante': <Zap size={14} />,
  'Clareamento': <Palette size={14} />,
  'Tratamento Estético': <Users size={14} />,
  'Consulta': <Phone size={14} />,
  'Restauração': <Wrench size={14} />,
};

const TIPO_COLORS: Record<string, string> = {
  'Limpeza': '#2ecc71',
  'Implante': '#e74c3c',
  'Clareamento': '#f39c12',
  'Tratamento Estético': '#9b59b6',
  'Consulta': '#3498db',
  'Restauração': '#1abc9c',
};

interface Props {
  stageId: string;
  opportunity: Opportunity;
  stagColor: string;
  index: number;
}

const PipelineCardComponent = memo(({ stageId, opportunity, stagColor, index }: Props) => {
  const router = useRouter();
  const { deleteOpportunity } = usePipelineStore();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const initials = opportunity.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleVisualize = () => {
    // Redirecionar para conversas filtrando pelo nome
    router.push(`/dashboard/conversas?pessoa=${encodeURIComponent(opportunity.nome)}`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteOpportunity(stageId, opportunity.id);
    setDeleteModalOpen(false);
  };

  const tipoColor = opportunity.tipo ? TIPO_COLORS[opportunity.tipo] || stagColor : stagColor;
  const tipoIcon = opportunity.tipo ? TIPO_ICONS[opportunity.tipo] : null;

  return (
    <>
      <Draggable draggableId={`${opportunity.id}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
            style={{
              ...provided.draggableProps.style,
              background: snapshot.isDragging
                ? `linear-gradient(135deg, ${stagColor}40 0%, ${stagColor}20 100%)`
                : `linear-gradient(135deg, #1e3a4d 0%, #0f2536 100%)`,
              borderLeft: `3px solid ${tipoColor}`,
            }}
          >
            {/* Avatar + Info */}
            <div className={styles.header}>
              <div
                className={styles.avatar}
                style={{
                  background: `linear-gradient(135deg, ${stagColor} 0%, ${stagColor}dd 100%)`,
                }}
                title={opportunity.nome}
              >
                {initials}
              </div>

              <div className={styles.nomeSection}>
                <div className={styles.nome} title={opportunity.nome}>
                  {opportunity.nome}
                </div>

                {opportunity.tipo && (
                  <div className={styles.tipo} title={opportunity.tipo} style={{ color: tipoColor }}>
                    <span className={styles.tipoIcon}>{tipoIcon}</span>
                    {opportunity.tipo}
                  </div>
                )}

                <div className={styles.metadata}>
                  {opportunity.origem && (
                    <div className={styles.metaItem} title={opportunity.origem}>
                      <span>{opportunity.origem}</span>
                    </div>
                  )}
                  {opportunity.agente && (
                    <div className={styles.metaItem} title={opportunity.agente}>
                      <span>{opportunity.agente}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer com Valor e Ações */}
            <div className={styles.footer}>
              <div className={styles.valor} style={{ color: stagColor }}>
                R$ {opportunity.valor.toLocaleString('pt-BR')}
              </div>

              {/* Action Icons (aparecem no hover) */}
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  title="Editar"
                  onClick={handleEdit}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Edit size={14} />
                </button>
                <button
                  className={styles.actionBtn}
                  title="Visualizar Conversa"
                  onClick={handleVisualize}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Eye size={14} />
                </button>
                <button
                  className={styles.actionBtn}
                  title="Deletar"
                  onClick={handleDelete}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Modais */}
      {editModalOpen && (
        <PipelineEditModal
          stageId={stageId}
          opportunity={opportunity}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {deleteModalOpen && (
        <PipelineDeleteModal
          opportunity={opportunity}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
});

PipelineCardComponent.displayName = 'PipelineCard';

export default PipelineCardComponent;
