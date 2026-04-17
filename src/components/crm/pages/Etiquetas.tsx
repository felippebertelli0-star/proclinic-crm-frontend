'use client';
import { useState } from 'react';
export function Etiquetas() {
  const etiquetas = [
    { id: 1, nome: 'Lead de Tráfego', categoria: 'Atendimento', tickets: 11, cor: '#3498db' },
    { id: 2, nome: 'Plano de Saúde', categoria: 'Comercial', tickets: 8, cor: '#2ecc71' },
    { id: 3, nome: 'Tratamento Hormonal', categoria: 'Procedimento', tickets: 0, cor: '#e74c3c' },
    { id: 4, nome: 'Follow-up 1', categoria: 'Atendimento', tickets: 4, cor: '#f39c12' },
    { id: 5, nome: 'Pareo de Responder', categoria: 'Atendimento', tickets: 48, cor: '#c9943a' },
    { id: 6, nome: 'CONSULTA AGENDADA', categoria: 'Comercial', tickets: 23, cor: '#9b59b6' },
    { id: 7, nome: 'Emarcandimento', categoria: 'Atendimento', tickets: 14, cor: '#1abc9c' },
    { id: 8, nome: 'Comercial', categoria: 'Comercial', tickets: 30, cor: '#34495e' },
  ];
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Etiquetas</h1>
        <button style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova Etiqueta</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {etiquetas.map((e) => (
          <div key={e.id} style={{ background: '#132636', border: `2px solid ${e.cor}`, borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: e.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>▢</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2', marginBottom: '4px' }}>{e.nome}</div>
              <div style={{ fontSize: '10px', color: '#7a96aa', marginBottom: '6px' }}>{e.categoria}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: e.cor }}>{e.tickets} tickets</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ background: 'none', border: 'none', color: '#7a96aa', cursor: 'pointer', fontSize: '14px' }}>✎</button>
              <button style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
