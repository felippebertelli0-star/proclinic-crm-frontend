/**
 * CreateRespostaModal - Modal para criar/editar resposta rápida
 * AAA Premium Design
 */

'use client';

import { memo, useState, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useRespostasRapidasStore, RespostaRapida } from '@/store/respostasRapidasStore';
import styles from './CreateRespostaModal.module.css';

interface Props {
  onClose: () => void;
  respostaParaEditar?: RespostaRapida | null;
  isOpen?: boolean;
}

const CATEGORIAS = ['Saudação', 'Informação', 'Procedimento', 'Financeiro', 'Técnico', 'Fechamento'];

const CreateRespostaModal = memo(({ onClose, respostaParaEditar, isOpen }: Props) => {
  const { addResposta, updateResposta } = useRespostasRapidasStore();

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'Informação',
    gatilho: '',
    criadoPor: 'Admin',
  });

  const [erro, setErro] = useState('');

  useEffect(() => {
    if (respostaParaEditar) {
      setFormData({
        titulo: respostaParaEditar.titulo,
        conteudo: respostaParaEditar.conteudo,
        categoria: respostaParaEditar.categoria,
        gatilho: respostaParaEditar.gatilho,
        criadoPor: respostaParaEditar.criadoPor,
      });
    }
  }, [respostaParaEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro('');
  };

  const handleSave = () => {
    // Validação
    if (!formData.titulo.trim()) {
      setErro('Título é obrigatório');
      return;
    }
    if (!formData.conteudo.trim()) {
      setErro('Conteúdo é obrigatório');
      return;
    }
    if (!formData.gatilho.trim()) {
      setErro('Gatilho é obrigatório');
      return;
    }

    if (respostaParaEditar) {
      updateResposta(respostaParaEditar.id, formData);
    } else {
      addResposta(formData as any);
    }

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const shouldRender = isOpen !== false;

  if (!shouldRender) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <MessageSquare size={24} color="#0d1f2d" />
            </div>
            <div>
              <h3 className={styles.title}>
                {respostaParaEditar ? 'Editar Resposta Rápida' : 'Nova Resposta Rápida'}
              </h3>
              <p className={styles.subtitle}>
                {respostaParaEditar ? 'Atualize as informações' : 'Crie uma nova resposta automática'}
              </p>
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
          {erro && <div className={styles.erro}>{erro}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="titulo">Título *</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Boas-vindas, Agendamento..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="categoria">Categoria *</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gatilho">Gatilho (palavra-chave) *</label>
              <input
                id="gatilho"
                type="text"
                name="gatilho"
                value={formData.gatilho}
                onChange={handleChange}
                placeholder="Ex: olá, agendar, preço..."
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="conteudo">Conteúdo da Resposta *</label>
            <textarea
              id="conteudo"
              name="conteudo"
              value={formData.conteudo}
              onChange={handleChange}
              placeholder="Escreva a resposta que será enviada..."
              rows={5}
            />
            <span className={styles.charCount}>{formData.conteudo.length}/500</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnSave} onClick={handleSave}>
            {respostaParaEditar ? 'Atualizar' : 'Criar Resposta'}
          </button>
        </div>
      </div>
    </div>
  );
});

CreateRespostaModal.displayName = 'CreateRespostaModal';

export default CreateRespostaModal;
