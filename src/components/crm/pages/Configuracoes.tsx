'use client';
import { useState } from 'react';
export function Configuracoes() {
  const [saveMsg, setSaveMsg] = useState('');
  const handleSave = () => {
    setSaveMsg('✅ Configurações salvas com sucesso!');
    setTimeout(() => setSaveMsg(''), 3000);
  };
  return (
    <div style={{ padding: '32px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '28px' }}>Configurações</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* CLÍNICA */}
        <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e8edf2' }}>🏥 Clínica</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Nome</label>
              <input type="text" defaultValue="Dra. Andressa Barbarotti" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', fontSize: '12px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '6px' }}>CNPJ</label>
              <input type="text" defaultValue="12.345.678/0001-99" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', fontSize: '12px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Telefone</label>
              <input type="text" defaultValue="(11) 98765-4321" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', fontSize: '12px' }} />
            </div>
          </div>
        </div>

        {/* NOTIFICAÇÕES */}
        <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e8edf2' }}>🔔 Notificações</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Novos leads', checked: true },
              { label: 'Mensagens não lidas', checked: true },
              { label: 'Relatórios diários', checked: true },
              { label: 'SLA crítico', checked: false },
            ].map((n, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                <input type="checkbox" defaultChecked={n.checked} style={{ cursor: 'pointer' }} />
                <span>{n.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* HORÁRIO DE ATENDIMENTO */}
        <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e8edf2' }}>⏰ Horário de Atendimento</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#7a96aa' }}>
            <div>Segunda a Sexta: 08:00 - 18:00</div>
            <div>Sábado: 08:00 - 13:00</div>
            <div>Domingo: Fechado</div>
            <div>Feriados: Fechado</div>
          </div>
        </div>

        {/* IA & AUTOMAÇÃO */}
        <div style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e8edf2' }}>🤖 IA & Automação</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'IA Ativa', value: 'Sim' },
              { label: 'Resposta automática', value: '24h' },
              { label: 'Idioma padrão', value: 'Português BR' },
              { label: 'Modelo IA', value: 'GPT-4o + Claude' },
            ].map((i, idx) => (
              <div key={idx} style={{ fontSize: '12px', color: '#7a96aa' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{i.label}</div>
                <div style={{ color: '#e8edf2' }}>{i.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#2ecc71', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>✓ Salvar Alterações</button>
        <button style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
      </div>

      {saveMsg && (
        <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', fontSize: '13px', fontWeight: 600 }}>
          {saveMsg}
        </div>
      )}
    </div>
  );
}
