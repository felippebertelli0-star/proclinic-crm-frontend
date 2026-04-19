/**
 * KanbanMemberFilter - Seletor de Membros da Equipe
 * Filtrar cards por membro usando botões com avatares
 */

'use client';

import { memo } from 'react';
import { Membro } from '@/types/kanban';
import styles from './KanbanMemberFilter.module.css';

interface Props {
  membros: Membro[];
  selectedMembro: string | null;
  onSelectMembro: (membro: string | null) => void;
}

const KanbanMemberFilterComponent = memo(({
  membros,
  selectedMembro,
  onSelectMembro,
}: Props) => {
  const getMemberInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterLabel}>MEMBRO DA EQUIPE:</div>

      <div className={styles.memberButtons}>
        {/* Botão "Todos" */}
        <button
          className={`${styles.memberBtn} ${selectedMembro === null ? styles.active : ''}`}
          onClick={() => onSelectMembro(null)}
          title="Ver todos os tickets"
          aria-label="Filtrar para todos os membros"
        >
          Todos
        </button>

        {/* Botões dos membros */}
        {membros.map((membro) => (
          <button
            key={membro.id}
            className={`${styles.memberBtn} ${selectedMembro === membro.nome ? styles.active : ''}`}
            onClick={() => onSelectMembro(selectedMembro === membro.nome ? null : membro.nome)}
            title={`Ver tickets de ${membro.nome}`}
            aria-label={`Filtrar tickets de ${membro.nome}`}
            style={{
              backgroundColor: selectedMembro === membro.nome
                ? `${membro.avatarColor}20`
                : 'transparent',
              borderColor: selectedMembro === membro.nome
                ? membro.avatarColor
                : '#1e3d54',
            }}
          >
            {/* Avatar */}
            <div
              className={styles.avatar}
              style={{
                backgroundColor: membro.avatarColor,
                color: '#fff',
              }}
              title={membro.nome}
            >
              {getMemberInitials(membro.nome)}
            </div>
            {/* Nome */}
            <span className={styles.memberName}>{membro.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

KanbanMemberFilterComponent.displayName = 'KanbanMemberFilter';

export default KanbanMemberFilterComponent;
