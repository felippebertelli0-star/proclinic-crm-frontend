'use client';
export function FlowBuilder() {
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>FlowBuilder</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#2ecc71', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>✓ Publicar</button>
          <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#3498db', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>💾 Salvar</button>
        </div>
      </div>
      <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '32px', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '48px' }}>🔀</div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#e8edf2' }}>Editor de Fluxos</div>
        <div style={{ fontSize: '13px', color: '#7a96aa', textAlign: 'center', maxWidth: '400px' }}>Crie fluxos visuais de automação com arraste e solte. Adicione ações, condições e triggers para automatizar seu CRM.</div>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '16px' }}>+ Novo Fluxo</button>
      </div>
    </div>
  );
}
