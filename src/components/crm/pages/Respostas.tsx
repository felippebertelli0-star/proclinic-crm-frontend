'use client';
import { useState } from 'react';
export function Respostas() {
  const [searchTerm, setSearchTerm] = useState('');
  const respostas = [
    { id: 1, atalho: '/olá', titulo: 'Saudação Padrão', mensagem: 'Olá! Bem-vindo! Como posso ajudar?', uso: 45 },
    { id: 2, atalho: '/agd', titulo: 'Oferecer Agendamento', mensagem: 'Gostaria de agendar uma consulta?', uso: 127 },
    { id: 3, atalho: '/info', titulo: 'Informações', mensagem: 'Somos uma clínica especializada...', uso: 89 },
    { id: 4, atalho: '/enc', titulo: 'Encerrar', mensagem: 'Obrigado pelo contato!', uso: 156 },
    { id: 5, atalho: '/rae', titulo: 'Reagendar', mensagem: 'Claro! Que dias/horários funcionam melhor?', uso: 78 },
    { id: 6, atalho: '/dúv', titulo: 'Dúvidas', mensagem: 'Tenho as seguintes dúvidas...', uso: 34 },
  ];
  const filtradas = respostas.filter(r => r.atalho.includes(searchTerm) || r.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Respostas Rápidas</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova</button>
      </div>
      <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #1e3d54', background: '#132636', color: '#e8edf2', marginBottom: '20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtradas.map((r) => (
          <div key={r.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(201, 148, 58, 0.2)', color: '#c9943a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{r.atalho}</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ background: 'none', border: 'none', color: '#7a96aa', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                <button style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
              </div>
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0', color: '#e8edf2' }}>{r.titulo}</h3>
            <p style={{ fontSize: '12px', color: '#7a96aa', margin: 0, minHeight: '40px' }}>{r.mensagem}</p>
            <div style={{ fontSize: '10px', color: '#7a96aa', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e3d54' }}>Uso: {r.uso}x</div>
          </div>
        ))}
      </div>
    </div>
  );
}
