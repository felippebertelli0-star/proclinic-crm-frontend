'use client';
export function Webhooks() {
  const webhooks = [
    { id: 1, nome: 'Lead WhatsApp → CRM', status: 'Ativo', chamadas: 1947 },
    { id: 2, nome: 'Agendamento → Google Cal', status: 'Ativo', chamadas: 234 },
    { id: 3, nome: 'Pipeline → Planilha', status: 'Ativo', chamadas: 567 },
    { id: 4, nome: 'IA Qualificação', status: 'Erro', chamadas: 882 },
    { id: 5, nome: 'Relatório Semanal', status: 'Ativo', chamadas: 12 },
  ];
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Webhooks / Triggers</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Novo</button>
      </div>
      <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ borderBottom: '1px solid #1e3d54', background: '#0d1f2d' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '11px' }}>WEBHOOK</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '11px' }}>STATUS</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#7a96aa', fontSize: '11px' }}>CHAMADAS</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#7a96aa', fontSize: '11px' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((w) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #1e3d54' }}>
                <td style={{ padding: '12px 16px', color: '#e8edf2' }}>{w.nome}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: w.status === 'Ativo' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: w.status === 'Ativo' ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>{w.status}</span></td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{w.chamadas}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}><button style={{ background: 'none', border: 'none', color: '#c9943a', cursor: 'pointer', fontSize: '14px' }}>⚙️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
