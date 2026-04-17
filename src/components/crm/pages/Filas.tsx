'use client';
export function Filas() {
  const filas = [
    { id: 1, nome: 'Comercial', tickets: 42, tmr: '5 min', taxa: '89%', agentes: 3 },
    { id: 2, nome: 'Secretária', tickets: 18, tmr: '3 min', taxa: '95%', agentes: 2 },
    { id: 3, nome: 'IA — Auto', tickets: 87, tmr: '1 min', taxa: '100%', agentes: 1 },
    { id: 4, nome: 'Suporte', tickets: 11, tmr: '8 min', taxa: '78%', agentes: 1 },
    { id: 5, nome: 'Aguardando', tickets: 29, tmr: '—', taxa: '—', agentes: 0 },
  ];
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Filas</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova Fila</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filas.map((f) => (
          <div key={f.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0', color: '#e8edf2' }}>{f.nome}</h3>
            <div style={{ fontSize: '12px', color: '#7a96aa', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <div>Tickets: <span style={{ color: '#c9943a', fontWeight: 600 }}>{f.tickets}</span></div>
              <div>TMR: <span style={{ color: '#2ecc71', fontWeight: 600 }}>{f.tmr}</span></div>
              <div>Taxa: <span style={{ color: '#3498db', fontWeight: 600 }}>{f.taxa}</span></div>
              <div>Agentes: <span style={{ color: '#e8edf2', fontWeight: 600 }}>{f.agentes}</span></div>
            </div>
            <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #c9943a', background: 'transparent', color: '#c9943a', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Configurar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
