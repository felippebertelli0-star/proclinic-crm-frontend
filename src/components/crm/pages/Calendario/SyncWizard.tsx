/**
 * SyncWizard · ULTRA MEGA PREMIUM AAA
 * Assistente 4 passos para conectar agendas externas (Google, Outlook, Apple,
 * sistemas médicos, Calendly, etc.) à agenda do profissional no CRM ProClinic.
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Link2,
  Shield,
  Plug,
  HelpCircle,
  Trash2,
  Power,
  RefreshCw,
  Plus,
  Sparkles,
  ChevronsRight,
} from 'lucide-react';
import {
  useSyncStore,
  PLATAFORMAS,
  type Platform,
  type SyncConnection,
  type IntegrationType,
  type CategoryId,
} from '@/store/syncStore';
import styles from './SyncWizard.module.css';

interface SyncWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardView = 'list' | 'wizard' | 'success';

const STEP_LABELS = ['Plataforma', 'Autenticar', 'Configurar', 'Revisar'] as const;

const CATEGORIA_LABELS: Record<CategoryId, { titulo: string; descricao: string }> = {
  pessoal: {
    titulo: 'Calendários Pessoais',
    descricao: 'Gmail, Apple, Outlook, Microsoft 365',
  },
  medico: {
    titulo: 'Sistemas de Gestão Médica',
    descricao: 'Feegow, iClinic, Doctoralia, Amplimed e outros',
  },
  agendamento: {
    titulo: 'Plataformas de Agendamento Online',
    descricao: 'Calendly, Cal.com, Acuity',
  },
};

const INTEGRATION_BADGE: Record<IntegrationType, { label: string; className: string }> = {
  oficial: { label: 'Oficial', className: 'badgeOficial' },
  ical:    { label: 'iCal',    className: 'badgeIcal' },
  api:     { label: 'API',     className: 'badgeApi' },
  caldav:  { label: 'CalDAV',  className: 'badgeCaldav' },
};

// Mock dos calendários que a plataforma expõe (pós-autenticação)
const MOCK_CALENDARIOS_POR_PLATAFORMA: Record<string, string[]> = {
  google:     ['Principal', 'Aniversários', 'Feriados do Brasil'],
  outlook:    ['Calendário', 'Reuniões', 'Pessoal'],
  apple:      ['Casa', 'Trabalho', 'iCloud'],
  ical:       ['Feed Importado'],
  feegow:     ['Consultas', 'Retornos', 'Bloqueios'],
  iclinic:    ['Agenda Principal', 'Procedimentos'],
  doctoralia: ['Consultas Online', 'Consultas Presenciais'],
  calendly:   ['Disponibilidade Padrão', 'Primeira Consulta'],
  calcom:     ['30 min', '60 min', 'Retornos'],
  acuity:     ['Consulta Inicial', 'Retorno'],
};

const DEFAULT_CALENDARIOS = ['Principal'];

function calendariosDaPlataforma(pId: string): string[] {
  return MOCK_CALENDARIOS_POR_PLATAFORMA[pId] || DEFAULT_CALENDARIOS;
}

// Preview de eventos mock (pós-conexão, step 4)
const PREVIEW_EVENTS = [
  { hora: '09:00', paciente: 'Camila Barros', data: 'Seg, 28/Abr' },
  { hora: '11:30', paciente: 'Rodrigo Vaz',   data: 'Ter, 29/Abr' },
  { hora: '14:00', paciente: 'Daniel Alves',  data: 'Qua, 30/Abr' },
];

export function SyncWizard({ isOpen, onClose }: SyncWizardProps) {
  // ── Store ──────────────────────────────────────────────────────────────────
  const conexoes = useSyncStore((s) => s.conexoes);
  const addConexao = useSyncStore((s) => s.addConexao);
  const removeConexao = useSyncStore((s) => s.removeConexao);
  const toggleConexao = useSyncStore((s) => s.toggleConexao);
  const hydrate = useSyncStore((s) => s.hydrate);

  // ── Estado do wizard ───────────────────────────────────────────────────────
  const [view, setView] = useState<WizardView>('list');
  const [step, setStep] = useState(1);
  const [selectedPf, setSelectedPf] = useState<Platform | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Form fields
  const [conta, setConta] = useState('');
  const [credUrl, setCredUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [subdominio, setSubdominio] = useState('');
  const [direcao, setDirecao] = useState<SyncConnection['direcao']>('bidirecional');
  const [frequencia, setFrequencia] = useState<SyncConnection['frequencia']>('15min');
  const [conflito, setConflito] = useState<SyncConnection['conflito']>('sistema');
  const [calSelecionados, setCalSelecionados] = useState<string[]>([]);

  // ── Hydrate no primeiro mount (antes de qualquer decisão de view) ──────────
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Quando abrir: se há conexões, mostra lista; senão, wizard direto
  useEffect(() => {
    if (!isOpen) return;
    // Lê direto da store para evitar stale closure do `conexoes`
    const atuais = useSyncStore.getState().conexoes;
    setView(atuais.length > 0 ? 'list' : 'wizard');
    setStep(1);
    setSelectedPf(null);
    setConnecting(false);
    setAuthed(false);
    resetFormFields();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetFormFields = () => {
    setConta('');
    setCredUrl('');
    setApiKey('');
    setSubdominio('');
    setDirecao('bidirecional');
    setFrequencia('15min');
    setConflito('sistema');
    setCalSelecionados([]);
  };

  // ESC fecha
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Radial glow tracking
  const handleMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  // ── Navegação do wizard ────────────────────────────────────────────────────
  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const startNewWizard = () => {
    setView('wizard');
    setStep(1);
    setSelectedPf(null);
    setAuthed(false);
    resetFormFields();
  };

  const handleSelectPlatform = (pf: Platform) => {
    setSelectedPf(pf);
    // Pre-seleciona o primeiro calendário
    setCalSelecionados([calendariosDaPlataforma(pf.id)[0] ?? 'Principal']);
  };

  const handleOAuthSimulate = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setAuthed(true);
      // Pré-preenche conta simulada
      if (selectedPf) {
        const label =
          selectedPf.integracao === 'oficial'
            ? `doutor@${selectedPf.id === 'google' ? 'gmail.com' : selectedPf.id + '.com'}`
            : 'Conta conectada';
        setConta(label);
      }
      goNext();
    }, 1800);
  };

  const handleManualNext = () => {
    if (!selectedPf) return;
    // iCal precisa de URL
    if (selectedPf.integracao === 'ical' && !credUrl.trim()) return;
    // API precisa de apiKey
    if (selectedPf.integracao === 'api' && !apiKey.trim()) return;
    // CalDAV precisa de conta + senha (usamos apiKey como app-password)
    if (selectedPf.integracao === 'caldav' && (!conta.trim() || !apiKey.trim())) return;

    setAuthed(true);
    // Define um label de conta legível
    if (!conta.trim()) {
      if (selectedPf.integracao === 'ical') setConta(shortenUrl(credUrl));
      else if (selectedPf.integracao === 'api') setConta(subdominio || selectedPf.nome);
    }
    goNext();
  };

  const handleFinalize = () => {
    if (!selectedPf) return;
    const novaConexao: SyncConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      platformId: selectedPf.id,
      platformNome: selectedPf.nome,
      platformCor: selectedPf.cor,
      contaLabel: conta || selectedPf.nome,
      direcao,
      frequencia,
      conflito,
      calendariosImportados: calSelecionados,
      criadoEm: new Date().toISOString(),
      ultimaSync: new Date().toISOString(),
      ativo: true,
    };
    addConexao(novaConexao);
    setView('success');
  };

  const handleCloseFromSuccess = () => {
    setView('list');
  };

  const toggleCalendario = (nome: string) => {
    setCalSelecionados((prev) =>
      prev.includes(nome) ? prev.filter((c) => c !== nome) : [...prev, nome]
    );
  };

  // ── Botão "Próximo" está habilitado? ───────────────────────────────────────
  const canAdvance = useMemo(() => {
    if (step === 1) return !!selectedPf;
    if (step === 2) return authed || false; // Só avança via OAuth/Manual
    if (step === 3) return calSelecionados.length > 0;
    return true;
  }, [step, selectedPf, authed, calSelecionados]);

  // Plataformas agrupadas por categoria
  const plataformasPorCategoria = useMemo(() => {
    const groups: Record<CategoryId, Platform[]> = {
      pessoal: [],
      medico: [],
      agendamento: [],
    };
    PLATAFORMAS.forEach((pf) => groups[pf.categoria].push(pf));
    return groups;
  }, []);

  if (!isOpen) return null;

  // Agora detecta step dinâmico do label (Passo X de 4)
  const stepLabel = view === 'wizard' ? `Passo ${step} de 4 · ${STEP_LABELS[step - 1]}` : '';

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sync-wizard-title"
      >
        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id="sync-wizard-title" className={styles.title}>
              {view === 'list'
                ? 'Sincronização de Agendas'
                : view === 'success'
                ? 'Sincronização Ativa'
                : 'Sincronizar Nova Agenda'}
            </h2>
            <p className={styles.subtitle}>
              {view === 'list'
                ? 'Gerencie as agendas conectadas ou adicione uma nova fonte.'
                : view === 'success'
                ? 'Sua agenda agora está sincronizada em tempo real.'
                : selectedPf
                ? `Configurando: ${selectedPf.nome}`
                : 'Escolha de qual plataforma trazer seus agendamentos.'}
            </p>
          </div>
          <div className={styles.headerRight}>
            {view === 'wizard' && (
              <span className={styles.stepBadge}>
                <ChevronsRight size={12} strokeWidth={2.8} />
                {stepLabel}
              </span>
            )}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Fechar"
            >
              <X size={16} strokeWidth={2.6} />
            </button>
          </div>
        </div>

        {/* ── PROGRESS BAR (só no wizard) ── */}
        {view === 'wizard' && (
          <div className={styles.progress}>
            {STEP_LABELS.map((label, idx) => {
              const num = idx + 1;
              const stateCls =
                num < step
                  ? styles.progressStepDone
                  : num === step
                  ? styles.progressStepActive
                  : '';
              return (
                <div key={label} className={`${styles.progressStep} ${stateCls}`}>
                  <div className={styles.progressBar} />
                  <div className={styles.progressLabel}>
                    {num}. {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BODY ── */}
        <div className={styles.body} key={`${view}-${step}`}>
          {/* ═══ LISTA DE CONEXÕES ATIVAS ═══ */}
          {view === 'list' && (
            <>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Link2 size={12} strokeWidth={2.8} />
                </span>
                Agendas Conectadas · <strong>{conexoes.length}</strong>
              </div>

              {conexoes.length === 0 ? (
                <div className={styles.authIntro} style={{ textAlign: 'center', padding: '18px 0' }}>
                  Nenhuma agenda conectada ainda. Adicione a primeira abaixo.
                </div>
              ) : (
                <div className={styles.activeList}>
                  {conexoes.map((c) => (
                    <div
                      key={c.id}
                      className={styles.activeItem}
                      style={{ ['--pf-color' as string]: c.platformCor } as React.CSSProperties}
                    >
                      <div
                        className={styles.pfIcon}
                        style={{ ['--pf-color' as string]: c.platformCor } as React.CSSProperties}
                      >
                        {c.platformNome[0]}
                      </div>
                      <div className={styles.activeInfo}>
                        <span className={styles.activeName}>{c.platformNome}</span>
                        <span className={styles.activeMeta}>
                          {c.contaLabel} · {c.direcao === 'bidirecional' ? 'Bidirecional' : 'Somente leitura'} ·
                          {' '}
                          {c.frequencia === 'realtime'
                            ? 'Tempo real'
                            : c.frequencia === '5min'
                            ? 'A cada 5 min'
                            : c.frequencia === '15min'
                            ? 'A cada 15 min'
                            : 'A cada 60 min'}
                        </span>
                      </div>
                      <span
                        className={`${styles.activeStatus} ${c.ativo ? styles.statusOn : styles.statusOff}`}
                      >
                        {c.ativo && <span className={styles.statusOnDot} />}
                        {c.ativo ? 'Ativo' : 'Pausado'}
                      </span>
                      <div className={styles.activeActions}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => toggleConexao(c.id)}
                          aria-label={c.ativo ? 'Pausar' : 'Ativar'}
                          title={c.ativo ? 'Pausar sincronização' : 'Ativar sincronização'}
                        >
                          <Power size={14} strokeWidth={2.4} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          onClick={() => removeConexao(c.id)}
                          aria-label="Remover"
                          title="Remover conexão"
                        >
                          <Trash2 size={14} strokeWidth={2.4} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={styles.addNewBtn}
                onClick={startNewWizard}
              >
                <Plus size={16} strokeWidth={2.8} />
                Conectar Nova Agenda
              </button>
            </>
          )}

          {/* ═══ SUCCESS STATE ═══ */}
          {view === 'success' && selectedPf && (
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>
                <Check size={38} strokeWidth={3} />
              </div>
              <h3 className={styles.successTitle}>Tudo Pronto!</h3>
              <p className={styles.successText}>
                <strong style={{ color: '#e8edf2' }}>{selectedPf.nome}</strong> foi conectado
                com sucesso. Seus agendamentos de <strong style={{ color: '#c9943a' }}>
                {calSelecionados.length}
                </strong> calendário(s) começarão a aparecer automaticamente no Calendário do CRM.
              </p>
              <div className={styles.testConnection} style={{ marginTop: 6 }}>
                <div className={styles.testOK}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div className={styles.testText}>
                  Primeira sincronização concluída
                  <small>
                    {calSelecionados.length} calendário(s) · {PREVIEW_EVENTS.length} eventos
                    importados
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* ═══ WIZARD STEP 1 — PLATAFORMA ═══ */}
          {view === 'wizard' && step === 1 && (
            <>
              {(['pessoal', 'medico', 'agendamento'] as CategoryId[]).map((cat) => (
                <div key={cat}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>
                      {cat === 'pessoal' ? (
                        <CalendarIcon size={12} strokeWidth={2.8} />
                      ) : cat === 'medico' ? (
                        <Shield size={12} strokeWidth={2.8} />
                      ) : (
                        <Zap size={12} strokeWidth={2.8} />
                      )}
                    </span>
                    {CATEGORIA_LABELS[cat].titulo}
                    <span style={{ fontSize: 10, color: '#7a96aa', fontWeight: 600, letterSpacing: 0.3, textTransform: 'none', marginLeft: 'auto' }}>
                      {CATEGORIA_LABELS[cat].descricao}
                    </span>
                  </div>
                  <div className={styles.grid}>
                    {plataformasPorCategoria[cat].map((pf) => {
                      const badge = INTEGRATION_BADGE[pf.integracao];
                      const isSelected = selectedPf?.id === pf.id;
                      return (
                        <button
                          key={pf.id}
                          type="button"
                          onMouseMove={handleMove}
                          onClick={() => handleSelectPlatform(pf)}
                          className={`${styles.platformCard} ${isSelected ? styles.platformCardSelected : ''}`}
                          style={{ ['--pf-color' as string]: pf.cor } as React.CSSProperties}
                        >
                          <span className={`${styles.pfBadge} ${styles[badge.className]}`}>
                            {badge.label}
                          </span>
                          <div className={styles.pfIcon}>{pf.inicial}</div>
                          <div className={styles.pfBody}>
                            <span className={styles.pfName}>{pf.nome}</span>
                            <span className={styles.pfDesc}>{pf.descricao}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ═══ WIZARD STEP 2 — AUTENTICAÇÃO ═══ */}
          {view === 'wizard' && step === 2 && selectedPf && (
            <div className={styles.authWrap} style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}>
              {connecting ? (
                <div className={styles.connecting}>
                  <div className={styles.spinner} />
                  <div className={styles.connectingText}>
                    Conectando com <strong>{selectedPf.nome}</strong>...
                  </div>
                  <div style={{ fontSize: 11, color: '#7a96aa', maxWidth: 360, textAlign: 'center' }}>
                    Você pode ser redirecionado para autorizar o acesso. Volte para esta janela ao concluir.
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.authHero}>
                    <div
                      className={styles.pfIcon}
                      style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}
                    >
                      {selectedPf.inicial}
                    </div>
                    <div className={styles.authHeroInfo}>
                      <div className={styles.authHeroName}>{selectedPf.nome}</div>
                      <div className={styles.authHeroDesc}>{selectedPf.descricao}</div>
                    </div>
                  </div>

                  {/* OFICIAL (OAuth) */}
                  {selectedPf.integracao === 'oficial' && (
                    <>
                      <p className={styles.authIntro}>
                        Vamos abrir a tela oficial da <strong>{selectedPf.nome}</strong> para você
                        autorizar o CRM. <strong>Não compartilhamos sua senha</strong> — apenas
                        recebemos permissão de leitura/escrita dos seus calendários.
                      </p>
                      <button
                        type="button"
                        onClick={handleOAuthSimulate}
                        className={styles.oauthBtn}
                        style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}
                      >
                        <Plug size={16} strokeWidth={2.8} />
                        Conectar com {selectedPf.nome}
                      </button>
                      <div style={{ textAlign: 'center' }}>
                        <a className={styles.helpLink}>
                          <HelpCircle size={12} strokeWidth={2.6} />
                          Como funciona a autorização?
                        </a>
                      </div>
                    </>
                  )}

                  {/* iCAL (URL pública) */}
                  {selectedPf.integracao === 'ical' && (
                    <>
                      <p className={styles.authIntro}>
                        Cole abaixo o <strong>link .ics</strong> (URL pública) do calendário que
                        deseja importar. A sincronização será <strong>somente leitura</strong>.
                      </p>
                      <label className={styles.formLabel}>
                        URL do calendário (.ics)
                        <input
                          type="url"
                          placeholder="https://exemplo.com/meu-calendario.ics"
                          className={styles.formInput}
                          value={credUrl}
                          onChange={(e) => setCredUrl(e.target.value)}
                        />
                      </label>
                      <a className={styles.helpLink}>
                        <HelpCircle size={12} strokeWidth={2.6} />
                        Onde encontro o link .ics?
                      </a>
                      <button
                        type="button"
                        onClick={handleManualNext}
                        disabled={!credUrl.trim()}
                        className={styles.oauthBtn}
                        style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}
                      >
                        <Link2 size={16} strokeWidth={2.8} />
                        Validar e Continuar
                      </button>
                    </>
                  )}

                  {/* API (chave + subdomínio) */}
                  {selectedPf.integracao === 'api' && (
                    <>
                      <p className={styles.authIntro}>
                        Conecte via API. Pegue sua chave na área de <strong>Integrações</strong>
                        dentro do painel da <strong>{selectedPf.nome}</strong>.
                      </p>
                      <label className={styles.formLabel}>
                        Subdomínio / ID da Clínica <small>(se aplicável)</small>
                        <input
                          type="text"
                          placeholder="suaclinica"
                          className={styles.formInput}
                          value={subdominio}
                          onChange={(e) => setSubdominio(e.target.value)}
                        />
                      </label>
                      <label className={styles.formLabel}>
                        Chave de API
                        <input
                          type="password"
                          placeholder="cole sua API key aqui"
                          className={styles.formInput}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </label>
                      <a className={styles.helpLink}>
                        <HelpCircle size={12} strokeWidth={2.6} />
                        Onde achar minha chave na {selectedPf.nome}?
                      </a>
                      <button
                        type="button"
                        onClick={handleManualNext}
                        disabled={!apiKey.trim()}
                        className={styles.oauthBtn}
                        style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}
                      >
                        <Shield size={16} strokeWidth={2.8} />
                        Conectar com Chave
                      </button>
                    </>
                  )}

                  {/* CALDAV (Apple: e-mail + senha de app) */}
                  {selectedPf.integracao === 'caldav' && (
                    <>
                      <p className={styles.authIntro}>
                        Para o <strong>Apple iCalendar (iCloud)</strong> é necessário uma
                        <strong> senha de aplicativo</strong>. Siga os passos abaixo:
                      </p>
                      <div className={styles.tutorialSteps}>
                        <div className={styles.tutorialStep}>
                          <span className={styles.tutorialStepNum}>1</span>
                          Acesse <strong>appleid.apple.com</strong> com seu Apple ID.
                        </div>
                        <div className={styles.tutorialStep}>
                          <span className={styles.tutorialStepNum}>2</span>
                          Em <strong>Segurança</strong>, clique em “Gerar senha específica do app”.
                        </div>
                        <div className={styles.tutorialStep}>
                          <span className={styles.tutorialStepNum}>3</span>
                          Dê um nome (ex: <em>ProClinic</em>) e copie a senha gerada.
                        </div>
                        <div className={styles.tutorialStep}>
                          <span className={styles.tutorialStepNum}>4</span>
                          Cole seu Apple ID e a senha nos campos abaixo.
                        </div>
                      </div>
                      <label className={styles.formLabel}>
                        Apple ID (e-mail)
                        <input
                          type="email"
                          placeholder="voce@icloud.com"
                          className={styles.formInput}
                          value={conta}
                          onChange={(e) => setConta(e.target.value)}
                        />
                      </label>
                      <label className={styles.formLabel}>
                        Senha de Aplicativo
                        <input
                          type="password"
                          placeholder="xxxx-xxxx-xxxx-xxxx"
                          className={styles.formInput}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleManualNext}
                        disabled={!conta.trim() || !apiKey.trim()}
                        className={styles.oauthBtn}
                        style={{ ['--pf-color' as string]: selectedPf.cor } as React.CSSProperties}
                      >
                        <Shield size={16} strokeWidth={2.8} />
                        Validar iCloud
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ═══ WIZARD STEP 3 — CONFIGURAR ═══ */}
          {view === 'wizard' && step === 3 && selectedPf && (
            <>
              {/* Calendários para importar */}
              <div className={styles.configGroup}>
                <div className={styles.configTitle}>
                  <CalendarIcon size={14} strokeWidth={2.6} style={{ color: '#c9943a' }} />
                  Quais calendários deseja trazer?
                </div>
                <div className={styles.configOptions}>
                  {calendariosDaPlataforma(selectedPf.id).map((nome) => {
                    const active = calSelecionados.includes(nome);
                    return (
                      <button
                        type="button"
                        key={nome}
                        onClick={() => toggleCalendario(nome)}
                        className={`${styles.checkRow} ${active ? styles.checkRowActive : ''}`}
                      >
                        <span className={styles.checkBox}>
                          {active && <Check size={12} strokeWidth={3.2} />}
                        </span>
                        {nome}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direção */}
              <div className={styles.configGroup}>
                <div className={styles.configTitle}>
                  <RefreshCw size={14} strokeWidth={2.6} style={{ color: '#c9943a' }} />
                  Direção da sincronização
                </div>
                <div className={styles.configOptionsRow}>
                  <button
                    type="button"
                    onClick={() => setDirecao('bidirecional')}
                    className={`${styles.configOption} ${direcao === 'bidirecional' ? styles.configOptionActive : ''}`}
                  >
                    <span className={styles.radioDot} />
                    <span>
                      Bidirecional
                      <span className={styles.configOptionDesc}>
                        Alterações em qualquer lado se espelham no outro.
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirecao('leitura')}
                    className={`${styles.configOption} ${direcao === 'leitura' ? styles.configOptionActive : ''}`}
                  >
                    <span className={styles.radioDot} />
                    <span>
                      Somente leitura
                      <span className={styles.configOptionDesc}>
                        Só trazemos eventos de fora — não escrevemos nada.
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Frequência */}
              <div className={styles.configGroup}>
                <div className={styles.configTitle}>
                  <Zap size={14} strokeWidth={2.6} style={{ color: '#c9943a' }} />
                  Frequência
                </div>
                <div className={styles.configOptionsRow}>
                  {([
                    ['realtime', 'Tempo real', 'Ideal para Google/Outlook.'],
                    ['5min',     'A cada 5 min', 'Atualização rápida.'],
                    ['15min',    'A cada 15 min', 'Equilíbrio padrão.'],
                    ['60min',    'A cada 60 min', 'Menor consumo.'],
                  ] as const).map(([val, label, desc]) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setFrequencia(val)}
                      className={`${styles.configOption} ${frequencia === val ? styles.configOptionActive : ''}`}
                    >
                      <span className={styles.radioDot} />
                      <span>
                        {label}
                        <span className={styles.configOptionDesc}>{desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conflito */}
              <div className={styles.configGroup}>
                <div className={styles.configTitle}>
                  <Shield size={14} strokeWidth={2.6} style={{ color: '#c9943a' }} />
                  Em caso de conflito
                </div>
                <div className={styles.configOptions}>
                  <button
                    type="button"
                    onClick={() => setConflito('sistema')}
                    className={`${styles.configOption} ${conflito === 'sistema' ? styles.configOptionActive : ''}`}
                  >
                    <span className={styles.radioDot} />
                    <span>
                      O CRM ProClinic vence
                      <span className={styles.configOptionDesc}>
                        Nossa agenda tem prioridade quando há divergência.
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConflito('origem')}
                    className={`${styles.configOption} ${conflito === 'origem' ? styles.configOptionActive : ''}`}
                  >
                    <span className={styles.radioDot} />
                    <span>
                      A fonte externa vence
                      <span className={styles.configOptionDesc}>
                        {selectedPf.nome} prevalece em caso de conflito.
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConflito('manual')}
                    className={`${styles.configOption} ${conflito === 'manual' ? styles.configOptionActive : ''}`}
                  >
                    <span className={styles.radioDot} />
                    <span>
                      Perguntar toda vez
                      <span className={styles.configOptionDesc}>
                        Você decide manualmente em cada conflito.
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ═══ WIZARD STEP 4 — REVISAR ═══ */}
          {view === 'wizard' && step === 4 && selectedPf && (
            <>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Check size={12} strokeWidth={3} />
                </span>
                Resumo da Conexão
              </div>
              <div className={styles.reviewCard}>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Plataforma</span>
                  <span
                    className={`${styles.reviewValue} ${styles.reviewValueAccent}`}
                    style={{ color: selectedPf.cor }}
                  >
                    {selectedPf.nome}
                  </span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Conta</span>
                  <span className={styles.reviewValue}>{conta || '—'}</span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Direção</span>
                  <span className={styles.reviewValue}>
                    {direcao === 'bidirecional' ? 'Bidirecional' : 'Somente leitura'}
                  </span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Frequência</span>
                  <span className={styles.reviewValue}>
                    {frequencia === 'realtime'
                      ? 'Tempo real'
                      : frequencia === '5min'
                      ? 'A cada 5 min'
                      : frequencia === '15min'
                      ? 'A cada 15 min'
                      : 'A cada 60 min'}
                  </span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Calendários</span>
                  <span className={styles.reviewValue}>
                    {calSelecionados.length} selecionado(s)
                  </span>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewLabel}>Conflito</span>
                  <span className={styles.reviewValue}>
                    {conflito === 'sistema'
                      ? 'CRM prevalece'
                      : conflito === 'origem'
                      ? 'Origem prevalece'
                      : 'Perguntar sempre'}
                  </span>
                </div>
              </div>

              <div className={styles.testConnection}>
                <div className={styles.testOK}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <div className={styles.testText}>
                  Teste de conexão bem-sucedido
                  <small>
                    Credenciais validadas · {calSelecionados.length} calendário(s)
                    disponível(is)
                  </small>
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>
                  <Sparkles size={12} strokeWidth={2.8} />
                </span>
                Prévia dos Próximos Eventos
              </div>
              <div className={styles.previewList}>
                {PREVIEW_EVENTS.map((ev, i) => (
                  <div
                    key={i}
                    className={styles.previewItem}
                    style={{
                      ['--pf-color' as string]: selectedPf.cor,
                      animationDelay: `${i * 0.05}s`,
                    } as React.CSSProperties}
                  >
                    <span className={styles.previewHora}>{ev.hora}</span>
                    <span className={styles.previewPaciente}>{ev.paciente}</span>
                    <span className={styles.previewData}>{ev.data}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div className={styles.footer}>
          {view === 'list' && (
            <>
              <button type="button" className={styles.btnGhost} onClick={onClose}>
                Fechar
              </button>
              <span className={styles.btnSpacer} />
              <button type="button" className={styles.btnPrimary} onClick={startNewWizard}>
                <Plus size={14} strokeWidth={2.8} />
                Nova Conexão
              </button>
            </>
          )}

          {view === 'wizard' && (
            <>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={step === 1 ? () => setView(conexoes.length > 0 ? 'list' : 'wizard') : goBack}
                disabled={step === 1 && conexoes.length === 0}
              >
                <ChevronLeft size={14} strokeWidth={2.6} />
                {step === 1 ? 'Voltar' : 'Anterior'}
              </button>
              <span className={styles.btnSpacer} />
              {step < 4 && step !== 2 && (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={goNext}
                  disabled={!canAdvance}
                >
                  Próximo
                  <ChevronRight size={14} strokeWidth={2.8} />
                </button>
              )}
              {step === 2 && !connecting && authed && (
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={goNext}
                >
                  Próximo
                  <ChevronRight size={14} strokeWidth={2.8} />
                </button>
              )}
              {step === 4 && (
                <button
                  type="button"
                  className={styles.btnSuccess}
                  onClick={handleFinalize}
                >
                  <Check size={14} strokeWidth={3} />
                  Ativar Sincronização
                  <ArrowRight size={14} strokeWidth={2.8} />
                </button>
              )}
            </>
          )}

          {view === 'success' && (
            <>
              <span className={styles.btnSpacer} />
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleCloseFromSuccess}
              >
                Ver Conexões
                <ChevronRight size={14} strokeWidth={2.8} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function shortenUrl(u: string): string {
  try {
    const url = new URL(u);
    return url.host.replace(/^www\./, '');
  } catch {
    return u.slice(0, 32);
  }
}
