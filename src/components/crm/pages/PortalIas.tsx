'use client';
export function PortalIas() {
  const ias = [
    { id: 1, nome: 'Hávila IA', desc: 'Atendimento & Captação', msgs: 2847, concluido: 67, latencia: '99.8%' },
    { id: 2, nome: 'Camilly IA', desc: 'Follow-up & Alimentação', msgs: 1423, concluido: 34, latencia: '99.2%' },
    { id: 3, nome: 'Secretária IA', desc: 'Agendamentos', msgs: 934, concluido: 89, latencia: '100%' },
    { id: 4, nome: 'Triagem IA', desc: 'Qualificação', msgs: 412, concluido: 18, latencia: '—' },
  ];
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Portal das IAs</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Novo Agente</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {ias.map((ia) => (
          <div key={ia.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#9b59b6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>◆</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px 0', color: '#e8edf2' }}>{ia.nome}</h3>
                <div style={{ fontSize: '10px', color: '#7a96aa' }}>{ia.desc}</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '12px' }}>
              <div>Mensagens: {ia.msgs}</div>
              <div>Concluído: {ia.concluido}%</div>
              <div>Latência: {ia.latencia}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Configurar</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Pausar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
