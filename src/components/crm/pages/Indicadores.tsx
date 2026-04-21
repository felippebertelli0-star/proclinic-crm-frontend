'use client';
export function Indicadores() {
  const dados = [
    { data: '2026-04-10', leads: 12, conversas: 45, propostas: 8, agendamentos: 6, conversao: '50%', faturamento: 'R$ 3.200' },
    { data: '2026-04-11', leads: 15, conversas: 52, propostas: 10, agendamentos: 7, conversao: '66%', faturamento: 'R$ 4.100' },
    { data: '2026-04-12', leads: 8, conversas: 38, propostas: 5, agendamentos: 4, conversao: '50%', faturamento: 'R$ 2.500' },
    { data: '2026-04-13', leads: 18, conversas: 61, propostas: 12, agendamentos: 8, conversao: '66%', faturamento: 'R$ 5.000' },
    { data: '2026-04-14', leads: 11, conversas: 44, propostas: 7, agendamentos: 5, conversao: '45%', faturamento: 'R$ 3.100' },
  ];
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Indicadores</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#3498db', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>↻ Sincronizar</button>
          <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#2ecc71', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>↙ Exportar</button>
        </div>
      </div>
      <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead style={{ borderBottom: '1px solid #1e3d54', background: '#0d1f2d' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>DATA</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>LEADS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>CONVERSAS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>PROPOSTAS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>AGENDAMENTOS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>CONVERSÃO</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '10px' }}>FATURAMENTO</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((d, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1e3d54' }}>
                <td style={{ padding: '12px 16px', color: '#e8edf2' }}>{d.data}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{d.leads}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{d.conversas}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{d.propostas}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{d.agendamentos}</td>
                <td style={{ padding: '12px 16px', color: '#c9943a', fontWeight: 600 }}>{d.conversao}</td>
                <td style={{ padding: '12px 16px', color: '#2ecc71', fontWeight: 600 }}>{d.faturamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
