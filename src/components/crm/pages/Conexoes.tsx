'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Activity,
  Zap,
  TrendingUp,
  MessageSquare,
  Shield,
  Settings,
  RefreshCw,
  Trash2,
  Bell,
  BellOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from 'lucide-react';
import { useConexoesStore, type PlatformType, type Conexao } from '@/store/conexoesStore';
import { PlatformLogo } from './Conexao/PlatformLogos';
import { ToastProvider, useToast } from './Conexao/ToastSystem';
import ConexaoWhatsAppModal from './Conexao/ConexaoWhatsAppModal';
import ConexaoInstagramModal from './Conexao/ConexaoInstagramModal';
import ConexaoTelegramModal from './Conexao/ConexaoTelegramModal';
import ConexaoEmailModal from './Conexao/ConexaoEmailModal';
import ConexaoFacebookModal from './Conexao/ConexaoFacebookModal';

type ModalType = PlatformType | null;

interface PlataformaInfo {
  id: PlatformType;
  nome: string;
  cor: string;
  gradient: string;
  descricao: string;
}

const PLATAFORMAS: PlataformaInfo[] = [
  {
    id: 'whatsapp',
    nome: 'WhatsApp',
    cor: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    descricao: 'Mensagens instantâneas',
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    cor: '#E4405F',
    gradient: 'linear-gradient(135deg, #FDCB5C 0%, #EF4B75 50%, #8E3ABF 100%)',
    descricao: 'Direct & Stories',
  },
  {
    id: 'telegram',
    nome: 'Telegram',
    cor: '#2AABEE',
    gradient: 'linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)',
    descricao: 'Bot & canais',
  },
  {
    id: 'email',
    nome: 'Gmail',
    cor: '#EA4335',
    gradient: 'linear-gradient(135deg, #4285F4 0%, #EA4335 100%)',
    descricao: 'Email corporativo',
  },
  {
    id: 'facebook_messenger',
    nome: 'Messenger',
    cor: '#0084FF',
    gradient: 'linear-gradient(135deg, #0099FF 0%, #A033FF 60%, #FF5280 100%)',
    descricao: 'Facebook Messenger',
  },
];

function ConexoesContent() {
  const conexoes = useConexoesStore((state) => state.conexoes);
  const hydrate = useConexoesStore((state) => state.hydrate);
  const desconectar = useConexoesStore((state) => state.desconectar);
  const sincronizar = useConexoesStore((state) => state.sincronizar);
  const toggleNotificacoes = useConexoesStore((state) => state.toggleNotificacoes);
  const toggleAutoReply = useConexoesStore((state) => state.toggleAutoReply);
  const getTotalMensagens = useConexoesStore((state) => state.getTotalMensagens);
  const getConexoesAtivas = useConexoesStore((state) => state.getConexoesAtivas);
  const getUptimeMedio = useConexoesStore((state) => state.getUptimeMedio);

  const toast = useToast();

  const [modalAberto, setModalAberto] = useState<ModalType>(null);
  const [contatoParaExcluir, setContatoParaExcluir] = useState<Conexao | null>(null);
  const [detalhesConexao, setDetalhesConexao] = useState<Conexao | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'all' | 'connected' | 'disconnected'>('all');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const stats = useMemo(() => {
    const totalMsg = getTotalMensagens();
    return {
      ativas: getConexoesAtivas(),
      totalPlataformas: PLATAFORMAS.length,
      mensagensTotal: totalMsg.enviadas + totalMsg.recebidas,
      enviadas: totalMsg.enviadas,
      recebidas: totalMsg.recebidas,
      uptime: getUptimeMedio(),
    };
  }, [conexoes, getTotalMensagens, getConexoesAtivas, getUptimeMedio]);

  const getConexaoAtiva = (platform: PlatformType): Conexao | undefined => {
    return conexoes.find((c) => c.platform === platform && (c.status === 'connected' || c.status === 'syncing'));
  };

  const plataformasFiltradas = useMemo(() => {
    return PLATAFORMAS.filter((p) => {
      const conexao = getConexaoAtiva(p.id);
      const matchBusca =
        busca === '' ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        conexao?.accountInfo?.username?.toLowerCase().includes(busca.toLowerCase()) ||
        conexao?.accountInfo?.email?.toLowerCase().includes(busca.toLowerCase());
      const matchFiltro =
        filtro === 'all' ||
        (filtro === 'connected' && conexao) ||
        (filtro === 'disconnected' && !conexao);
      return matchBusca && matchFiltro;
    });
  }, [busca, filtro, conexoes]);

  const handleDesconectar = (conexao: Conexao) => {
    desconectar(conexao.id);
    toast.success('Desconectado', `${getPlataformaInfo(conexao.platform)?.nome} foi desconectado com sucesso`);
    setContatoParaExcluir(null);
  };

  const handleSincronizar = async (conexao: Conexao) => {
    toast.info('Sincronizando...', `Atualizando ${getPlataformaInfo(conexao.platform)?.nome}`);
    await sincronizar(conexao.id);
    toast.success('Sincronizado', 'Dados atualizados com sucesso');
  };

  const getPlataformaInfo = (id: string): PlataformaInfo | undefined => {
    return PLATAFORMAS.find((p) => p.id === id);
  };

  return (
    <div
      style={{
        padding: '24px 28px',
        background: 'radial-gradient(ellipse at top, #132d47 0%, #0d1f2d 50%, #0a1825 100%)',
        minHeight: '100vh',
        color: '#e8edf2',
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'auto',
      }}
    >
      {/* HEADER PREMIUM */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c9943a 0%, #8b6620 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(201, 148, 58, 0.35)',
            }}
          >
            <Zap size={20} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              margin: 0,
              background: 'linear-gradient(135deg, #e8edf2 0%, #c9943a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}
          >
            Central de Conexões
          </h1>
          <div
            style={{
              padding: '3px 10px',
              borderRadius: '99px',
              background: 'rgba(201, 148, 58, 0.15)',
              border: '1px solid rgba(201, 148, 58, 0.35)',
              fontSize: '10px',
              fontWeight: 700,
              color: '#c9943a',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={10} /> PREMIUM
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#7a96aa', margin: 0, marginLeft: '48px' }}>
          Gerencie todas as integrações da sua clínica em um só lugar
        </p>
      </div>

      {/* STATS CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <StatsCard
          icon={Activity}
          label="Conexões Ativas"
          value={`${stats.ativas}/${stats.totalPlataformas}`}
          subvalue={`${Math.round((stats.ativas / stats.totalPlataformas) * 100)}% integrado`}
          color="#2ecc71"
          trend={stats.ativas > 0 ? 'up' : 'neutral'}
        />
        <StatsCard
          icon={MessageSquare}
          label="Mensagens Trocadas"
          value={stats.mensagensTotal.toLocaleString('pt-BR')}
          subvalue={`${stats.enviadas} enviadas • ${stats.recebidas} recebidas`}
          color="#3498db"
          trend="up"
        />
        <StatsCard
          icon={TrendingUp}
          label="Uptime Médio"
          value={`${stats.uptime}%`}
          subvalue="Últimas 24h"
          color="#c9943a"
          trend="up"
        />
        <StatsCard
          icon={Shield}
          label="Status da Rede"
          value={stats.ativas > 0 ? 'Operacional' : 'Aguardando'}
          subvalue="Todos os endpoints ativos"
          color="#9b59b6"
          trend="neutral"
        />
      </div>

      {/* TOOLBAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: '240px',
            position: 'relative',
            maxWidth: '420px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7a96aa',
            }}
          />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar plataforma ou conta..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '10px',
              border: '1px solid rgba(90, 120, 140, 0.3)',
              background: 'rgba(15, 30, 45, 0.6)',
              color: '#e8edf2',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#c9943a';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 148, 58, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'connected', 'disconnected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: `1px solid ${filtro === f ? '#c9943a' : 'rgba(90, 120, 140, 0.3)'}`,
                background: filtro === f ? 'rgba(201, 148, 58, 0.12)' : 'rgba(15, 30, 45, 0.6)',
                color: filtro === f ? '#c9943a' : '#7a96aa',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f === 'all' ? 'Todas' : f === 'connected' ? 'Conectadas' : 'Desconectadas'}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE PLATAFORMAS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}
      >
        {plataformasFiltradas.map((plataforma) => {
          const conexao = getConexaoAtiva(plataforma.id);
          return (
            <PlatformCard
              key={plataforma.id}
              plataforma={plataforma}
              conexao={conexao}
              onConectar={() => setModalAberto(plataforma.id)}
              onDesconectar={() => conexao && setContatoParaExcluir(conexao)}
              onSincronizar={() => conexao && handleSincronizar(conexao)}
              onDetalhes={() => conexao && setDetalhesConexao(conexao)}
              onToggleNotif={() => conexao && toggleNotificacoes(conexao.id)}
            />
          );
        })}
        {plataformasFiltradas.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#7a96aa',
              background: 'rgba(15, 30, 45, 0.4)',
              borderRadius: '12px',
              border: '1px dashed rgba(90, 120, 140, 0.3)',
            }}
          >
            <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontSize: '14px', fontWeight: 600 }}>Nenhum resultado encontrado</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Tente ajustar sua busca ou filtros</div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE DESCONEXÃO */}
      {contatoParaExcluir && (
        <ConfirmDisconnectModal
          conexao={contatoParaExcluir}
          plataforma={getPlataformaInfo(contatoParaExcluir.platform)}
          onCancel={() => setContatoParaExcluir(null)}
          onConfirm={() => handleDesconectar(contatoParaExcluir)}
        />
      )}

      {/* MODAL DE DETALHES */}
      {detalhesConexao && (
        <DetalhesConexaoModal
          conexao={detalhesConexao}
          plataforma={getPlataformaInfo(detalhesConexao.platform)}
          onClose={() => setDetalhesConexao(null)}
          onSincronizar={() => handleSincronizar(detalhesConexao)}
          onToggleNotif={() => toggleNotificacoes(detalhesConexao.id)}
          onToggleAuto={() => toggleAutoReply(detalhesConexao.id)}
        />
      )}

      {/* MODAIS DE CONEXÃO */}
      {modalAberto === 'whatsapp' && (
        <ConexaoWhatsAppModal isOpen={true} onClose={() => setModalAberto(null)} />
      )}
      {modalAberto === 'instagram' && (
        <ConexaoInstagramModal isOpen={true} onClose={() => setModalAberto(null)} />
      )}
      {modalAberto === 'telegram' && (
        <ConexaoTelegramModal isOpen={true} onClose={() => setModalAberto(null)} />
      )}
      {modalAberto === 'email' && (
        <ConexaoEmailModal isOpen={true} onClose={() => setModalAberto(null)} />
      )}
      {modalAberto === 'facebook_messenger' && (
        <ConexaoFacebookModal isOpen={true} onClose={() => setModalAberto(null)} />
      )}
    </div>
  );
}

// ============================================================================
// STATS CARD
// ============================================================================
function StatsCard({
  icon: Icon,
  label,
  value,
  subvalue,
  color,
  trend,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: string;
  subvalue: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(25, 45, 65, 0.7) 0%, rgba(15, 30, 45, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(90, 120, 140, 0.25)',
        borderRadius: '14px',
        padding: '18px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}55`;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 24px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(90, 120, 140, 0.25)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: `${color}20`,
            border: `1px solid ${color}45`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={17} color={color} />
        </div>
        <span style={{ fontSize: '11px', color: '#7a96aa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: '#e8edf2', marginBottom: '4px', letterSpacing: '-0.5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: '#7a96aa', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {trend === 'up' && <TrendingUp size={10} color="#2ecc71" />}
        {subvalue}
      </div>
    </div>
  );
}

// ============================================================================
// PLATFORM CARD
// ============================================================================
function PlatformCard({
  plataforma,
  conexao,
  onConectar,
  onDesconectar,
  onSincronizar,
  onDetalhes,
  onToggleNotif,
}: {
  plataforma: PlataformaInfo;
  conexao: Conexao | undefined;
  onConectar: () => void;
  onDesconectar: () => void;
  onSincronizar: () => void;
  onDetalhes: () => void;
  onToggleNotif: () => void;
}) {
  const isConnected = conexao?.status === 'connected';
  const isSyncing = conexao?.status === 'syncing';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(25, 45, 65, 0.7) 0%, rgba(15, 30, 45, 0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isConnected ? 'rgba(46, 204, 113, 0.3)' : 'rgba(90, 120, 140, 0.25)'}`,
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${plataforma.cor}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: plataforma.gradient,
        }}
      />

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(15, 30, 45, 0.6)',
            border: '1px solid rgba(90, 120, 140, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 16px ${plataforma.cor}30`,
            flexShrink: 0,
          }}
        >
          <PlatformLogo platform={plataforma.id} size={36} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#e8edf2' }}>
              {plataforma.nome}
            </h3>
            {isConnected && <CheckCircle2 size={14} color="#2ecc71" />}
          </div>
          <div style={{ fontSize: '11px', color: '#7a96aa' }}>{plataforma.descricao}</div>
        </div>
        <StatusBadge status={conexao?.status} />
      </div>

      {/* INFO DA CONTA */}
      {conexao ? (
        <div
          style={{
            background: 'rgba(15, 30, 45, 0.5)',
            border: '1px solid rgba(90, 120, 140, 0.2)',
            borderRadius: '10px',
            padding: '12px',
          }}
        >
          {conexao.accountInfo.username && (
            <InfoLine label="Conta" value={`@${conexao.accountInfo.username}`} />
          )}
          {conexao.accountInfo.email && (
            <InfoLine label="Email" value={conexao.accountInfo.email} />
          )}
          {conexao.accountInfo.phone && (
            <InfoLine label="Telefone" value={conexao.accountInfo.phone} />
          )}
          {conexao.accountInfo.name && !conexao.accountInfo.username && (
            <InfoLine label="Nome" value={conexao.accountInfo.name} />
          )}

          {/* Mini Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '8px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(90, 120, 140, 0.15)',
            }}
          >
            <MiniStat
              icon={MessageSquare}
              value={conexao.stats.mensagensEnviadas + conexao.stats.mensagensRecebidas}
              label="Msgs"
              color="#3498db"
            />
            <MiniStat
              icon={Activity}
              value={`${conexao.stats.uptime}%`}
              label="Uptime"
              color="#2ecc71"
            />
            <MiniStat
              icon={Clock}
              value={conexao.stats.tempoResposta > 0 ? `${conexao.stats.tempoResposta}s` : '—'}
              label="Resp."
              color="#c9943a"
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(15, 30, 45, 0.3)',
            border: '1px dashed rgba(90, 120, 140, 0.25)',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={20} style={{ color: '#5a7a8a', marginBottom: '6px' }} />
          <div style={{ fontSize: '12px', color: '#7a96aa', fontWeight: 600 }}>
            Não conectado
          </div>
          <div style={{ fontSize: '10px', color: '#5a7a8a', marginTop: '2px' }}>
            Clique em conectar para começar
          </div>
        </div>
      )}

      {/* BOTÕES */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {!conexao ? (
          <button
            onClick={onConectar}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px 14px',
              borderRadius: '10px',
              border: 'none',
              background: plataforma.gradient,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: `0 6px 16px ${plataforma.cor}45`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = `0 8px 22px ${plataforma.cor}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 6px 16px ${plataforma.cor}45`;
            }}
          >
            <Plus size={15} />
            Conectar
          </button>
        ) : (
          <>
            <IconButton
              icon={RefreshCw}
              onClick={onSincronizar}
              color="#3498db"
              disabled={isSyncing}
              spin={isSyncing}
              tooltip="Sincronizar"
            />
            <IconButton
              icon={conexao.notificacoes ? Bell : BellOff}
              onClick={onToggleNotif}
              color={conexao.notificacoes ? '#c9943a' : '#5a7a8a'}
              tooltip={conexao.notificacoes ? 'Silenciar' : 'Ativar notificações'}
            />
            <button
              onClick={onDetalhes}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(201, 148, 58, 0.4)',
                background: 'rgba(201, 148, 58, 0.1)',
                color: '#c9943a',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 148, 58, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201, 148, 58, 0.1)';
              }}
            >
              <Settings size={14} />
              Gerenciar
            </button>
            <IconButton
              icon={Trash2}
              onClick={onDesconectar}
              color="#ef4444"
              tooltip="Desconectar"
            />
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================
function StatusBadge({ status }: { status?: Conexao['status'] }) {
  if (!status || status === 'disconnected') {
    return (
      <div style={{ fontSize: '10px', color: '#7a96aa', fontWeight: 600, padding: '4px 8px', borderRadius: '99px', background: 'rgba(122, 150, 170, 0.12)' }}>
        ○ Offline
      </div>
    );
  }
  if (status === 'syncing') {
    return (
      <div style={{ fontSize: '10px', color: '#3498db', fontWeight: 700, padding: '4px 8px', borderRadius: '99px', background: 'rgba(52, 152, 219, 0.15)' }}>
        ◌ Sync
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, padding: '4px 8px', borderRadius: '99px', background: 'rgba(239, 68, 68, 0.15)' }}>
        ✕ Erro
      </div>
    );
  }
  return (
    <div
      style={{
        fontSize: '10px',
        color: '#2ecc71',
        fontWeight: 700,
        padding: '4px 8px',
        borderRadius: '99px',
        background: 'rgba(46, 204, 113, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#2ecc71',
          boxShadow: '0 0 6px #2ecc71',
          animation: 'pulse 2s infinite',
        }}
      />
      Online
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: '12px', marginBottom: '5px', display: 'flex', gap: '6px' }}>
      <span style={{ color: '#7a96aa', minWidth: '56px' }}>{label}:</span>
      <span style={{ color: '#e8edf2', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '2px' }}>
        <Icon size={10} color={color} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#e8edf2' }}>{value}</span>
      </div>
      <div style={{ fontSize: '9px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    </div>
  );
}

function IconButton({
  icon: Icon,
  onClick,
  color,
  disabled,
  spin,
  tooltip,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  onClick: () => void;
  color: string;
  disabled?: boolean;
  spin?: boolean;
  tooltip?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        border: `1px solid ${color}40`,
        background: `${color}12`,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = `${color}22`;
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `${color}12`;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Icon size={15} color={color} />
      {spin && (
        <style>{`
          button > svg { animation: rotate 1s linear infinite; }
          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      )}
    </button>
  );
}

// ============================================================================
// CONFIRM DISCONNECT MODAL
// ============================================================================
function ConfirmDisconnectModal({
  conexao,
  plataforma,
  onCancel,
  onConfirm,
}: {
  conexao: Conexao;
  plataforma?: PlataformaInfo;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 60,
          animation: 'fadeIn 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #132636 0%, #0f1e2d 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.2)',
          zIndex: 70,
          maxWidth: '420px',
          width: '90%',
          padding: '24px',
          animation: 'slideUp 0.3s',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <AlertCircle size={28} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', textAlign: 'center', color: '#e8edf2' }}>
          Desconectar {plataforma?.nome}?
        </h2>
        <p style={{ fontSize: '13px', color: '#7a96aa', margin: '0 0 20px 0', textAlign: 'center', lineHeight: 1.5 }}>
          A conta <strong style={{ color: '#e8edf2' }}>@{conexao.accountInfo.username || conexao.accountInfo.email || conexao.accountInfo.name}</strong> será desconectada. Você precisará autenticar novamente para reconectar.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(90, 120, 140, 0.3)',
              background: 'transparent',
              color: '#7a96aa',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 6px 18px rgba(239, 68, 68, 0.4)',
            }}
          >
            Desconectar
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -40%); } to { opacity: 1; transform: translate(-50%, -50%); } }
      `}</style>
    </>
  );
}

// ============================================================================
// DETALHES MODAL
// ============================================================================
function DetalhesConexaoModal({
  conexao,
  plataforma,
  onClose,
  onSincronizar,
  onToggleNotif,
  onToggleAuto,
}: {
  conexao: Conexao;
  plataforma?: PlataformaInfo;
  onClose: () => void;
  onSincronizar: () => void;
  onToggleNotif: () => void;
  onToggleAuto: () => void;
}) {
  const dataFormatada = new Date(conexao.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const ultimaSync = conexao.lastSync
    ? new Date(conexao.lastSync).toLocaleString('pt-BR')
    : 'Nunca';

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 60,
          animation: 'fadeIn 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #132636 0%, #0f1e2d 100%)',
          borderRadius: '18px',
          border: '1px solid rgba(201, 148, 58, 0.25)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)',
          zIndex: 70,
          maxWidth: '520px',
          width: '92%',
          maxHeight: '88vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: plataforma?.gradient,
            padding: '22px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderRadius: '18px 18px 0 0',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlatformLogo platform={conexao.platform} size={36} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#fff' }}>
              {plataforma?.nome}
            </h2>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
              Conectado em {dataFormatada}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '24px' }}>
          {/* Info da Conta */}
          <SectionHeader title="Informações da Conta" />
          <div
            style={{
              background: 'rgba(15, 30, 45, 0.5)',
              border: '1px solid rgba(90, 120, 140, 0.2)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '20px',
            }}
          >
            {conexao.accountInfo.username && <DetalheLine label="Usuário" value={`@${conexao.accountInfo.username}`} />}
            {conexao.accountInfo.email && <DetalheLine label="Email" value={conexao.accountInfo.email} />}
            {conexao.accountInfo.phone && <DetalheLine label="Telefone" value={conexao.accountInfo.phone} />}
            {conexao.accountInfo.name && <DetalheLine label="Nome" value={conexao.accountInfo.name} />}
            <DetalheLine label="ID" value={conexao.id} mono />
          </div>

          {/* Stats Detalhadas */}
          <SectionHeader title="Estatísticas" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <DetalheStat label="Mensagens Enviadas" value={conexao.stats.mensagensEnviadas} color="#3498db" />
            <DetalheStat label="Mensagens Recebidas" value={conexao.stats.mensagensRecebidas} color="#9b59b6" />
            <DetalheStat label="Conversas Ativas" value={conexao.stats.conversasAtivas} color="#c9943a" />
            <DetalheStat label="Uptime" value={`${conexao.stats.uptime}%`} color="#2ecc71" />
            <DetalheStat label="Tempo Resposta" value={`${conexao.stats.tempoResposta}s`} color="#e67e22" />
            <DetalheStat label="Taxa Entrega" value={`${conexao.stats.taxaEntrega}%`} color="#1abc9c" />
          </div>

          {/* Configurações */}
          <SectionHeader title="Configurações" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <ToggleRow
              label="Notificações"
              description="Receber alertas de novas mensagens"
              active={!!conexao.notificacoes}
              onToggle={onToggleNotif}
            />
            <ToggleRow
              label="Auto-resposta"
              description="Responder automaticamente fora do horário"
              active={!!conexao.autoReply}
              onToggle={onToggleAuto}
            />
          </div>

          {/* Webhook */}
          {conexao.webhookUrl && (
            <>
              <SectionHeader title="Webhook URL" />
              <div
                style={{
                  background: 'rgba(15, 30, 45, 0.6)',
                  border: '1px solid rgba(90, 120, 140, 0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#7a96aa',
                  wordBreak: 'break-all',
                  marginBottom: '20px',
                }}
              >
                {conexao.webhookUrl}
              </div>
            </>
          )}

          {/* Ultima Sync */}
          <div
            style={{
              background: 'rgba(52, 152, 219, 0.08)',
              border: '1px solid rgba(52, 152, 219, 0.2)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Clock size={16} color="#3498db" />
            <div style={{ flex: 1, fontSize: '12px' }}>
              <span style={{ color: '#7a96aa' }}>Última sincronização: </span>
              <span style={{ color: '#e8edf2', fontWeight: 600 }}>{ultimaSync}</span>
            </div>
          </div>

          <button
            onClick={onSincronizar}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #c9943a 0%, #8b6620 100%)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(201, 148, 58, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={15} />
            Sincronizar agora
          </button>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3
      style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#c9943a',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        margin: '0 0 10px 0',
      }}
    >
      {title}
    </h3>
  );
}

function DetalheLine({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ fontSize: '12px', marginBottom: '8px', display: 'flex', gap: '8px' }}>
      <span style={{ color: '#7a96aa', minWidth: '80px', flexShrink: 0 }}>{label}:</span>
      <span
        style={{
          color: '#e8edf2',
          fontWeight: 500,
          fontFamily: mono ? 'monospace' : 'inherit',
          fontSize: mono ? '10px' : '12px',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DetalheStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      style={{
        background: 'rgba(15, 30, 45, 0.5)',
        border: `1px solid ${color}25`,
        borderRadius: '10px',
        padding: '12px',
      }}
    >
      <div style={{ fontSize: '10px', color: '#7a96aa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 800, color, letterSpacing: '-0.5px' }}>{value}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'rgba(15, 30, 45, 0.5)',
        border: '1px solid rgba(90, 120, 140, 0.2)',
        borderRadius: '10px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '11px', color: '#7a96aa' }}>{description}</div>
      </div>
      <button
        onClick={onToggle}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '99px',
          border: 'none',
          background: active ? '#c9943a' : 'rgba(90, 120, 140, 0.4)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.25s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: active ? '20px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  );
}

// ============================================================================
// WRAPPER COM PROVIDER
// ============================================================================
export function Conexoes() {
  return (
    <ToastProvider>
      <ConexoesContent />
    </ToastProvider>
  );
}
