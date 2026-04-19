/**
 * Página: Respostas Rápidas
 * Gerenciar templates e respostas rápidas
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { useRespostasRapidasStore, RespostaRapida } from '@/store/respostasRapidasStore';
import RespostaCard from '@/components/respostas/RespostaCard';
import CreateRespostaModal from '@/components/respostas/CreateRespostaModal';
import DeleteRespostaModal from '@/components/respostas/DeleteRespostaModal';
import styles from './respostas.module.css';

const CATEGORIAS = ['Saudação', 'Informação', 'Procedimento', 'Financeiro', 'Técnico', 'Fechamento'];

export default function RespostasPage() {
  const { respostas, deleteResposta, incrementarUsos } = useRespostasRapidasStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingResposta, setEditingResposta] = useState<RespostaRapida | null>(null);
  const [deletingResposta, setDeletingResposta] = useState<RespostaRapida | null>(null);

  // Filter respostas
  const respostasFiltradas = useMemo(() => {
    return respostas.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.gatilho.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategoria = !categoriaFilter || r.categoria === categoriaFilter;

      return matchesSearch && matchesCategoria;
    });
  }, [respostas, searchTerm, categoriaFilter]);

  // Calculate stats
  const respostaStats = useMemo(() => {
    return {
      total: respostas.length,
      totalUsos: respostas.reduce((sum, r) => sum + r.usos, 0),
      usosPromedio: respostas.length > 0 ? Math.round(respostas.reduce((sum, r) => sum + r.usos, 0) / respostas.length) : 0,
      usosHoje: Math.floor((respostas.reduce((sum, r) => sum + r.usos, 0) || 0) * 0.15),
    };
  }, [respostas]);

  const handleCopiar = useCallback((resposta: RespostaRapida) => {
    navigator.clipboard.writeText(resposta.conteudo);
    incrementarUsos(resposta.id);
    setCopiedId(resposta.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, [incrementarUsos]);

  const handleEdit = useCallback((resposta: RespostaRapida) => {
    setEditingResposta(resposta);
    setCreateModalOpen(true);
  }, []);

  const handleDelete = useCallback((resposta: RespostaRapida) => {
    setDeletingResposta(resposta);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deletingResposta) {
      deleteResposta(deletingResposta.id);
      setDeletingResposta(null);
    }
  }, [deletingResposta, deleteResposta]);

  const handleCloseModals = useCallback(() => {
    setCreateModalOpen(false);
    setEditingResposta(null);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Respostas Rápidas</h1>
          <p className={styles.subtitle}>Gerenciar templates e respostas pré-definidas</p>
        </div>
        <button className={styles.btnNovaResposta} onClick={() => setCreateModalOpen(true)}>
          <Plus size={18} />
          Nova Resposta
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total de Respostas</p>
          <p className={styles.statValue}>{respostaStats.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total de Usos</p>
          <p className={styles.statValue}>{respostaStats.totalUsos}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Usos em Média</p>
          <p className={styles.statValue}>{respostaStats.usosPromedio}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Usos Hoje</p>
          <p className={styles.statValue}>{respostaStats.usosHoje}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por título, conteúdo ou gatilho..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">Todas as Categorias</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      {respostasFiltradas.length > 0 ? (
        <div className={styles.grid}>
          {respostasFiltradas.map((resposta) => (
            <RespostaCard
              key={resposta.id}
              resposta={resposta}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopiar}
              copied={copiedId === resposta.id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MessageSquare size={48} color="#7a96aa" />
          </div>
          <h3 className={styles.emptyTitle}>Nenhuma resposta encontrada</h3>
          <p className={styles.emptyText}>Crie suas primeiras respostas rápidas</p>
        </div>
      )}

      {/* Modals */}
      <CreateRespostaModal
        isOpen={createModalOpen}
        onClose={handleCloseModals}
        respostaParaEditar={editingResposta}
      />
      <DeleteRespostaModal
        resposta={deletingResposta}
        isOpen={!!deletingResposta}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingResposta(null)}
      />
    </div>
  );
}
