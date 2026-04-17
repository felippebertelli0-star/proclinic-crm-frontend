'use client';
export function Arquivos() {
  const arquivos = [
    { id: 1, nome: 'Laudo_Fernanda.pdf', tipo: 'PDF', tamanho: '2.4 MB', data: '2026-04-15' },
    { id: 2, nome: 'Exame_Participação.jpg', tipo: 'Imagem', tamanho: '1.8 MB', data: '2026-04-14' },
    { id: 3, nome: 'Contrato_Plano.docx', tipo: 'Documento', tamanho: '0.8 MB', data: '2026-04-13' },
    { id: 4, nome: 'Receita_Dentista.pdf', tipo: 'PDF', tamanho: '1.2 MB', data: '2026-04-12' },
    { id: 5, nome: 'Foto_Antes_01.jpg', tipo: 'Imagem', tamanho: '3.1 MB', data: '2026-04-11' },
    { id: 6, nome: 'Foto_Depois_01.jpg', tipo: 'Imagem', tamanho: '2.9 MB', data: '2026-04-10' },
  ];
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: '248 Arquivos', cor: '#c9943a' },
          { label: '142 Imagens', cor: '#3498db' },
          { label: '76 Documentos', cor: '#2ecc71' },
          { label: '2.4 GB Usados', cor: '#f39c12' },
        ].map((card, idx) => (
          <div key={idx} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: card.cor }}>{card.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Arquivos Recentes</h2>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>📤 Upload</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {arquivos.map((a) => (
          <div key={a.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: a.tipo === 'PDF' ? 'rgba(231, 76, 60, 0.2)' : a.tipo === 'Imagem' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(46, 204, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {a.tipo === 'PDF' ? '📄' : a.tipo === 'Imagem' ? '🖼️' : '📋'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nome}</div>
                <div style={{ fontSize: '10px', color: '#7a96aa' }}>{a.tamanho} • {a.data}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '6px', borderRadius: '4px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Baixar</button>
              <button style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #1e3d54', background: 'transparent', color: '#e74c3c', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
