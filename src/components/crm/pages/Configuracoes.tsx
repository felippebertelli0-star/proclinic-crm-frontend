'use client';

import { useState } from 'react';
import {
  Settings,
  Building2,
  Bell,
  Clock,
  Sparkles,
  Shield,
  Palette,
  Save,
  Check,
  Moon,
  Sun,
  Mail,
  Phone,
  FileText,
  Globe,
  Zap,
  Lock,
  User,
} from 'lucide-react';

type TabId = 'clinica' | 'notificacoes' | 'horario' | 'ia' | 'aparencia' | 'seguranca';

const TABS: { id: TabId; label: string; Icon: typeof Settings }[] = [
  { id: 'clinica', label: 'Clínica', Icon: Building2 },
  { id: 'notificacoes', label: 'Notificações', Icon: Bell },
  { id: 'horario', label: 'Horário', Icon: Clock },
  { id: 'ia', label: 'IA & Automação', Icon: Sparkles },
  { id: 'aparencia', label: 'Aparência', Icon: Palette },
  { id: 'seguranca', label: 'Segurança', Icon: Shield },
];

export function Configuracoes() {
  const [activeTab, setActiveTab] = useState<TabId>('clinica');
  const [saveMsg, setSaveMsg] = useState(false);

  // Estados dos forms
  const [clinica, setClinica] = useState({
    nome: 'Dra. Andressa Barbarotti',
    cnpj: '12.345.678/0001-99',
    telefone: '(11) 98765-4321',
    email: 'contato@drandressa.com.br',
    endereco: 'Av. Paulista, 1000 — São Paulo/SP',
  });

  const [notif, setNotif] = useState({
    novosLeads: true,
    mensagensNaoLidas: true,
    relatoriosDiarios: true,
    slaCritico: false,
    followupsPendentes: true,
    pagamentosRecebidos: true,
  });

  const [horario, setHorario] = useState({
    segSex: { abertura: '08:00', fechamento: '18:00', ativo: true },
    sabado: { abertura: '08:00', fechamento: '13:00', ativo: true },
    domingo: { abertura: '08:00', fechamento: '12:00', ativo: false },
  });

  const [ia, setIa] = useState({
    ativa: true,
    respostaAutomatica: '24h',
    idioma: 'Português BR',
    modelo: 'GPT-4o + Claude',
    criatividade: 70,
  });

  const [tema, setTema] = useState<'escuro' | 'claro'>('escuro');
  const [corPrimaria, setCorPrimaria] = useState('#c9943a');

  const handleSave = () => {
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2400);
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
        @keyframes cfgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cfgToast { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .cfg-card { animation: cfgIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .cfg-input:focus { border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201, 148, 58, 0.18) !important; }
        .cfg-tab:hover { background: rgba(201, 148, 58, 0.08); }
        .cfg-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(201, 148, 58, 0.35); }
        .cfg-toggle { cursor: pointer; transition: all 0.25s ease; }
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
            <Settings size={22} color="#0d1f2d" strokeWidth={2.4} />
          </div>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.4px' }}>Configurações</h1>
            <p style={{ fontSize: '13px', color: '#7a96aa', margin: '2px 0 0 0' }}>Personalize sua clínica, IA e preferências</p>
          </div>
        </div>

        {saveMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(46, 204, 113, 0.15)',
              border: '1px solid rgba(46, 204, 113, 0.35)',
              color: '#2ecc71',
              fontSize: '13px',
              fontWeight: 700,
              animation: 'cfgToast 0.3s ease both',
            }}
          >
            <Check size={15} strokeWidth={2.6} />
            Configurações salvas!
          </div>
        )}
      </div>

      {/* LAYOUT: sidebar tabs + content */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'flex-start' }}>
        {/* SIDEBAR DE ABAS */}
        <div
          style={{
            background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
            border: '1px solid #1e3d54',
            borderRadius: '16px',
            padding: '8px',
            position: 'sticky',
            top: '20px',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.Icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className="cfg-tab"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: active
                    ? 'linear-gradient(90deg, rgba(201, 148, 58, 0.18) 0%, rgba(201, 148, 58, 0.05) 100%)'
                    : 'transparent',
                  color: active ? '#c9943a' : '#b0c4d4',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '2px',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: '3px',
                      borderRadius: '2px',
                      background: 'linear-gradient(180deg, #c9943a 0%, #a87a28 100%)',
                    }}
                  />
                )}
                <Icon size={15} strokeWidth={2.2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div
          className="cfg-card"
          style={{
            background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
            border: '1px solid #1e3d54',
            borderRadius: '16px',
            padding: '26px',
            minHeight: '400px',
          }}
          key={activeTab}
        >
          {activeTab === 'clinica' && (
            <Section title="Dados da Clínica" subtitle="Informações de cadastro da empresa" Icon={Building2}>
              <Grid2>
                <Field label="Nome da Clínica" Icon={Building2}>
                  <Input value={clinica.nome} onChange={(v) => setClinica({ ...clinica, nome: v })} />
                </Field>
                <Field label="CNPJ" Icon={FileText}>
                  <Input value={clinica.cnpj} onChange={(v) => setClinica({ ...clinica, cnpj: v })} />
                </Field>
                <Field label="Telefone" Icon={Phone}>
                  <Input value={clinica.telefone} onChange={(v) => setClinica({ ...clinica, telefone: v })} />
                </Field>
                <Field label="E-mail" Icon={Mail}>
                  <Input value={clinica.email} onChange={(v) => setClinica({ ...clinica, email: v })} />
                </Field>
              </Grid2>
              <Field label="Endereço" Icon={Globe}>
                <Input value={clinica.endereco} onChange={(v) => setClinica({ ...clinica, endereco: v })} />
              </Field>
            </Section>
          )}

          {activeTab === 'notificacoes' && (
            <Section title="Notificações" subtitle="Escolha o que deseja receber" Icon={Bell}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <ToggleRow
                  title="Novos leads"
                  desc="Seja notificado quando um novo lead chegar"
                  active={notif.novosLeads}
                  onToggle={() => setNotif({ ...notif, novosLeads: !notif.novosLeads })}
                />
                <ToggleRow
                  title="Mensagens não lidas"
                  desc="Alertas quando mensagens ficam sem resposta"
                  active={notif.mensagensNaoLidas}
                  onToggle={() => setNotif({ ...notif, mensagensNaoLidas: !notif.mensagensNaoLidas })}
                />
                <ToggleRow
                  title="Relatórios diários"
                  desc="Resumo de performance todo fim de dia"
                  active={notif.relatoriosDiarios}
                  onToggle={() => setNotif({ ...notif, relatoriosDiarios: !notif.relatoriosDiarios })}
                />
                <ToggleRow
                  title="SLA crítico"
                  desc="Conversas prestes a exceder o SLA"
                  active={notif.slaCritico}
                  onToggle={() => setNotif({ ...notif, slaCritico: !notif.slaCritico })}
                />
                <ToggleRow
                  title="Follow-ups pendentes"
                  desc="Lembretes de follow-ups do dia"
                  active={notif.followupsPendentes}
                  onToggle={() => setNotif({ ...notif, followupsPendentes: !notif.followupsPendentes })}
                />
                <ToggleRow
                  title="Pagamentos recebidos"
                  desc="Confirmação de pagamentos no sistema"
                  active={notif.pagamentosRecebidos}
                  onToggle={() => setNotif({ ...notif, pagamentosRecebidos: !notif.pagamentosRecebidos })}
                />
              </div>
            </Section>
          )}

          {activeTab === 'horario' && (
            <Section title="Horário de Atendimento" subtitle="Define expediente e automações" Icon={Clock}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <HorarioRow
                  dia="Segunda a Sexta"
                  data={horario.segSex}
                  onChange={(d) => setHorario({ ...horario, segSex: d })}
                />
                <HorarioRow
                  dia="Sábado"
                  data={horario.sabado}
                  onChange={(d) => setHorario({ ...horario, sabado: d })}
                />
                <HorarioRow
                  dia="Domingo"
                  data={horario.domingo}
                  onChange={(d) => setHorario({ ...horario, domingo: d })}
                />
              </div>
            </Section>
          )}

          {activeTab === 'ia' && (
            <Section title="IA & Automação" subtitle="Configure o comportamento das IAs" Icon={Sparkles}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <ToggleRow
                  title="IA Ativa"
                  desc="Ativar assistente inteligente nas conversas"
                  active={ia.ativa}
                  onToggle={() => setIa({ ...ia, ativa: !ia.ativa })}
                />

                <Grid2>
                  <Field label="Resposta Automática" Icon={Zap}>
                    <Select
                      value={ia.respostaAutomatica}
                      onChange={(v) => setIa({ ...ia, respostaAutomatica: v })}
                      options={['Imediata', '5 min', '30 min', '1h', '24h']}
                    />
                  </Field>
                  <Field label="Idioma Padrão" Icon={Globe}>
                    <Select
                      value={ia.idioma}
                      onChange={(v) => setIa({ ...ia, idioma: v })}
                      options={['Português BR', 'English', 'Español']}
                    />
                  </Field>
                </Grid2>

                <Field label="Modelo IA" Icon={Sparkles}>
                  <Select
                    value={ia.modelo}
                    onChange={(v) => setIa({ ...ia, modelo: v })}
                    options={['GPT-4o + Claude', 'GPT-4o', 'Claude Opus 4.6', 'Gemini Pro']}
                  />
                </Field>

                <Field label={`Criatividade (${ia.criatividade}%)`} Icon={Sparkles}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={ia.criatividade}
                    onChange={(e) => setIa({ ...ia, criatividade: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      accentColor: '#c9943a',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#7a96aa', marginTop: '4px' }}>
                    <span>Conservadora</span>
                    <span>Equilibrada</span>
                    <span>Criativa</span>
                  </div>
                </Field>
              </div>
            </Section>
          )}

          {activeTab === 'aparencia' && (
            <Section title="Aparência" subtitle="Personalize o visual do CRM" Icon={Palette}>
              <div style={{ display: 'grid', gap: '18px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Tema
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ThemeCard
                      label="Escuro"
                      active={tema === 'escuro'}
                      Icon={Moon}
                      preview="linear-gradient(135deg, #0d1f2d 0%, #132636 100%)"
                      onClick={() => setTema('escuro')}
                    />
                    <ThemeCard
                      label="Claro"
                      active={tema === 'claro'}
                      Icon={Sun}
                      preview="linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)"
                      onClick={() => setTema('claro')}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Cor Primária
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['#c9943a', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#e74c3c', '#1abc9c', '#34495e'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCorPrimaria(c)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: c,
                          border: corPrimaria === c ? '3px solid #e8edf2' : '2px solid #1e3d54',
                          cursor: 'pointer',
                          boxShadow: corPrimaria === c ? `0 6px 14px ${c}55` : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          )}

          {activeTab === 'seguranca' && (
            <Section title="Segurança" subtitle="Proteção da conta e dados" Icon={Shield}>
              <div style={{ display: 'grid', gap: '14px' }}>
                <InfoRow Icon={User} label="Usuário" value="admin@drandressa.com.br" />
                <InfoRow Icon={Lock} label="Senha" value="••••••••••••" actionLabel="Alterar" />
                <InfoRow Icon={Shield} label="Autenticação em 2 fatores" value="Desativada" actionLabel="Ativar" actionColor="#2ecc71" />
                <InfoRow Icon={Clock} label="Último acesso" value="Hoje às 09:24" />
                <InfoRow Icon={Globe} label="Sessões ativas" value="2 dispositivos" actionLabel="Gerenciar" />
              </div>
            </Section>
          )}

          {/* ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #1e3d54' }}>
            <button
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #1e3d54',
                background: 'transparent',
                color: '#b0c4d4',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="cfg-btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #c9943a 0%, #a87a28 100%)',
                color: '#0d1f2d',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(201, 148, 58, 0.28)',
                transition: 'all 0.25s ease',
              }}
            >
              <Save size={14} strokeWidth={2.6} /> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========= Subcomponentes =========

function Section({
  title,
  subtitle,
  Icon,
  children,
}: {
  title: string;
  subtitle: string;
  Icon: typeof Settings;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(201, 148, 58, 0.14)',
            border: '1px solid rgba(201, 148, 58, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} color="#c9943a" strokeWidth={2.3} />
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#e8edf2' }}>{title}</h2>
          <p style={{ fontSize: '12px', color: '#7a96aa', margin: '2px 0 0 0' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>{children}</div>;
}

function Field({ label, Icon, children }: { label: string; Icon?: typeof Settings; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#7a96aa', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {Icon && <Icon size={11} />}
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      className="cfg-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
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
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="cfg-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#0d1f2d',
        border: '1px solid #1e3d54',
        borderRadius: '10px',
        color: '#e8edf2',
        fontSize: '13px',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function ToggleRow({ title, desc, active, onToggle }: { title: string; desc: string; active: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="cfg-toggle"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '10px',
        background: 'rgba(13, 31, 45, 0.5)',
        border: '1px solid #1e3d54',
      }}
    >
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#7a96aa' }}>{desc}</div>
      </div>
      <div
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '14px',
          background: active ? 'linear-gradient(90deg, #c9943a 0%, #a87a28 100%)' : '#1e3d54',
          position: 'relative',
          transition: 'background 0.25s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: active ? '21px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
            transition: 'left 0.25s ease',
          }}
        />
      </div>
    </div>
  );
}

function HorarioRow({
  dia,
  data,
  onChange,
}: {
  dia: string;
  data: { abertura: string; fechamento: string; ativo: boolean };
  onChange: (d: { abertura: string; fechamento: string; ativo: boolean }) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(13, 31, 45, 0.5)',
        border: '1px solid #1e3d54',
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf2' }}>{dia}</div>
      <input
        type="time"
        className="cfg-input"
        value={data.abertura}
        disabled={!data.ativo}
        onChange={(e) => onChange({ ...data, abertura: e.target.value })}
        style={{
          padding: '7px 10px',
          background: '#0d1f2d',
          border: '1px solid #1e3d54',
          borderRadius: '8px',
          color: data.ativo ? '#e8edf2' : '#7a96aa',
          fontSize: '12px',
          outline: 'none',
        }}
      />
      <span style={{ color: '#7a96aa', fontSize: '12px' }}>até</span>
      <input
        type="time"
        className="cfg-input"
        value={data.fechamento}
        disabled={!data.ativo}
        onChange={(e) => onChange({ ...data, fechamento: e.target.value })}
        style={{
          padding: '7px 10px',
          background: '#0d1f2d',
          border: '1px solid #1e3d54',
          borderRadius: '8px',
          color: data.ativo ? '#e8edf2' : '#7a96aa',
          fontSize: '12px',
          outline: 'none',
        }}
      />
    </div>
  );
}

function ThemeCard({
  label,
  active,
  Icon,
  preview,
  onClick,
}: {
  label: string;
  active: boolean;
  Icon: typeof Settings;
  preview: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        maxWidth: '180px',
        padding: '14px',
        borderRadius: '12px',
        border: `2px solid ${active ? '#c9943a' : '#1e3d54'}`,
        background: active ? 'rgba(201, 148, 58, 0.08)' : 'rgba(13, 31, 45, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '60px',
          borderRadius: '8px',
          background: preview,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: active ? '#c9943a' : '#b0c4d4', fontSize: '12px', fontWeight: 700 }}>
        <Icon size={14} /> {label}
      </div>
    </button>
  );
}

function InfoRow({
  Icon,
  label,
  value,
  actionLabel,
  actionColor = '#c9943a',
}: {
  Icon: typeof Settings;
  label: string;
  value: string;
  actionLabel?: string;
  actionColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '10px',
        background: 'rgba(13, 31, 45, 0.5)',
        border: '1px solid #1e3d54',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'rgba(201, 148, 58, 0.12)',
            border: '1px solid rgba(201, 148, 58, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={14} color="#c9943a" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '11px', color: '#7a96aa', marginBottom: '2px', fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: '13px', color: '#e8edf2', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value}
          </div>
        </div>
      </div>
      {actionLabel && (
        <button
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: `1px solid ${actionColor}55`,
            background: `${actionColor}14`,
            color: actionColor,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
