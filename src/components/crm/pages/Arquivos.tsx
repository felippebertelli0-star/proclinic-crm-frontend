'use client';

import { useMemo, useState } from 'react';
import {
  FileText,
  FolderOpen,
  Image as ImageIcon,
  File,
  Upload,
  Download,
  Trash2,
  Search,
  Eye,
  HardDrive,
  Calendar,
  X,
} from 'lucide-react';

type Tipo = 'PDF' | 'Imagem' | 'Documento' | 'Planilha' | 'Outro';

interface Arquivo {
  id: number;
  nome: string;
  tipo: Tipo;
  tamanho: string;
  data: string;
  autor?: string;
}

const TIPO_CONFIG: Record<Tipo, { color: string; bg: string; gradient: string; Icon: typeof File }> = {
  PDF: {
    color: '#e74c3c',
    bg: 'rgba(231, 76, 60, 0.14)',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    Icon: FileText,
  },
  Imagem: {
    color: '#3498db',
    bg: 'rgba(52, 152, 219, 0.14)',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    Icon: ImageIcon,
  },
  Documento: {
    color: '#2ecc71',
    bg: 'rgba(46, 204, 113, 0.14)',
    gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    Icon: FileText,
  },
  Planilha: {
    color: '#f39c12',
    bg: 'rgba(243, 156, 18, 0.14)',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d68910 100%)',
    Icon: FileText,
  },
  Outro: {
    color: '#7a96aa',
    bg: 'rgba(122, 150, 170, 0.14)',
    gradient: 'linear-gradient(135deg, #7a96aa 0%, #566b7a 100%)',
    Icon: File,
  },
};

const INITIAL: Arquivo[] = [
  { id: 1, nome: 'Laudo_Fernanda.pdf', tipo: 'PDF', tamanho: '2.4 MB', data: '2026-04-15', autor: 'Dra. Andressa' },
  { id: 2, nome: 'Exame_Paciente.jpg', tipo: 'Imagem', tamanho: '1.8 MB', data: '2026-04-14', autor: 'Recepção' },
  { id: 3, nome: 'Contrato_Plano.docx', tipo: 'Documento', tamanho: '0.8 MB', data: '2026-04-13', autor: 'Financeiro' },
  { id: 4, nome: 'Receita_Dentista.pdf', tipo: 'PDF', tamanho: '1.2 MB', data: '2026-04-12', autor: 'Dra. Andressa' },
  { id: 5, nome: 'Foto_Antes_01.jpg', tipo: 'Imagem', tamanho: '3.1 MB', data: '2026-04-11', autor: 'Dra. Andressa' },
  { id: 6, nome: 'Foto_Depois_01.jpg', tipo: 'Imagem', tamanho: '2.9 MB', data: '2026-04-10', autor: 'Dra. Andressa' },
  { id: 7, nome: 'Planilha_Financeiro.xlsx', tipo: 'Planilha', tamanho: '0.5 MB', data: '2026-04-09', autor: 'Financeiro' },
  { id: 8, nome: 'Protocolo_Clinico.pdf', tipo: 'PDF', tamanho: '4.2 MB', data: '2026-04-08', autor: 'Dra. Andressa' },
];

export function Arquivos() {
  const [arquivos, setArquivos] = useState<Arquivo[]>(INITIAL);
  const [query, setQuery] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<Tipo | 'Todos'>('Todos');
  const [preview, setPreview] = useState<Arquivo | null>(null);

  const stats = useMemo(() => {
    const total = arquivos.length;
    const imagens = arquivos.filter((a) => a.tipo === 'Imagem').length;
    const documentos = arquivos.filter((a) => a.tipo === 'Documento' || a.tipo === 'PDF').length;
    const tamanhoTotal = arquivos.reduce((acc, a) => {
      const mb = parseFloat(a.tamanho.replace(' MB', '').replace(',', '.'));
      return acc + (isNaN(mb) ? 0 : mb);
    }, 0);
    return {
      total,
      imagens,
      documentos,
      tamanho: `${tamanhoTotal.toFixed(1)} MB`,
    };
  }, [arquivos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return arquivos.filter((a) => {
      const matchTipo = filtroTipo === 'Todos' ? true : a.tipo === filtroTipo;
      const matchQuery = !q || a.nome.toLowerCase().includes(q) || (a.autor || '').toLowerCase().includes(q);
      return matchTipo && matchQuery;
    });
  }, [arquivos, query, filtroTipo]);

  const handleUpload = () => {
    const nextId = Math.max(0, ...arquivos.map((a) => a.id)) + 1;
    const novo: Arquivo = {
      id: nextId,
      nome: `Arquivo_${nextId}.pdf`,
      tipo: 'PDF',
      tamanho: `${(Math.random() * 3 + 0.3).toFixed(1)} MB`,
      data: new Date().toISOString().split('T')[0],
      autor: 'Você',
    };
    setArquivos((prev) => [novo, ...prev]);
  };

  const handleDelete = (id: number) => {
    setArquivos((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      style={{
        padding: '28px',
        background: 'linear-gradient(180deg, #0d1f2d 0%, #0a1826 100%)',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes arCardIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes arModalIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ar-card { animation: arCardIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .ar-card:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0,0,0,0.4); border-color: rgba(201, 148, 58, 0.45) !important; }
        .ar-input:focus { border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201, 148, 58, 0.18) !important; }
        .ar-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(201, 148, 58, 0.35); }
        .ar-pill:hover { transform: translateY(-1px); }
        .ar-action:hover { transform: translateY(-1px); }
      `}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 24px rgba(201, 148, 58, 0.35)',
            }}
          >
            <FolderOpen size={22} color="#0d1f2d" strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Arquivos</h1>
            <p style={{ fontSize: '13px', color: '#7a96aa', margin: '2px 0 0 0' }}>Gerencie documentos, laudos e imagens da clínica</p>
          </div>
        </div>
        <button
          className="ar-btn-primary"
          onClick={handleUpload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
            color: '#0d1f2d',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(201, 148, 58, 0.28)',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <Upload size={16} strokeWidth={2.6} /> Fazer Upload
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <StatsCard label="Total de Arquivos" value={stats.total} color="#c9943a" Icon={File} />
        <StatsCard label="Imagens" value={stats.imagens} color="#3498db" Icon={ImageIcon} />
        <StatsCard label="Documentos" value={stats.documentos} color="#2ecc71" Icon={FileText} />
        <StatsCard label="Espaço Usado" value={stats.tamanho} color="#f39c12" Icon={HardDrive} />
      </div>

      {/* TOOLBAR */}
      <div
        style={{
          background: 'rgba(19, 38, 54, 0.75)',
          border: '1px solid #1e3d54',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <Search size={16} color="#7a96aa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="ar-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou autor..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              background: '#0d1f2d',
              border: '1px solid #1e3d54',
              borderRadius: '10px',
              color: '#e8edf2',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <FilterPill label="Todos" count={arquivos.length} active={filtroTipo === 'Todos'} onClick={() => setFiltroTipo('Todos')} />
          {(['PDF', 'Imagem', 'Documento', 'Planilha'] as Tipo[]).map((t) => (
            <FilterPill
              key={t}
              label={t}
              count={arquivos.filter((a) => a.tipo === t).length}
              color={TIPO_CONFIG[t].color}
              Icon={TIPO_CONFIG[t].Icon}
              active={filtroTipo === t}
              onClick={() => setFiltroTipo(t)}
            />
          ))}
        </div>
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(19, 38, 54, 0.4)', borderRadius: '14px', border: '1px dashed #1e3d54' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#e8edf2', margin: '0 0 6px 0' }}>Nenhum arquivo encontrado</h3>
          <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0 }}>Faça upload de um novo arquivo ou ajuste os filtros.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map((a, i) => {
            const cfg = TIPO_CONFIG[a.tipo];
            const Icon = cfg.Icon;

            return (
              <div
                key={a.id}
                className="ar-card"
                style={{
                  position: 'relative',
                  background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
                  border: '1px solid #1e3d54',
                  borderRadius: '16px',
                  padding: '18px',
                  overflow: 'hidden',
                  animationDelay: `${i * 0.03}s`,
                  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: cfg.gradient,
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: cfg.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 20px ${cfg.color}40`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="#fff" strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      title={a.nome}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#e8edf2',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '3px',
                      }}
                    >
                      {a.nome}
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: cfg.bg,
                        color: cfg.color,
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                      }}
                    >
                      {a.tipo}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <MetaChip Icon={HardDrive} label="Tamanho" value={a.tamanho} color="#c9943a" />
                  <MetaChip
                    Icon={Calendar}
                    label="Data"
                    value={new Date(a.data).toLocaleDateString('pt-BR')}
                    color="#3498db"
                  />
                </div>

                {a.autor && (
                  <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Enviado por <strong style={{ color: '#e8edf2', fontWeight: 600 }}>{a.autor}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="ar-action"
                    onClick={() => setPreview(a)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: '1px solid rgba(52, 152, 219, 0.35)',
                      background: 'rgba(52, 152, 219, 0.08)',
                      color: '#3498db',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Eye size={13} /> Ver
                  </button>
                  <button
                    className="ar-action"
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 148, 58, 0.35)',
                      background: 'rgba(201, 148, 58, 0.08)',
                      color: '#c9943a',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Download size={13} /> Baixar
                  </button>
                  <button
                    className="ar-action"
                    onClick={() => handleDelete(a.id)}
                    title="Excluir"
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(231, 76, 60, 0.35)',
                      background: 'rgba(231, 76, 60, 0.08)',
                      color: '#e74c3c',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && <PreviewModal arquivo={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

// ========= Subcomponentes =========

function StatsCard({
  label,
  value,
  color,
  Icon,
}: {
  label: string;
  value: number | string;
  color: string;
  Icon: typeof File;
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        padding: '18px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '110px',
          height: '110px',
          background: `radial-gradient(circle at top right, ${color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color, lineHeight: 1 }}>
            {value}
          </div>
        </div>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `${color}1f`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={color} strokeWidth={2.3} />
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  count,
  color = '#c9943a',
  Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  color?: string;
  Icon?: typeof File;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="ar-pill"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '8px 14px',
        borderRadius: '999px',
        border: `1px solid ${active ? color : '#1e3d54'}`,
        background: active ? `${color}1f` : 'rgba(13, 31, 45, 0.4)',
        color: active ? color : '#7a96aa',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {Icon && <Icon size={12} strokeWidth={2.4} />}
      {label}
      <span
        style={{
          minWidth: '18px',
          padding: '1px 6px',
          borderRadius: '10px',
          background: active ? `${color}33` : 'rgba(122, 150, 170, 0.15)',
          color: active ? color : '#7a96aa',
          fontSize: '10px',
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        {count}
      </span>
    </button>
  );
}

function MetaChip({
  Icon,
  label,
  value,
  color,
}: {
  Icon: typeof File;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: '8px 10px',
        borderRadius: '8px',
        background: 'rgba(13, 31, 45, 0.5)',
        border: '1px solid #1e3d54',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600, marginBottom: '3px' }}>
        <Icon size={10} color={color} /> {label}
      </div>
      <div style={{ fontSize: '12px', color: '#e8edf2', fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function PreviewModal({ arquivo, onClose }: { arquivo: Arquivo; onClose: () => void }) {
  const cfg = TIPO_CONFIG[arquivo.tipo];
  const Icon = cfg.Icon;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 17, 26, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
          border: '1px solid #1e3d54',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
          animation: 'arModalIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div style={{ height: '3px', background: cfg.gradient }} />
        <div style={{ padding: '20px', borderBottom: '1px solid #1e3d54', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Pré-visualização</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#7a96aa',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 18px auto',
              borderRadius: '18px',
              background: cfg.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 16px 40px ${cfg.color}55`,
            }}
          >
            <Icon size={40} color="#fff" strokeWidth={2} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8edf2', margin: '0 0 4px 0', wordBreak: 'break-all' }}>
            {arquivo.nome}
          </h3>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: '14px',
              background: cfg.bg,
              color: cfg.color,
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginTop: '8px',
            }}
          >
            {arquivo.tipo}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '24px', textAlign: 'left' }}>
            <MetaChip Icon={HardDrive} label="Tamanho" value={arquivo.tamanho} color="#c9943a" />
            <MetaChip
              Icon={Calendar}
              label="Data"
              value={new Date(arquivo.data).toLocaleDateString('pt-BR')}
              color="#3498db"
            />
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e3d54', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: 'transparent',
              color: '#b0c4d4',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Fechar
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
              color: '#0d1f2d',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Download size={14} /> Baixar
          </button>
        </div>
      </div>
    </div>
  );
}
