'use client';
import { useState, useMemo } from 'react';
import { Edit, Trash2, Zap, Plus, Search, Copy, Check, TrendingUp, MessageSquare, Sparkles, X, AlertTriangle, Tag, Hand, Info, Stethoscope, DollarSign, Wrench, Flag } from 'lucide-react';
import { useRespostasRapidasStore } from '@/store/respostasRapidasStore';

type Categoria = 'Saudação' | 'Informação' | 'Procedimento' | 'Financeiro' | 'Técnico' | 'Fechamento';

const CATEGORIAS_CONFIG: Record<string, { color: string; gradient: string; bg: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  'Saudação': { color: '#3498db', gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', bg: 'rgba(52, 152, 219, 0.12)', Icon: Hand },
  'Informação': { color: '#c9943a', gradient: 'linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)', bg: 'rgba(201, 148, 58, 0.12)', Icon: Info },
  'Procedimento': { color: '#9b59b6', gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', bg: 'rgba(155, 89, 182, 0.12)', Icon: Stethoscope },
  'Financeiro': { color: '#2ecc71', gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', bg: 'rgba(46, 204, 113, 0.12)', Icon: DollarSign },
  'Técnico': { color: '#f39c12', gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', bg: 'rgba(243, 156, 18, 0.12)', Icon: Wrench },
  'Fechamento': { color: '#e74c3c', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', bg: 'rgba(231, 76, 60, 0.12)', Icon: Flag },
};

const CATEGORIAS_LISTA = Object.keys(CATEGORIAS_CONFIG);

export function Respostas() {
  const { respostas, addResposta, updateResposta, deleteResposta } = useRespostasRapidasStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [confirmandoDelecaoId, setConfirmandoDelecaoId] = useState<string | null>(null);
  const [criandonova, setCriandoNova] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [formEdicao, setFormEdicao] = useState({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' });
  const [formNova, setFormNova] = useState({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' });

  // Stats calculadas
  const stats = useMemo(() => {
    const total = respostas.length;
    const totalUsos = respostas.reduce((acc, r) => acc + (r.usos || 0), 0);
    const maisUsada = respostas.reduce((max, r) => ((r.usos || 0) > (max?.usos || 0) ? r : max), respostas[0]);
    const porCategoria: Record<string, number> = {};
    respostas.forEach((r) => { porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + 1; });
    return { total, totalUsos, maisUsada, porCategoria };
  }, [respostas]);

  const filtradas = respostas
    .filter((r) => filtroCategoria === 'Todas' || r.categoria === filtroCategoria)
    .filter((r) =>
      r.gatilho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCopiar = async (id: string, texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 1800);
    } catch {
      // fallback silent
    }
  };

  const getCategoriaConfig = (cat: string) => CATEGORIAS_CONFIG[cat] || CATEGORIAS_CONFIG['Informação'];

  return (
    <div style={{ padding: '24px', background: '#0d1f2d', minHeight: '100vh', color: '#e8edf2', fontFamily: "'Segoe UI', sans-serif", overflow: 'auto' }}>
      {/* HEADER PREMIUM */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(201, 148, 58, 0.35)' }}>
              <Zap size={20} color="#0d1f2d" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #e8edf2 0%, #c9943a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Respostas Rápidas
              </h1>
              <div style={{ fontSize: '12px', color: '#7a96aa', marginTop: '2px', fontWeight: 500 }}>
                Mensagens pré-formatadas para acelerar o atendimento
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setCriandoNova(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 20px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)',
            color: '#0d1f2d',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 6px 18px rgba(201, 148, 58, 0.35)',
            letterSpacing: '0.2px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(201, 148, 58, 0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(201, 148, 58, 0.35)'; }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Nova Resposta
        </button>
      </div>

      {/* STATS CARDS PREMIUM */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <StatsCard
          label="Total de Respostas"
          value={stats.total}
          Icon={MessageSquare}
          gradient="linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)"
          accent="#c9943a"
        />
        <StatsCard
          label="Total de Usos"
          value={stats.totalUsos}
          Icon={TrendingUp}
          gradient="linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
          accent="#3498db"
        />
        <StatsCard
          label="Mais Usada"
          value={stats.maisUsada ? `${stats.maisUsada.usos}×` : '—'}
          subtitle={stats.maisUsada?.titulo?.slice(0, 22) || '—'}
          Icon={Sparkles}
          gradient="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)"
          accent="#9b59b6"
        />
        <StatsCard
          label="Categorias"
          value={Object.keys(stats.porCategoria).length}
          Icon={Tag}
          gradient="linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)"
          accent="#2ecc71"
        />
      </div>

      {/* TOOLBAR: Busca + Filtros */}
      <div style={{ background: 'rgba(19, 38, 54, 0.6)', border: '1px solid rgba(90, 120, 140, 0.22)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a96aa' }} />
            <input
              type="text"
              placeholder="Buscar por gatilho, título ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '8px',
                border: '1px solid rgba(90, 120, 140, 0.3)',
                background: 'rgba(13, 31, 45, 0.6)',
                color: '#e8edf2',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#c9943a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.12)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <CategoryPill label="Todas" total={respostas.length} active={filtroCategoria === 'Todas'} onClick={() => setFiltroCategoria('Todas')} />
          {CATEGORIAS_LISTA.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              total={stats.porCategoria[cat] || 0}
              active={filtroCategoria === cat}
              onClick={() => setFiltroCategoria(cat)}
              color={getCategoriaConfig(cat).color}
              bg={getCategoriaConfig(cat).bg}
              Icon={getCategoriaConfig(cat).Icon}
            />
          ))}
        </div>
      </div>

      {/* GRID DE CARDS PREMIUM */}
      {filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(19, 38, 54, 0.4)', border: '1px dashed rgba(90, 120, 140, 0.3)', borderRadius: '14px' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8edf2', margin: '0 0 6px 0' }}>Nenhuma resposta encontrada</h3>
          <p style={{ fontSize: '12px', color: '#7a96aa', margin: 0 }}>Tente ajustar os filtros ou criar uma nova resposta</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '14px' }}>
          {filtradas.map((r) => {
            const cfg = getCategoriaConfig(r.categoria);
            const isCopiado = copiadoId === r.id;
            return (
              <div
                key={r.id}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(19, 38, 54, 0.85) 0%, rgba(15, 30, 45, 0.95) 100%)',
                  border: '1px solid rgba(90, 120, 140, 0.28)',
                  borderRadius: '14px',
                  padding: '0',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = `${cfg.color}60`;
                  e.currentTarget.style.boxShadow = `0 14px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px ${cfg.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.28)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Barra superior com gradiente da categoria */}
                <div style={{ height: '3px', background: cfg.gradient }} />

                <div style={{ padding: '16px' }}>
                  {/* Top row: Categoria badge + Usos */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '99px', background: cfg.bg, border: `1px solid ${cfg.color}40`, fontSize: '10.5px', fontWeight: 700, color: cfg.color, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                      <cfg.Icon size={11} color={cfg.color} />
                      {r.categoria}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#7a96aa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={11} />
                      {r.usos}× usado
                    </div>
                  </div>

                  {/* Título */}
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: '#e8edf2', letterSpacing: '-0.3px' }}>
                    {r.titulo}
                  </h3>

                  {/* Gatilho */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(201, 148, 58, 0.1)', border: '1px solid rgba(201, 148, 58, 0.25)', fontSize: '10.5px', fontWeight: 600, color: '#c9943a', fontFamily: 'monospace', marginBottom: '10px' }}>
                    <Zap size={10} />
                    {r.gatilho}
                  </div>

                  {/* Conteúdo */}
                  <p style={{ fontSize: '12.5px', color: '#c6d5e0', margin: '0 0 14px 0', lineHeight: 1.55, minHeight: '50px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {r.conteudo}
                  </p>

                  {/* Botões de ação */}
                  <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid rgba(90, 120, 140, 0.2)', paddingTop: '12px' }}>
                    <ActionButton
                      icon={isCopiado ? <Check size={13} /> : <Copy size={13} />}
                      label={isCopiado ? 'Copiado!' : 'Copiar'}
                      onClick={() => handleCopiar(r.id, r.conteudo)}
                      active={isCopiado}
                      color="#2ecc71"
                      primary
                    />
                    <ActionButton
                      icon={<Edit size={13} />}
                      onClick={() => {
                        setEditandoId(r.id);
                        setFormEdicao({ titulo: r.titulo, conteudo: r.conteudo, gatilho: r.gatilho, categoria: r.categoria });
                      }}
                      color="#3498db"
                    />
                    <ActionButton
                      icon={<Trash2 size={13} />}
                      onClick={() => setConfirmandoDelecaoId(r.id)}
                      color="#e74c3c"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {editandoId && (
        <PremiumModal title="Editar Resposta Rápida" onClose={() => setEditandoId(null)}>
          <FormularioResposta
            form={formEdicao}
            setForm={setFormEdicao}
            onCancel={() => setEditandoId(null)}
            onSubmit={() => {
              updateResposta(editandoId, formEdicao);
              setEditandoId(null);
            }}
            submitLabel="Salvar Alterações"
          />
        </PremiumModal>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmandoDelecaoId && (
        <PremiumModal title="Confirmar Exclusão" onClose={() => setConfirmandoDelecaoId(null)} width={420} variant="danger">
          <div style={{ textAlign: 'center', padding: '8px 4px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(231, 76, 60, 0.15)', border: '2px solid rgba(231, 76, 60, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <AlertTriangle size={30} color="#e74c3c" />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8edf2', margin: '0 0 6px 0' }}>
              Deseja excluir esta resposta?
            </h3>
            <p style={{ fontSize: '12.5px', color: '#7a96aa', margin: '0 0 22px 0', lineHeight: 1.5 }}>
              Essa ação não pode ser desfeita. A resposta será removida permanentemente.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmandoDelecaoId(null)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: '1px solid rgba(90, 120, 140, 0.35)',
                  background: 'transparent',
                  color: '#c6d5e0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(90, 120, 140, 0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteResposta(confirmandoDelecaoId);
                  setConfirmandoDelecaoId(null);
                }}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: '0 4px 14px rgba(231, 76, 60, 0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.55)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(231, 76, 60, 0.35)'; }}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </PremiumModal>
      )}

      {/* MODAL DE CRIAÇÃO */}
      {criandonova && (
        <PremiumModal title="Nova Resposta Rápida" onClose={() => { setCriandoNova(false); setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' }); }}>
          <FormularioResposta
            form={formNova}
            setForm={setFormNova}
            onCancel={() => { setCriandoNova(false); setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' }); }}
            onSubmit={() => {
              if (formNova.titulo && formNova.conteudo && formNova.gatilho) {
                addResposta({ ...formNova, criadoPor: 'Admin' });
                setCriandoNova(false);
                setFormNova({ titulo: '', conteudo: '', gatilho: '', categoria: 'Informação' });
              }
            }}
            submitLabel="Criar Resposta"
          />
        </PremiumModal>
      )}
    </div>
  );
}

// ============ Sub-componentes Premium ============

function StatsCard({ label, value, subtitle, Icon, gradient, accent }: { label: string; value: string | number; subtitle?: string; Icon: React.ComponentType<{ size?: number; color?: string }>; gradient: string; accent: string }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(19, 38, 54, 0.85) 0%, rgba(15, 30, 45, 0.95) 100%)',
        border: `1px solid ${accent}30`,
        borderRadius: '12px',
        padding: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 24px rgba(0,0,0,0.35), 0 0 0 1px ${accent}50`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: gradient, opacity: 0.08, borderBottomLeftRadius: '100%' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ fontSize: '10.5px', color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${accent}40` }}>
          <Icon size={16} color="#fff" />
        </div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: accent, letterSpacing: '-0.8px', lineHeight: 1.1 }}>{value}</div>
      {subtitle && (
        <div style={{ fontSize: '11px', color: '#c6d5e0', marginTop: '4px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>
      )}
    </div>
  );
}

function CategoryPill({ label, total, active, onClick, color, bg, Icon }: { label: string; total: number; active: boolean; onClick: () => void; color?: string; bg?: string; Icon?: React.ComponentType<{ size?: number; color?: string }> }) {
  const activeColor = color || '#c9943a';
  const activeBg = bg || 'rgba(201, 148, 58, 0.15)';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '99px',
        border: active ? `1px solid ${activeColor}80` : '1px solid rgba(90, 120, 140, 0.25)',
        background: active ? activeBg : 'rgba(13, 31, 45, 0.5)',
        color: active ? activeColor : '#7a96aa',
        fontSize: '11.5px',
        fontWeight: active ? 700 : 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.2px',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.45)'; e.currentTarget.style.color = '#c6d5e0'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.25)'; e.currentTarget.style.color = '#7a96aa'; } }}
    >
      {Icon && <Icon size={12} color={active ? activeColor : '#7a96aa'} />}
      {label}
      <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: active ? `${activeColor}25` : 'rgba(90, 120, 140, 0.2)', fontWeight: 700 }}>{total}</span>
    </button>
  );
}

function ActionButton({ icon, label, onClick, color, primary, active }: { icon: React.ReactNode; label?: string; onClick: () => void; color: string; primary?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        padding: label ? '7px 12px' : '7px 9px',
        borderRadius: '7px',
        border: `1px solid ${active ? color : 'rgba(90, 120, 140, 0.28)'}`,
        background: active ? `${color}18` : 'rgba(13, 31, 45, 0.6)',
        color: active ? color : '#a8b8c4',
        fontSize: '11.5px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        flex: primary ? 1 : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = color;
        e.currentTarget.style.background = `${color}15`;
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.28)';
          e.currentTarget.style.color = '#a8b8c4';
          e.currentTarget.style.background = 'rgba(13, 31, 45, 0.6)';
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function PremiumModal({ title, onClose, children, width = 520, variant = 'gold' }: { title: string; onClose: () => void; children: React.ReactNode; width?: number; variant?: 'gold' | 'danger' }) {
  const gradient = variant === 'danger'
    ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    : 'linear-gradient(135deg, #c9943a 0%, #e8b86d 100%)';

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)', zIndex: 999, animation: 'fadeIn 0.2s ease-out' }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#0f2434',
          borderRadius: '16px',
          maxWidth: `${width}px`,
          width: '92%',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid rgba(90, 120, 140, 0.25)',
          zIndex: 1000,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04)',
          animation: 'modalIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top gradient line */}
        <div style={{ height: '3px', background: gradient }} />

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(90, 120, 140, 0.18)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#e8edf2', letterSpacing: '-0.3px' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(90, 120, 140, 0.12)',
              border: '1px solid rgba(90, 120, 140, 0.25)',
              color: '#a8b8c4',
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(231, 76, 60, 0.15)'; e.currentTarget.style.borderColor = '#e74c3c'; e.currentTarget.style.color = '#e74c3c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(90, 120, 140, 0.12)'; e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.25)'; e.currentTarget.style.color = '#a8b8c4'; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px 22px', maxHeight: 'calc(90vh - 60px)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { transform: translate(-50%, -48%) scale(0.96); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}</style>
    </>
  );
}

function FormularioResposta({ form, setForm, onCancel, onSubmit, submitLabel }: { form: { titulo: string; conteudo: string; gatilho: string; categoria: string }; setForm: (f: { titulo: string; conteudo: string; gatilho: string; categoria: string }) => void; onCancel: () => void; onSubmit: () => void; submitLabel: string }) {
  const cfg = CATEGORIAS_CONFIG[form.categoria] || CATEGORIAS_CONFIG['Informação'];
  const valid = form.titulo.trim() && form.conteudo.trim() && form.gatilho.trim();

  return (
    <>
      {/* Grid 2 cols: Gatilho + Categoria */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <FormField label="Gatilho (palavra-chave)" hint="Ex: olá, agendar, preço">
          <div style={{ position: 'relative' }}>
            <Zap size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#c9943a' }} />
            <PremiumInput
              type="text"
              value={form.gatilho}
              onChange={(e) => setForm({ ...form, gatilho: e.target.value })}
              placeholder="ola"
              style={{ paddingLeft: '32px', fontFamily: 'monospace' }}
            />
          </div>
        </FormField>

        <FormField label="Categoria">
          <div style={{ position: 'relative' }}>
            <cfg.Icon size={13} color={cfg.color} />
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px 10px 32px',
                borderRadius: '8px',
                border: '1px solid rgba(90, 120, 140, 0.3)',
                background: 'rgba(13, 31, 45, 0.6)',
                color: '#e8edf2',
                fontSize: '13px',
                fontWeight: 600,
                boxSizing: 'border-box',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {CATEGORIAS_LISTA.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <cfg.Icon size={13} color={cfg.color} />
            </div>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#7a96aa', fontSize: '10px' }}>▼</div>
          </div>
        </FormField>
      </div>

      <FormField label="Título">
        <PremiumInput
          type="text"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Ex: Boas-vindas"
        />
      </FormField>

      <FormField label="Conteúdo da Resposta" hint={`${form.conteudo.length} caracteres`}>
        <textarea
          value={form.conteudo}
          onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
          placeholder="Digite a mensagem que será enviada..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(90, 120, 140, 0.3)',
            background: 'rgba(13, 31, 45, 0.6)',
            color: '#e8edf2',
            fontSize: '13px',
            minHeight: '110px',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'all 0.2s',
            lineHeight: 1.5,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.color}20`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </FormField>

      {/* Botões */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(90, 120, 140, 0.18)' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid rgba(90, 120, 140, 0.35)',
            background: 'transparent',
            color: '#c6d5e0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(90, 120, 140, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={!valid}
          style={{
            padding: '10px 22px',
            borderRadius: '8px',
            border: 'none',
            background: valid ? cfg.gradient : 'rgba(90, 120, 140, 0.2)',
            color: valid ? '#0d1f2d' : '#7a96aa',
            cursor: valid ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: valid ? `0 6px 18px ${cfg.color}40` : 'none',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => { if (valid) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}60`; } }}
          onMouseLeave={(e) => { if (valid) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 18px ${cfg.color}40`; } }}
        >
          <Check size={14} strokeWidth={3} />
          {submitLabel}
        </button>
      </div>
    </>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
        {hint && <span style={{ fontSize: '10.5px', color: '#7a96aa', fontWeight: 500 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function PremiumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(90, 120, 140, 0.3)',
        background: 'rgba(13, 31, 45, 0.6)',
        color: '#e8edf2',
        fontSize: '13px',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'all 0.2s',
        ...props.style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#c9943a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.15)'; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)'; e.currentTarget.style.boxShadow = 'none'; props.onBlur?.(e); }}
    />
  );
}
