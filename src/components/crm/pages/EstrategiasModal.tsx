'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const MESES = [
  { valor: 'janeiro', label: 'Janeiro' },
  { valor: 'fevereiro', label: 'Fevereiro' },
  { valor: 'marco', label: 'Março' },
  { valor: 'abril', label: 'Abril' },
  { valor: 'maio', label: 'Maio' },
  { valor: 'junho', label: 'Junho' },
  { valor: 'julho', label: 'Julho' },
  { valor: 'agosto', label: 'Agosto' },
  { valor: 'setembro', label: 'Setembro' },
  { valor: 'outubro', label: 'Outubro' },
  { valor: 'novembro', label: 'Novembro' },
  { valor: 'dezembro', label: 'Dezembro' },
];

interface EstrategiasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EstrategiasModal({ isOpen, onClose }: EstrategiasModalProps) {
  const [textoEstrategia, setTextoEstrategia] = useState('');
  const [mesModal, setMesModal] = useState('');
  const [processando, setProcessando] = useState(false);

  const MAX_CARACTERES = 5000;
  const MIN_CARACTERES = 50;
  const contadorCaracteres = textoEstrategia.length;

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value;
    if (texto.length <= MAX_CARACTERES) {
      setTextoEstrategia(texto);
    }
  };

  const validarTexto = (): boolean => {
    if (!textoEstrategia.trim()) {
      alert('❌ Por favor, insira um texto de estratégia');
      return false;
    }
    if (contadorCaracteres < MIN_CARACTERES) {
      alert(`❌ Mínimo ${MIN_CARACTERES} caracteres (${contadorCaracteres}/${MIN_CARACTERES})`);
      return false;
    }
    if (!mesModal) {
      alert('❌ Selecione um mês');
      return false;
    }
    return true;
  };

  const handleProcessarTexto = async () => {
    if (!validarTexto()) return;

    setProcessando(true);
    try {
      console.log('[ESTRATEGIAS] Enviando texto para processamento...');

      const response = await fetch('/api/processar-estrategia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: textoEstrategia.trim(),
          mes: mesModal,
          tamanho: contadorCaracteres,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        console.error('[ESTRATEGIAS] ✗ Erro na API:', dados);
        alert(`❌ ${dados.erro}\n${dados.detalhe || ''}`);
        return;
      }

      if (dados.sucesso && dados.estrategias?.length > 0) {
        console.log(`[ESTRATEGIAS] ✓ ${dados.estrategias.length} estratégias extraídas`);
        alert(`✅ ${dados.estrategias.length} estratégias criadas com sucesso!`);

        setTextoEstrategia('');
        setMesModal('');
        onClose();
      } else {
        alert('⚠️ Nenhuma estratégia foi extraída. Verifique o texto.');
      }
    } catch (erro) {
      const msg = erro instanceof Error ? erro.message : 'Erro desconhecido';
      console.error('[ESTRATEGIAS] ✗ Erro:', msg);
      alert(`❌ Erro: ${msg}`);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #c9943a, #d9a344)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            Nova Estratégia com IA
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Textarea */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px',
            }}>
              Insira o texto da estratégia:
            </label>
            <textarea
              value={textoEstrategia}
              onChange={handleTextoChange}
              placeholder="Cole aqui o texto da estratégia para análise com IA..."
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'none',
                fontWeight: 400,
              }}
              disabled={processando}
              maxLength={MAX_CARACTERES}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
              fontSize: '12px',
              color: '#6b7280',
            }}>
              <span>{contadorCaracteres} / {MAX_CARACTERES} caracteres</span>
              {contadorCaracteres < MIN_CARACTERES && (
                <span style={{ color: '#dc2626' }}>
                  Mínimo {MIN_CARACTERES} caracteres
                </span>
              )}
            </div>
          </div>

          {/* Seletor de Mês */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px',
            }}>
              Selecione o mês:
            </label>
            <select
              value={mesModal}
              onChange={(e) => setMesModal(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                color: '#1f2937',
                backgroundColor: '#ffffff',
              }}
              disabled={processando}
            >
              <option value="">-- Selecione um mês --</option>
              {MESES.map((mes) => (
                <option key={mes.valor} value={mes.valor}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          borderRadius: '0 0 12px 12px',
        }}>
          <button
            onClick={onClose}
            disabled={processando}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: processando ? 0.5 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleProcessarTexto}
            disabled={
              processando ||
              !textoEstrategia.trim() ||
              contadorCaracteres < MIN_CARACTERES ||
              !mesModal
            }
            style={{
              padding: '10px 20px',
              backgroundColor: '#c9943a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: (processando || !textoEstrategia.trim() || contadorCaracteres < MIN_CARACTERES || !mesModal) ? 0.5 : 1,
            }}
          >
            {processando ? '⏳ Processando...' : '✓ Processar com IA'}
          </button>
        </div>
      </div>
    </div>
  );
}
