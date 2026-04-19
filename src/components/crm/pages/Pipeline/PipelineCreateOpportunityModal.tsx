/**
 * PipelineCreateOpportunityModal - Modal para criar nova oportunidade
 * Baseado no padrão do modal de Conversas
 */

'use client';

import { memo, useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import { usePipelineStore } from '@/store/pipelineStore';
import styles from './PipelineCreateOpportunityModal.module.css';

const TIPOS = ['Limpeza Dentária', 'Clareamento', 'Implante Dentário', 'Tratamento Estético', 'Consulta', 'Restauração', 'Aparelho Ortodôntico'];
const ORIGENS = ['Instagram', 'Google', 'Tráfego Pago', 'Indicação'];
const AGENTES = ['Hávila', 'Camilly', 'Fernando', 'Luana'];

interface Props {
  onClose: () => void;
}

const PipelineCreateOpportunityModal = memo(({ onClose }: Props) => {
  const { estagios } = usePipelineStore();

  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    origem: '',
    agente: '',
    valor: '',
    etapa: 'novo_lead',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valor' ? value : value,
    }));
  };

  const handleCreate = () => {
    if (!formData.nome || !formData.tipo || !formData.valor || !formData.agente) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Aqui você pode adicionar a lógica para criar a oportunidade
    console.log('Nova oportunidade criada:', {
      ...formData,
      valor: parseInt(formData.valor),
    });

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div style={{ fontSize: '24px' }}>💰</div>
            <div>
              <h3 className={styles.title}>Adicionar Oportunidade</h3>
              <p className={styles.subtitle}>Preencha os dados para criar uma nova oportunidade</p>
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
          {/* NOME */}
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome da Pessoa *</label>
            <input
              id="nome"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João Silva"
            />
          </div>

          {/* TIPO */}
          <div className={styles.formGroup}>
            <label htmlFor="tipo">Tipo de Serviço *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Selecionar tipo...</option>
              {TIPOS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* ORIGEM */}
          <div className={styles.formGroup}>
            <label htmlFor="origem">Origem *</label>
            <select
              id="origem"
              name="origem"
              value={formData.origem}
              onChange={handleChange}
            >
              <option value="">Selecionar origem...</option>
              {ORIGENS.map((origem) => (
                <option key={origem} value={origem}>
                  {origem}
                </option>
              ))}
            </select>
          </div>

          {/* AGENTE */}
          <div className={styles.formGroup}>
            <label htmlFor="agente">Agente Responsável *</label>
            <select
              id="agente"
              name="agente"
              value={formData.agente}
              onChange={handleChange}
            >
              <option value="">Selecionar agente...</option>
              {AGENTES.map((agente) => (
                <option key={agente} value={agente}>
                  {agente}
                </option>
              ))}
            </select>
          </div>

          {/* VALOR */}
          <div className={styles.formGroup}>
            <label htmlFor="valor">Valor (R$) *</label>
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

          {/* ETAPA */}
          <div className={styles.formGroup}>
            <label htmlFor="etapa">Etapa Inicial</label>
            <select
              id="etapa"
              name="etapa"
              value={formData.etapa}
              onChange={handleChange}
            >
              {estagios.map((estagio) => (
                <option key={estagio.id} value={estagio.id}>
                  {estagio.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnCreate} onClick={handleCreate}>
            Criar Oportunidade
          </button>
        </div>
      </div>
    </div>
  );
});

PipelineCreateOpportunityModal.displayName = 'PipelineCreateOpportunityModal';

export default PipelineCreateOpportunityModal;
