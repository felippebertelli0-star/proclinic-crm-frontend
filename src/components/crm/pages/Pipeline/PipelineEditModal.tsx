/**
 * PipelineEditModal - Modal para editar oportunidade
 * Formulário com campos pré-definidos
 */

'use client';

import { memo, useState } from 'react';
import { X } from 'lucide-react';
import { Opportunity, usePipelineStore } from '@/store/pipelineStore';
import styles from './PipelineEditModal.module.css';

const TIPOS = ['Limpeza Dentária', 'Clareamento', 'Implante Dentário', 'Tratamento Estético', 'Consulta', 'Restauração', 'Aparelho Ortodôntico'];
const ORIGENS = ['Instagram', 'Google', 'Tráfego Pago', 'Indicação'];
const AGENTES = ['Hávila', 'Camilly', 'Fernando', 'Luana'];

interface Props {
  stageId: string;
  opportunity: Opportunity;
  onClose: () => void;
}

const PipelineEditModal = memo(({ stageId, opportunity, onClose }: Props) => {
  const { updateOpportunity } = usePipelineStore();

  const [formData, setFormData] = useState({
    nome: opportunity.nome,
    tipo: opportunity.tipo,
    origem: opportunity.origem,
    agente: opportunity.agente,
    valor: opportunity.valor,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valor' ? parseInt(value) : value,
    }));
  };

  const handleSave = () => {
    updateOpportunity(stageId, opportunity.id, formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} onKeyDown={handleKeyDown} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <h2>Editar Oportunidade</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome da pessoa"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tipo">Tipo de Serviço</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Selecione um tipo</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="origem">Origem</label>
            <select
              id="origem"
              name="origem"
              value={formData.origem}
              onChange={handleChange}
            >
              <option value="">Selecione uma origem</option>
              {ORIGENS.map((origem) => (
                <option key={origem} value={origem}>
                  {origem}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="agente">Agente</label>
            <select
              id="agente"
              name="agente"
              value={formData.agente}
              onChange={handleChange}
            >
              <option value="">Selecione um agente</option>
              {AGENTES.map((agente) => (
                <option key={agente} value={agente}>
                  {agente}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={styles.btnSave}
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
});

PipelineEditModal.displayName = 'PipelineEditModal';

export default PipelineEditModal;
