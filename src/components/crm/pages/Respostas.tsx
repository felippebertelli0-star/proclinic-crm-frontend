'use client';
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useRespostasRapidasStore, RespostaRapida } from '@/store/respostasRapidasStore';

export function Respostas() {
  const { respostas, addResposta, updateResposta, deleteResposta } = useRespostasRapidasStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmandoDelecaoId, setConfirmandoDelecaoId] = useState<string | null>(null);
  const [criandonova, setCriandoNova] = useState(false);
  const [formEdicao, setFormEdicao] = useState({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' });
  const [formNova, setFormNova] = useState({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' });

  const filtradas = respostas.filter(r =>
    r.gatilho.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Respostas Rápidas</h1>
        <button onClick={() => setCriandoNova(true)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#c9943a', color: '#0d1f2d', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>+ Nova</button>
      </div>
      <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #1e3d54', background: '#132636', color: '#e8edf2', marginBottom: '20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtradas.map((r) => (
          <div key={r.id} style={{ background: '#132636', border: '1px solid #1e3d54', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(201, 148, 58, 0.2)', color: '#c9943a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{r.gatilho}</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button title="Editar" style={{ background: 'rgba(13, 31, 45, 0.6)', border: '1.5px solid #4a5f72', borderRadius: '6px', color: '#8b9aaa', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease-out' }} onClick={() => { setEditandoId(r.id); setFormEdicao({ titulo: r.titulo, conteudo: r.conteudo, gatilho: r.gatilho, categoria: r.categoria }); }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c9943a'; e.currentTarget.style.color = '#c9943a'; e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#4a5f72'; e.currentTarget.style.color = '#8b9aaa'; e.currentTarget.style.background = 'rgba(13, 31, 45, 0.6)'; }}><Edit size={12} /></button>
                <button title="Excluir" style={{ background: 'rgba(13, 31, 45, 0.6)', border: '1.5px solid #4a5f72', borderRadius: '6px', color: '#8b9aaa', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease-out' }} onClick={() => setConfirmandoDelecaoId(r.id)} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c9943a'; e.currentTarget.style.color = '#c9943a'; e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#4a5f72'; e.currentTarget.style.color = '#8b9aaa'; e.currentTarget.style.background = 'rgba(13, 31, 45, 0.6)'; }}><Trash2 size={12} /></button>
                <span style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '4px' }}>{r.usos}× usado</span>
              </div>
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0', color: '#e8edf2' }}>{r.titulo}</h3>
            <p style={{ fontSize: '12px', color: '#7a96aa', margin: 0, minHeight: '40px' }}>{r.conteudo}</p>
          </div>
        ))}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editandoId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#132636', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%', border: '1px solid #1e3d54' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#e8edf2' }}>Editar Resposta Rápida</h2>
              <button onClick={() => setEditandoId(null)} style={{ background: 'none', border: 'none', color: '#7a96aa', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>GATILHO (Palavra-chave)</label>
              <input type="text" value={formEdicao.gatilho} onChange={(e) => setFormEdicao({...formEdicao, gatilho: e.target.value})} placeholder="Ex: olá, agendar, preço..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>TÍTULO</label>
              <input type="text" value={formEdicao.titulo} onChange={(e) => setFormEdicao({...formEdicao, titulo: e.target.value})} placeholder="Nome descritivo..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>CATEGORIA</label>
              <select value={formEdicao.categoria} onChange={(e) => setFormEdicao({...formEdicao, categoria: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }}>
                <option>Saudação</option>
                <option>Informação</option>
                <option>Procedimento</option>
                <option>Financeiro</option>
                <option>Técnico</option>
                <option>Fechamento</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>CONTEÚDO</label>
              <textarea value={formEdicao.conteudo} onChange={(e) => setFormEdicao({...formEdicao, conteudo: e.target.value})} placeholder="Digite a resposta..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', minHeight: '100px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditandoId(null)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={() => { updateResposta(editandoId, { titulo: formEdicao.titulo, conteudo: formEdicao.conteudo, gatilho: formEdicao.gatilho, categoria: formEdicao.categoria }); setEditandoId(null); }} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#c9943a', color: '#0d1f2d', cursor: 'pointer', fontWeight: 600 }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmandoDelecaoId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#132636', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '90%', border: '1px solid #1e3d54', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#e8edf2' }}>Confirmar Exclusão</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#7a96aa' }}>Tem certeza que deseja excluir esta resposta rápida? Esta ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setConfirmandoDelecaoId(null)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={() => { deleteResposta(confirmandoDelecaoId); setConfirmandoDelecaoId(null); }} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#e74c3c', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE NOVA RESPOSTA */}
      {criandonova && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#132636', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%', border: '1px solid #1e3d54' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#e8edf2' }}>Nova Resposta Rápida</h2>
              <button onClick={() => { setCriandoNova(false); setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' }); }} style={{ background: 'none', border: 'none', color: '#7a96aa', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>GATILHO (Palavra-chave)</label>
              <input type="text" value={formNova.gatilho} onChange={(e) => setFormNova({...formNova, gatilho: e.target.value})} placeholder="Ex: olá, agendar, preço..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>TÍTULO</label>
              <input type="text" value={formNova.titulo} onChange={(e) => setFormNova({...formNova, titulo: e.target.value})} placeholder="Nome descritivo..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>CATEGORIA</label>
              <select value={formNova.categoria} onChange={(e) => setFormNova({...formNova, categoria: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', boxSizing: 'border-box' }}>
                <option>Saudação</option>
                <option>Informação</option>
                <option>Procedimento</option>
                <option>Financeiro</option>
                <option>Técnico</option>
                <option>Fechamento</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a96aa', marginBottom: '6px' }}>CONTEÚDO</label>
              <textarea value={formNova.conteudo} onChange={(e) => setFormNova({...formNova, conteudo: e.target.value})} placeholder="Digite a resposta..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #1e3d54', background: '#0d1f2d', color: '#e8edf2', minHeight: '100px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setCriandoNova(false); setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' }); }} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #1e3d54', background: 'transparent', color: '#7a96aa', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={() => { if (formNova.titulo && formNova.conteudo && formNova.gatilho) { addResposta({ titulo: formNova.titulo, conteudo: formNova.conteudo, gatilho: formNova.gatilho, categoria: formNova.categoria, criadoPor: 'Admin' }); setCriandoNova(false); setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' }); } }} style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', background: '#c9943a', color: '#0d1f2d', cursor: 'pointer', fontWeight: 600 }}>Criar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
