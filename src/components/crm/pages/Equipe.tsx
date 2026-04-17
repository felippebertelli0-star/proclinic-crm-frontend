'use client';
export function Equipe() {
  const membros = [
    { id: 1, nome: 'Hávila Rodrigues', cargo: 'Gerente', status: 'Online', tickets: 87, conversas: 45, tmr: '5 min' },
    { id: 2, nome: 'Camilly Nunes', cargo: 'Atendente', status: 'Online', tickets: 34, conversas: 22, tmr: '6 min' },
    { id: 3, nome: 'Fernando Silva', cargo: 'Atendente', status: 'Offline', tickets: 12, conversas: 8, tmr: '8 min' },
    { id: 4, nome: 'Luana Costa', cargo: 'Suporte', status: 'Ausente', tickets: 5, conversas: 3, tmr: '10 min' },
  ];
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Equipe</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Convidar</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {membros.map((m) => (
          <div key={m.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#c9943a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#0d1f2d' }}>{m.nome[0]}</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0', color: '#e8edf2' }}>{m.nome}</h3>
                <div style={{ fontSize: '10px', color: '#7a96aa' }}>{m.cargo}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, color: m.status === 'Online' ? '#2ecc71' : m.status === 'Ausente' ? '#f39c12' : '#e74c3c' }}>{m.status === 'Online' ? '🟢' : m.status === 'Ausente' ? '🟡' : '⚫'}</div>
            </div>
            <div style={{ fontSize: '11px', color: '#7a96aa', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              <div>Tickets: {m.tickets}</div>
              <div>Conversas: {m.conversas}</div>
              <div>TMR: {m.tmr}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #c9943a', background: 'transparent', color: '#c9943a', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>💬 Msg</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
