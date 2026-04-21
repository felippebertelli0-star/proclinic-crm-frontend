'use client';
export function Followups() {
  const followups = [
    { id: 1, nome: 'Maria Rosa', canal: 'WhatsApp', status: 'Urgente', data: '2026-04-18', acao: 'Ligar' },
    { id: 2, nome: 'Carlos Mendes', canal: 'Instagram', status: 'Agendado', data: '2026-04-19', acao: 'Mensagem' },
    { id: 3, nome: 'Ana Paula', canal: 'WhatsApp', status: 'Urgente', data: '2026-04-18', acao: 'Confirmar' },
    { id: 4, nome: 'Laura Ferreira', canal: 'Email', status: 'Pendente', data: '2026-04-20', acao: 'Enviar' },
    { id: 5, nome: 'Patricia Lima', canal: 'WhatsApp', status: 'Convertida', data: '2026-04-17', acao: 'Nenhuma' },
  ];
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Follow-ups</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Novo</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {followups.map((f) => (
          <div key={f.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0', color: '#e8edf2' }}>{f.nome}</h3>
                <div style={{ fontSize: '11px', color: '#7a96aa' }}>{f.canal}</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: f.status === 'Urgente' ? '#e74c3c' : f.status === 'Convertida' ? '#2ecc71' : '#f39c12' }}>{f.status}</div>
            </div>
            <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '12px' }}>Data: {f.data}</div>
            <button style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #c9943a', background: 'transparent', color: '#c9943a', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{f.acao}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
