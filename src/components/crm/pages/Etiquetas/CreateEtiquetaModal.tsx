/**
 * CreateEtiquetaModal - Modal para criar nova etiqueta
 */

'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { useEtiquetasStore, CORES_PADRAO } from '@/store/etiquetasStore';
import styles from './CreateEtiquetaModal.module.css';

interface Props {
  onClose: () => void;
}

const CreateEtiquetaModal = memo(({ onClose }: Props) => {
  const { addEtiqueta } = useEtiquetasStore();
  const pickerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    cor: CORES_PADRAO[0],
    descricao: '',
  });

  const [showAdvancedPicker, setShowAdvancedPicker] = useState(false);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (cor: string) => {
    setFormData((prev) => ({
      ...prev,
      cor,
    }));
  };

  const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pickerRef.current) return;

    const rect = pickerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));

    // Criar cor RGB baseado na posição horizontal
    const hue = percentage * 360;
    const cor = `hsl(${hue}, 100%, 50%)`;

    setFormData((prev) => ({
      ...prev,
      cor,
    }));
  };

  const handleCreate = () => {
    if (!formData.nome) {
      alert('Por favor, preencha o nome da etiqueta');
      return;
    }

    addEtiqueta(formData.nome, formData.cor, formData.descricao);
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
            <div style={{ fontSize: '24px' }}>
              <TagIcon size={24} color="#0d1f2d" />
            </div>
            <div>
              <h3 className={styles.title}>Nova Etiqueta</h3>
              <p className={styles.subtitle}>Crie uma nova etiqueta para organizar seus tickets</p>
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
            <label htmlFor="nome">Nome da Etiqueta *</label>
            <input
              id="nome"
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Urgente, Rotina, etc..."
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className={styles.formGroup}>
            <label htmlFor="descricao">Descrição (opcional)</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o propósito desta etiqueta..."
              rows={3}
            />
          </div>

          {/* COR */}
          <div className={styles.formGroup}>
            <label>Escolha uma cor *</label>

            {/* Paleta de cores padrão - Círculos pequenos */}
            <div className={styles.colorPaletteSmall}>
              {CORES_PADRAO.map((cor) => (
                <button
                  key={cor}
                  className={`${styles.colorCircle} ${formData.cor === cor ? styles.colorCircleActive : ''}`}
                  style={{ backgroundColor: cor }}
                  onClick={() => handleColorChange(cor)}
                  title={cor}
                  aria-label={`Selecionar cor ${cor}`}
                />
              ))}
            </div>

            {/* Color Picker Avançado */}
            <button
              className={styles.pickerToggle}
              onClick={() => setShowAdvancedPicker(!showAdvancedPicker)}
            >
              {showAdvancedPicker ? '−' : '+'}  Cor Personalizada
            </button>

            {showAdvancedPicker && (
              <div className={styles.advancedPickerContainer}>
                <div
                  ref={pickerRef}
                  className={styles.colorGradient}
                  onClick={handlePickerClick}
                  role="slider"
                  aria-label="Seletor de cores RGB"
                  tabIndex={0}
                />
                <p className={styles.pickerHint}>Clique ou arraste para escolher uma cor</p>
              </div>
            )}

            {/* Preview */}
            <div className={styles.colorPreview}>
              <span>Preview:</span>
              <div
                className={styles.previewBox}
                style={{ backgroundColor: formData.cor }}
              >
                {formData.nome || 'Sua Etiqueta'}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnCreate} onClick={handleCreate}>
            Criar Etiqueta
          </button>
        </div>
      </div>
    </div>
  );
});

CreateEtiquetaModal.displayName = 'CreateEtiquetaModal';

export default CreateEtiquetaModal;
