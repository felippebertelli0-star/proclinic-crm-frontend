'use client';
export function Estrategias() {
  const estrategias = [
    { id: 1, nome: 'Campanha Tráfego Pago — Abril', canal: 'Ads', status: 'Ativa', investimento: 'R$ 2.500' },
    { id: 2, nome: 'Follow-up Automático IA', canal: 'WhatsApp', status: 'Ativa', investimento: 'Grátis' },
    { id: 3, nome: 'Reativação de Leads Frios', canal: 'WhatsApp', status: 'Pausada', investimento: 'R$ 0' },
    { id: 4, nome: 'Instagram Orgânico', canal: 'Instagram', status: 'Ativa', investimento: 'R$ 500' },
    { id: 5, nome: 'Email Marketing Mensal', canal: 'Email', status: 'Ativa', investimento: 'R$ 300' },
  ];
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Estratégias</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {estrategias.map((e) => (
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
    </div>
  );
}
