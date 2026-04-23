'use client';

import { useMemo, useRef } from 'react';
import { Bot, Sparkles, Settings2, Pause, Activity, MessagesSquare, Gauge, Plus } from 'lucide-react';
import styles from './PortalIas.module.css';

interface IA {
  id: number;
  nome: string;
  desc: string;
  msgs: number;
  concluido: number;
  latencia: string;
  accent: string;
  accentDark: string;
  inicial: string;
  status: 'online' | 'idle';
}

const IAS: IA[] = [
  { id: 1, nome: 'Hávila IA', desc: 'Atendimento & Captação', msgs: 2847, concluido: 67, latencia: '99.8%', accent: '#9b59b6', accentDark: '#7d3c98', inicial: 'H', status: 'online' },
  { id: 2, nome: 'Camilly IA', desc: 'Follow-up & Alimentação', msgs: 1423, concluido: 34, latencia: '99.2%', accent: '#3498db', accentDark: '#21618c', inicial: 'C', status: 'online' },
  { id: 3, nome: 'Secretária IA', desc: 'Agendamentos', msgs: 934, concluido: 89, latencia: '100%', accent: '#2ecc71', accentDark: '#1e8449', inicial: 'S', status: 'online' },
  { id: 4, nome: 'Triagem IA', desc: 'Qualificação', msgs: 412, concluido: 18, latencia: '—', accent: '#f39c12', accentDark: '#b9770e', inicial: 'T', status: 'idle' },
];

export function PortalIas() {
  const rootRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(() => {
    const msgs = IAS.reduce((s, i) => s + i.msgs, 0);
    const online = IAS.filter((i) => i.status === 'online').length;
    const avgConcluido = Math.round(IAS.reduce((s, i) => s + i.concluido, 0) / IAS.length);
    return { msgs, online, avgConcluido, total: IAS.length };
  }, []);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={rootRef} className={styles.container}>
      {/* HEADER HERO */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} /> Agentes Inteligentes · Tempo Real
          </span>
          <h1 className={styles.title}>Portal das IAs</h1>
          <p className={styles.subtitle}>
            <strong>{totals.total}</strong> agentes ativos · <strong>{totals.msgs.toLocaleString('pt-BR')}</strong> mensagens processadas · <strong>{totals.avgConcluido}%</strong> taxa média de conclusão
          </p>
        </div>

        <button className={styles.btnNovo}>
          <Plus size={16} strokeWidth={2.6} />
          Novo Agente
        </button>
      </div>

      {/* STATS BAR */}
      <div className={styles.statsBar}>
        <div className={styles.statBadge}>
          <span className={styles.statBadgeIcon}><Bot size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBadgeBody}>
            <span className={styles.statBadgeLabel}>Total de Agentes</span>
            <span className={styles.statBadgeValue}>{totals.total}</span>
          </div>
        </div>
        <div className={styles.statBadge}>
          <span className={styles.statBadgeIcon}><Activity size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBadgeBody}>
            <span className={styles.statBadgeLabel}>Online</span>
            <span className={styles.statBadgeValue}>{totals.online}</span>
          </div>
        </div>
        <div className={styles.statBadge}>
          <span className={styles.statBadgeIcon}><MessagesSquare size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBadgeBody}>
            <span className={styles.statBadgeLabel}>Mensagens</span>
            <span className={styles.statBadgeValue}>{totals.msgs.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <div className={styles.statBadge}>
          <span className={styles.statBadgeIcon}><Gauge size={18} strokeWidth={2.2} /></span>
          <div className={styles.statBadgeBody}>
            <span className={styles.statBadgeLabel}>Concluído (média)</span>
            <span className={styles.statBadgeValue}>{totals.avgConcluido}%</span>
          </div>
        </div>
      </div>

      {/* GRID DE IAs */}
      <div className={styles.grid}>
        {IAS.map((ia) => (
          <div
            key={ia.id}
            className={styles.card}
            onMouseMove={handleCardMove}
            style={{
              ['--ia-accent' as string]: ia.accent,
              ['--ia-accent-dark' as string]: ia.accentDark,
            } as React.CSSProperties}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{ia.inicial}</div>
              <div className={styles.cardTitleWrap}>
                <h3 className={styles.cardTitle}>
                  <Sparkles size={12} style={{ display: 'inline', marginRight: 6, color: ia.accent, verticalAlign: '-2px' }} />
                  {ia.nome}
                </h3>
                <span className={styles.cardDesc}>{ia.desc}</span>
              </div>
              <span className={`${styles.statusBadge} ${ia.status === 'online' ? styles.statusOnline : styles.statusIdle}`}>
                <span className={styles.statusDot} style={{ background: ia.status === 'online' ? '#2ecc71' : '#f39c12', boxShadow: `0 0 8px ${ia.status === 'online' ? '#2ecc71' : '#f39c12'}` }} />
                {ia.status === 'online' ? 'Online' : 'Ausente'}
              </span>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Mensagens</span>
                <span className={styles.metricValue}>{ia.msgs.toLocaleString('pt-BR')}</span>
              </div>
              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Concluído</span>
                <span className={`${styles.metricValue} ${styles.metricAccent}`}>{ia.concluido}%</span>
              </div>
              <div className={styles.metricCell}>
                <span className={styles.metricLabel}>Latência</span>
                <span className={styles.metricValue}>{ia.latencia}</span>
              </div>
            </div>

            <div className={styles.progressWrap}>
              <div className={styles.progressLabel}>
                <span>Performance</span>
                <strong>{ia.concluido}%</strong>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${ia.concluido}%` }} />
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary}>
                <Settings2 size={13} strokeWidth={2.4} />
                Configurar
              </button>
              <button className={styles.btnSecondary}>
                <Pause size={13} strokeWidth={2.4} />
                Pausar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
