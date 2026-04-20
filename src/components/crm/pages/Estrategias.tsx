'use client';
import { useState } from 'react';

export function Estrategias() {
  const [mesSelecionado, setMesSelecionado] = useState('Janeiro');
  const [modalAberto, setModalAberto] = useState(false);
  const [imagens, setImagens] = useState<File[]>([]);
  const [mesModal, setMesModal] = useState('Janeiro');
  const [carregando, setCarregando] = useState(false);
  const [estrategias, setEstrategias] = useState([
    { id: 1, nome: 'Campanha Tráfego Pago — Abril', canal: 'Ads', status: 'Ativa', investimento: 'R$ 2.500', mes: 'Abril' },
    { id: 2, nome: 'Follow-up Automático IA', canal: 'WhatsApp', status: 'Ativa', investimento: 'Grátis', mes: 'Janeiro' },
    { id: 3, nome: 'Reativação de Leads Frios', canal: 'WhatsApp', status: 'Pausada', investimento: 'R$ 0', mes: 'Fevereiro' },
    { id: 4, nome: 'Instagram Orgânico', canal: 'Instagram', status: 'Ativa', investimento: 'R$ 500', mes: 'Março' },
    { id: 5, nome: 'Email Marketing Mensal', canal: 'Email', status: 'Ativa', investimento: 'R$ 300', mes: 'Janeiro' },
  ]);

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handleImagemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novasImagens = Array.from(e.target.files);
      const totalImagens = imagens.length + novasImagens.length;

      if (totalImagens > 10) {
        alert(`⚠️ Máximo de 10 imagens! Você selecionou ${totalImagens}`);
        return;
      }

      setImagens([...imagens, ...novasImagens]);
    }
  };

  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index));
  };

  const handleSalvarEstrategia = async () => {
    if (imagens.length === 0) {
      alert('Por favor, selecione pelo menos uma imagem');
      return;
    }

    setCarregando(true);
    try {
      let todasAsEstrategias: any[] = [];

      // Processar cada imagem
      for (let i = 0; i < imagens.length; i++) {
        const formData = new FormData();
        formData.append('file', imagens[i]);
        formData.append('mes', mesModal);

        const response = await fetch('/api/processar-estrategia', {
          method: 'POST',
          body: formData,
        });

        const dados = await response.json();

        if (dados.sucesso) {
          todasAsEstrategias = [...todasAsEstrategias, ...dados.estrategias];
        } else {
          alert(`⚠️ Erro ao processar imagem ${i + 1}: ${dados.erro}`);
        }
      }

      if (todasAsEstrategias.length > 0) {
        // Adicionar todas as novas estratégias
        const novasEstrategias = todasAsEstrategias.map((e: any, idx: number) => ({
          id: Math.max(...estrategias.map(s => s.id), 0) + idx + 1,
          ...e,
          mes: mesModal,
        }));
        setEstrategias([...estrategias, ...novasEstrategias]);
        setModalAberto(false);
        setImagens([]);
        alert(`✅ ${todasAsEstrategias.length} estratégias criadas automaticamente!`);
      }
    } catch (erro) {
      alert('❌ Erro ao enviar imagens: ' + erro);
    } finally {
      setCarregando(false);
    }
  };

  const estrategiasFiltradas = estrategias.filter(e => e.mes === mesSelecionado);

  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Estratégias</h1>
        <button onClick={() => setModalAberto(true)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova</button>
      </div>

      {/* SELETOR DE MESES */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid #1e3d54' }}>
        <span style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600, display: 'flex', alignItems: 'center', marginRight: '8px' }}>Período:</span>
        {meses.map((mes) => (
          <button
            key={mes}
            onClick={() => setMesSelecionado(mes)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: mesSelecionado === mes ? 'none' : '1px solid #1e3d54',
              background: mesSelecionado === mes ? '#c9943a' : 'transparent',
              color: mesSelecionado === mes ? '#0d1f2d' : '#7a96aa',
              fontSize: '12px',
              fontWeight: mesSelecionado === mes ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease-out',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (mesSelecionado !== mes) {
                (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                (e.currentTarget as HTMLElement).style.color = '#c9943a';
              }
            }}
            onMouseLeave={(e) => {
              if (mesSelecionado !== mes) {
                (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                (e.currentTarget as HTMLElement).style.color = '#7a96aa';
              }
            }}
          >
            {mes}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {estrategiasFiltradas.map((e) => (
          <div key={e.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#e8edf2' }}>{e.nome}</h3>
              <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: e.status === 'Ativa' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(243, 156, 18, 0.2)', color: e.status === 'Ativa' ? '#2ecc71' : '#f39c12', fontWeight: 600 }}>{e.status}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '8px' }}>Canal: {e.canal}</div>
            <div style={{ fontSize: '12px', color: '#c9943a', fontWeight: 600 }}>{e.investimento}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FLUTUANTE */}
      {modalAberto && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#132636',
            border: '1px solid #1e3d54',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#e8edf2' }}>Nova Estratégia</h2>

            {/* SELETOR DE MÊS */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Selecione o Mês:</label>
              <select
                value={mesModal}
                onChange={(e) => setMesModal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: '#0d1f2d',
                  color: '#e8edf2',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {meses.map((mes) => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>

            {/* UPLOAD DE IMAGENS */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Upload de Estratégias (até 10 imagens) - {imagens.length}/10:</label>
              <div style={{
                border: '2px dashed #c9943a',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(201, 148, 58, 0.05)',
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagemUpload}
                  style={{ display: 'none' }}
                  id="file-input"
                  disabled={imagens.length >= 10}
                />
                <label htmlFor="file-input" style={{ cursor: imagens.length >= 10 ? 'not-allowed' : 'pointer', display: 'block', opacity: imagens.length >= 10 ? 0.5 : 1 }}>
                  <p style={{ fontSize: '12px', color: '#7a96aa', margin: '0 0 8px 0' }}>📷 Selecione imagens</p>
                  <p style={{ fontSize: '11px', color: '#7a96aa', margin: 0 }}>ou arraste até 10 aqui</p>
                </label>
              </div>

              {/* LISTA DE IMAGENS SELECIONADAS */}
              {imagens.length > 0 && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                  {imagens.map((img, index) => (
                    <div key={index} style={{ position: 'relative', background: '#0d1f2d', border: '1px solid #1e3d54', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: '#7a96aa', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</p>
                      <button
                        onClick={() => removerImagem(index)}
                        style={{
                          width: '100%',
                          padding: '4px',
                          borderRadius: '4px',
                          border: 'none',
                          background: '#c9943a',
                          color: '#0d1f2d',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setModalAberto(false);
                  setImagens([]);
                }}
                disabled={carregando}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: carregando ? 'not-allowed' : 'pointer',
                  opacity: carregando ? 0.5 : 1,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEstrategia}
                disabled={imagens.length === 0 || carregando}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: imagens.length === 0 || carregando ? '#666' : '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: imagens.length === 0 || carregando ? 'not-allowed' : 'pointer',
                  opacity: imagens.length === 0 || carregando ? 0.5 : 1,
                }}
              >
                {carregando ? `⏳ Processando ${imagens.length} imagens...` : `💾 Processar ${imagens.length} imagem${imagens.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
