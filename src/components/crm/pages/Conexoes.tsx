'use client';
export function Conexoes() {
  const canais = [
    { id: 1, nome: 'WhatsApp Business', status: 'Conectado', msgs: 2847, cor: '#2ecc71' },
    { id: 2, nome: 'Instagram Direct', status: 'Desconectado', msgs: 0, cor: '#e74c3c' },
    { id: 3, nome: 'Telegram', status: 'Desconectado', msgs: 0, cor: '#e74c3c' },
    { id: 4, nome: 'E-mail', status: 'Desconectado', msgs: 0, cor: '#e74c3c' },
  ];
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Conexões</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Conectar</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {canais.map((c) => (
          <div key={c.id} style={{ background: '#132636', border: `2px solid ${c.cor}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: c.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {c.nome.includes('WhatsApp') ? '💬' : c.nome.includes('Instagram') ? '📸' : c.nome.includes('Telegram') ? '✈️' : '📧'}
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#e8edf2' }}>{c.nome}</h3>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '3px', background: c.status === 'Conectado' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', color: c.status === 'Conectado' ? '#2ecc71' : '#e74c3c', fontWeight: 600 }}>{c.status}</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#7a96aa', marginBottom: '12px' }}>Mensagens: {c.msgs}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Configurar</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Desconectar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
