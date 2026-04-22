'use client';

import { useMemo, useState } from 'react';
import { Tag as TagIcon, Search, Plus, Grid3x3, List } from 'lucide-react';
import { useEtiquetasStore, Etiqueta } from '@/store/etiquetasStore';
import { useKanbanStore } from '@/store/kanbanStore';
import CreateEtiquetaModal from './Etiquetas/CreateEtiquetaModal';
import ViewEtiquetaCardsModal from './Etiquetas/ViewEtiquetaCardsModal';
import styles from './Etiquetas.module.css';

// Escurece uma cor hex para gerar gradiente
function darken(hex: string, amount = 0.3) {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.floor(parseInt(h.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(parseInt(h.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.floor(parseInt(h.slice(4, 6), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function Etiquetas() {
  const { etiquetas } = useEtiquetasStore();
  const { colunas } = useKanbanStore();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedEtiqueta, setSelectedEtiqueta] = useState<Etiqueta | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const totalCards = useMemo(
    () => colunas.reduce((total, col) => total + col.cards.length, 0),
    [colunas]
  );

  const handleEtiquetaClick = (etiqueta: Etiqueta) => {
    setSelectedEtiqueta(etiqueta);
    setViewModalOpen(true);
  };

  const getTicketsCount = (_etiquetaId: string): number => totalCards;

  const uniqueColors = useMemo(
    () => Array.from(new Set(etiquetas.map((e) => e.cor))),
    [etiquetas]
  );

  const filtered = useMemo(() => {
    return etiquetas.filter((e) => {
      const matchesSearch =
        !search.trim() || e.nome.toLowerCase().includes(search.toLowerCase().trim());
      const matchesColor = !colorFilter || e.cor === colorFilter;
      return matchesSearch && matchesColor;
    });
  }, [etiquetas, search, colorFilter]);

  const stats = useMemo(
    () => ({
      total: etiquetas.length,
      cards: totalCards,
      cores: uniqueColors.length,
      recent: etiquetas.filter((e) => {
        const d = new Date(e.createdAt);
        return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
      }).length,
    }),
    [etiquetas, totalCards, uniqueColors]
  );

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>Organização · Classificação visual</span>
          <h1 className={styles.title}>Etiquetas</h1>
          <p className={styles.subtitle}>Crie categorias com cores para organizar e filtrar seus atendimentos</p>
        </div>
        <button
          className={styles.btnNovaEtiqueta}
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={14} strokeWidth={2.6} /> Nova Etiqueta
        </button>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Total de Etiquetas', value: stats.total, sub: 'cadastradas', color: '#c9943a' },
          { label: 'Cards Associados', value: stats.cards, sub: 'em uso no Kanban', color: '#3498db' },
          { label: 'Paleta de Cores', value: stats.cores, sub: 'cores distintas', color: '#9b59b6' },
          { label: 'Criadas na Semana', value: stats.recent, sub: 'novos registros', color: '#2ecc71' },
        ].map((s) => (
          <div
            key={s.label}
            className={styles.statCard}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
              (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
            }}
          >
            <div className={styles.statLabel}>
              <span style={{ width: 4, height: 14, borderRadius: 2, background: s.color, display: 'inline-block' }} />
              {s.label}
            </div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
            <div className={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar etiqueta por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.colorFilters} title="Filtrar por cor">
          {uniqueColors.map((c) => (
            <button
              key={c}
              onClick={() => setColorFilter(colorFilter === c ? null : c)}
              className={`${styles.colorFilter} ${colorFilter === c ? styles.colorFilterActive : ''}`}
              style={{ background: c }}
              aria-label={`Filtrar pela cor ${c}`}
            />
          ))}
        </div>

        {(colorFilter || search) && (
          <button className={styles.clearFilter} onClick={() => { setColorFilter(null); setSearch(''); }}>
            × Limpar
          </button>
        )}

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${view === 'grid' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setView('grid')}
            aria-label="Visualizar em grade"
          >
            <Grid3x3 size={14} />
          </button>
          <button
            className={`${styles.viewToggleBtn} ${view === 'list' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setView('list')}
            aria-label="Visualizar em lista"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* GRID OU LISTA */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyEmoji}>🏷️</div>
          <div className={styles.emptyTitle}>Nenhuma etiqueta encontrada</div>
          <div className={styles.emptyText}>
            {search || colorFilter
              ? 'Tente ajustar os filtros ou limpe a busca.'
              : 'Crie sua primeira etiqueta para começar a organizar.'}
          </div>
          {!search && !colorFilter && (
            <button className={styles.btnNovaEtiqueta} onClick={() => setCreateModalOpen(true)}>
              <Plus size={14} strokeWidth={2.6} /> Criar Primeira Etiqueta
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className={styles.grid}>
          {filtered.map((etiqueta) => {
            const count = getTicketsCount(etiqueta.id);
            const cssVars: React.CSSProperties & Record<string, string> = {
              color: etiqueta.cor,
              '--cor': etiqueta.cor,
              '--cor-dark': darken(etiqueta.cor, 0.3),
              '--cor-bg': `${etiqueta.cor}1f`,
              '--cor-border': `${etiqueta.cor}50`,
              '--cor-shadow': `${etiqueta.cor}55`,
              '--glow': `${etiqueta.cor}25`,
            };
            return (
              <button
                key={etiqueta.id}
                className={styles.etiquetaCard}
                onClick={() => handleEtiquetaClick(etiqueta)}
                style={cssVars}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
                  (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                <div className={styles.iconBox}>
                  <TagIcon size={22} strokeWidth={2.2} />
                </div>
                <div className={styles.content}>
                  <div className={styles.nomeRow}>
                    <div className={styles.nome}>{etiqueta.nome}</div>
                    <div className={styles.countBadge}>
                      {count} {count === 1 ? 'card' : 'cards'}
                    </div>
                  </div>
                  <div className={styles.etiquetaBadge}>{etiqueta.nome}</div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          {filtered.map((etiqueta) => {
            const count = getTicketsCount(etiqueta.id);
            const cssVars: React.CSSProperties & Record<string, string> = {
              color: etiqueta.cor,
              '--cor': etiqueta.cor,
              '--cor-dark': darken(etiqueta.cor, 0.3),
              '--cor-bg': `${etiqueta.cor}1f`,
              '--cor-border': `${etiqueta.cor}50`,
              '--cor-shadow': `${etiqueta.cor}55`,
            };
            return (
              <button
                key={etiqueta.id}
                className={styles.listRow}
                onClick={() => handleEtiquetaClick(etiqueta)}
                style={cssVars}
              >
                <div className={styles.listDot}>
                  <TagIcon size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <div className={styles.listNome}>{etiqueta.nome}</div>
                  <div className={styles.listDesc}>
                    {etiqueta.descricao || 'Etiqueta de classificação'}
                  </div>
                </div>
                <div className={styles.listCount}>{count} {count === 1 ? 'card' : 'cards'}</div>
                <div className={styles.listCount}>{etiqueta.cor.toUpperCase()}</div>
                <div className={styles.listColorChip}>{etiqueta.nome}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* MODAIS */}
      {createModalOpen && <CreateEtiquetaModal onClose={() => setCreateModalOpen(false)} />}
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
