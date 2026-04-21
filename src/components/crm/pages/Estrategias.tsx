'use client';
import { useState } from 'react';

export function Estrategias() {
  const [mesSelecionado, setMesSelecionado] = useState('Janeiro');
  const [modalAberto, setModalAberto] = useState(false);
  const [textoEstrategia, setTextoEstrategia] = useState('');
  const [contadorCaracteres, setContadorCaracteres] = useState(0);
  const [mesModal, setMesModal] = useState('Janeiro');
  const [carregando, setCarregando] = useState(false);
  const [estrategias, setEstrategias] = useState([
    { id: 1, nome: 'Campanha Tráfego Pago — Abril', canal: 'Ads', status: 'Ativa', investimento: 'R$ 2.500', mes: 'Abril' },
    { id: 2, nome: 'Follow-up Automático IA', canal: 'WhatsApp', status: 'Ativa', investimento: 'Grátis', mes: 'Janeiro' },
    { id: 3, nome: 'Reativação de Leads Frios', canal: 'WhatsApp', status: 'Pausada', investimento: 'R$ 0', mes: 'Fevereiro' },
    { id: 4, nome: 'Instagram Orgânico', canal: 'Instagram', status: 'Ativa', investimento: 'R$ 500', mes: 'Março' },
    { id: 5, nome: 'Email Marketing Mensal', canal: 'Email', status: 'Ativa', investimento: 'R$ 300', mes: 'Janeiro' },
  ]);

  const MAX_CARACTERES_TEXTO = 5000;
  const MIN_CARACTERES_TEXTO = 50;
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handleTextoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const texto = e.target.value;
    const caracteres = texto.length;

    if (caracteres <= MAX_CARACTERES_TEXTO) {
      setTextoEstrategia(texto);
      setContadorCaracteres(caracteres);
    }
  };

  const validarTextoEstrategia = (): { valido: boolean; mensagem?: string } => {
    if (!textoEstrategia.trim()) {
      return { valido: false, mensagem: 'Por favor, insira um texto de estratégia' };
    }
    if (contadorCaracteres < MIN_CARACTERES_TEXTO) {
      return {
        valido: false,
        mensagem: `Texto deve ter pelo menos ${MIN_CARACTERES_TEXTO} caracteres (${contadorCaracteres}/${MIN_CARACTERES_TEXTO})`
      };
    }
    if (contadorCaracteres > MAX_CARACTERES_TEXTO) {
      return {
        valido: false,
        mensagem: `Texto não deve exceder ${MAX_CARACTERES_TEXTO} caracteres (${contadorCaracteres}/${MAX_CARACTERES_TEXTO})`
      };
    }
    if (!mesModal) {
      return { valido: false, mensagem: 'Selecione um mês' };
    }
    return { valido: true };
  };

  const handleSalvarEstrategia = async () => {
    const validacao = validarTextoEstrategia();
    if (!validacao.valido) {
      alert(`⚠️ ${validacao.mensagem}`);
      return;
    }

    setCarregando(true);

    try {
      console.log('[ESTRATEGIAS] Iniciando processamento de texto de estratégia');
      console.log(`[ESTRATEGIAS] Texto: ${contadorCaracteres} caracteres, Mês: ${mesModal}`);

      const payload = {
        texto: textoEstrategia.trim(),
        mes: mesModal,
        tamanho: contadorCaracteres
      };

      console.log('[ESTRATEGIAS] Enviando para API:', payload);

      const response = await fetch('/api/processar-estrategia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const dados = await response.json();

      if (!response.ok) {
        console.error('[ESTRATEGIAS] ✗ Erro HTTP Status:', response.status);
        console.error('[ESTRATEGIAS] ✗ Erro Response:', JSON.stringify(dados, null, 2));
        console.error('[ESTRATEGIAS] ✗ Erro Message:', dados.erro);
        console.error('[ESTRATEGIAS] ✗ Erro Details:', dados.detalhe);
        alert(
          `⚠️ Erro ao processar estratégia:\n${dados.erro}\n\n` +
          (dados.detalhe ? `Detalhes: ${dados.detalhe}` : '')
        );
        return;
      }

      if (dados.sucesso && dados.estrategias && Array.isArray(dados.estrategias)) {
        console.log(`[ESTRATEGIAS] ✓ Sucesso! ${dados.estrategias.length} estratégias criadas`);
        console.log('[ESTRATEGIAS] Estratégias:', dados.estrategias);

        const novasEstrategias = dados.estrategias.map((e: any, idx: number) => ({
          id: Math.max(...estrategias.map(s => s.id), 0) + idx + 1,
          ...e,
          mes: mesModal,
        }));
        setEstrategias([...estrategias, ...novasEstrategias]);
        setTextoEstrategia('');
        setContadorCaracteres(0);
        setModalAberto(false);

        alert(`✅ ${dados.estrategias.length} estratégias criadas automaticamente!`);
      } else {
        console.warn('[ESTRATEGIAS] ⚠️ Resposta não contém estratégias', dados);
        alert('⚠️ Nenhuma estratégia foi extraída do texto. Verifique o conteúdo.');
      }
    } catch (erro) {
      const errorMsg = erro instanceof Error ? erro.message : String(erro);
      console.error('[ESTRATEGIAS] ✗ Erro fatal:', errorMsg);
      alert(`❌ Erro ao processar: ${errorMsg}`);
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

            {/* TEXTAREA DE ESTRATÉGIA */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Insira o texto da estratégia:</label>
              <textarea
                value={textoEstrategia}
                onChange={handleTextoChange}
                placeholder="Cole aqui o texto da estratégia para análise..."
                style={{
                  width: '100%',
                  height: '140px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #1e3d54',
                  background: '#0d1f2d',
                  color: '#e8edf2',
                  fontSize: '13px',
                  fontFamily: "'Segoe UI', sans-serif",
                  resize: 'none',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                maxLength={MAX_CARACTERES_TEXTO}
                disabled={carregando}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#c9943a';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1e3d54';
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: '#7a96aa' }}>
                <span>
                  {contadorCaracteres} / {MAX_CARACTERES_TEXTO} caracteres
                </span>
                {contadorCaracteres < MIN_CARACTERES_TEXTO && (
                  <span style={{ color: '#e74c3c' }}>
                    Mínimo {MIN_CARACTERES_TEXTO} caracteres
                  </span>
                )}
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setModalAberto(false);
                  setTextoEstrategia('');
                  setContadorCaracteres(0);
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
                disabled={carregando || !textoEstrategia.trim() || contadorCaracteres < MIN_CARACTERES_TEXTO}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: (carregando || !textoEstrategia.trim() || contadorCaracteres < MIN_CARACTERES_TEXTO) ? '#666' : '#c9943a',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: (carregando || !textoEstrategia.trim() || contadorCaracteres < MIN_CARACTERES_TEXTO) ? 'not-allowed' : 'pointer',
                  opacity: (carregando || !textoEstrategia.trim() || contadorCaracteres < MIN_CARACTERES_TEXTO) ? 0.5 : 1,
                }}
              >
                {carregando ? '⏳ Processando...' : '✓ Processar Estratégia'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
