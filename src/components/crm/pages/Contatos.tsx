/**
 * Página de Contatos - CRM ProClinic
 * Premium AAA · Gestão de Relacionamento · Base Unificada
 */

'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Phone,
  FileUp,
  Download,
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  UserPlus,
  Sparkles,
  X,
  AtSign,
  MessageCircle,
} from 'lucide-react';
import { useEquipeStore } from '@/store/equipeStore';
import { useOrigensStore } from '@/store/origensStore';
import { useContatosStore } from '@/store/contatosStore';
import { useAuthStore } from '@/store/authStore';
import { mockFilas, mockConexoes } from '@/lib/mockData';

// ============ HELPERS ============
function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const NOMES_MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const NOMES_MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function Contatos() {
  // ============ STORES GLOBAIS ============
  const membros = useEquipeStore((state) => state.membros);
  const origens = useOrigensStore((state) => state.origens);
  const contatosGlobais = useContatosStore((state) => state.contatos);
  const addContatoGlobal = useContatosStore((state) => state.addContato);
  const updateContatoGlobal = useContatosStore((state) => state.updateContato);
  const removeContatoGlobal = useContatosStore((state) => state.removeContato);
  const usuarioLogado = useAuthStore((state) => state.usuario);

  const [filterCanal, setFilterCanal] = useState('Todos os canais');
  const [filterPipeline, setFilterPipeline] = useState('Todos os pipelines');
  const [filterOrigem, setFilterOrigem] = useState<'Todas' | 'Trabalho Pago' | 'Orgânico' | 'Importado'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // ============ MODAIS ============
  const [novoContatoModalVisible, setNovoContatoModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    canal: 'WhatsApp',
    agente: 'Havila',
    origem: 'Tráfego Pago',
    observacoes: '',
  });

  const [importarExportarMenuVisible, setImportarExportarMenuVisible] = useState(false);
  const [exportarModalVisible, setExportarModalVisible] = useState(false);
  const [mesesSelecionados, setMesesSelecionados] = useState<number[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  const [abrirTicketModalVisible, setAbrirTicketModalVisible] = useState(false);
  const [editarContatoModalVisible, setEditarContatoModalVisible] = useState(false);
  const [excluirContatoModalVisible, setExcluirContatoModalVisible] = useState(false);
  const [contatoSelecionado, setContatoSelecionado] = useState<any>(null);
  const [filaSelecionada, setFilaSelecionada] = useState('');
  const [conexaoSelecionada, setConexaoSelecionada] = useState('');
  const [formEditacao, setFormEditacao] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    tipo: '',
    conexao: '',
    agenteResponsavel: '',
  });

  // ============ HELPERS ============
  const toggleMesSelecionado = (mesIndex: number) => {
    if (mesesSelecionados.includes(mesIndex)) {
      setMesesSelecionados(mesesSelecionados.filter(m => m !== mesIndex));
    } else {
      setMesesSelecionados([...mesesSelecionados, mesIndex]);
    }
  };

  const formatarUltimaInteracao = (dataHora: string) => {
    const [data, hora] = dataHora.split(' ');
    const [ano, mes, dia] = data.split('-');
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    if (data === hojeFormatado) return `Hoje, ${hora}`;
    return `${dia}/${mes}/${ano} ${hora}`;
  };

  // ============ DADOS INICIAIS ============
  const contatosInicial = [
    { id: 1, nome: 'Ida Santos', whatsapp: '(11) 99999-0001', email: 'ida@email.com', ultimaInteracao: '2026-04-18 10:30', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#e91e63' },
    { id: 2, nome: 'Daniele Mantovani', whatsapp: '(11) 99999-0002', email: 'daniele@email.com', ultimaInteracao: '2026-04-16 15:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#9c27b0' },
    { id: 3, nome: 'Maria Rosa', whatsapp: '(11) 99999-0003', email: 'maria@email.com', ultimaInteracao: '2026-04-15 09:20', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#673ab7' },
    { id: 4, nome: 'Laura Ferreira', whatsapp: '(11) 99999-0004', email: 'laura@email.com', ultimaInteracao: '2026-04-14 14:10', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#3f51b5' },
    { id: 5, nome: 'Patricia Lima', whatsapp: '(11) 99999-0005', email: 'patricia@email.com', ultimaInteracao: '2026-04-13 11:55', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#2196f3' },
    { id: 6, nome: 'Ana Beatriz', whatsapp: '(11) 99999-0006', email: 'ana@email.com', ultimaInteracao: '2026-04-12 16:30', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#00bcd4' },
    { id: 7, nome: 'Larissa Alcântara', whatsapp: '(11) 99999-0007', email: 'larissa@email.com', ultimaInteracao: '2026-04-11 13:15', status: 'Ativo', badge: 'Trabalho Pago', badgeColor: '#ef5350', avatarColor: '#009688' },
    { id: 8, nome: 'Carlota Mendes', whatsapp: '(11) 99999-0008', email: 'carlota@email.com', ultimaInteracao: '2026-04-10 10:45', status: 'Ativo', badge: 'Orgânico', badgeColor: '#66bb6a', avatarColor: '#4caf50' },
  ];

  const [contatosList, setContatosList] = useState(contatosInicial);

  // ============ NOVO CONTATO ============
  const abrirNovoContatoModal = () => {
    setFormData({
      nome: '', telefone: '', email: '',
      canal: 'WhatsApp', agente: 'Havila', origem: 'Tráfego Pago', observacoes: '',
    });
    setNovoContatoModalVisible(true);
  };
  const fecharNovoContatoModal = () => setNovoContatoModalVisible(false);

  const handleSalvarContato = () => {
    if (!formData.nome.trim()) return alert('Por favor, preencha o nome do contato');
    if (!formData.email.trim()) return alert('Por favor, preencha o email do contato');

    const novoId = Math.max(...contatosList.map(c => c.id), 0) + 1;
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
    const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

    const novoContato = {
      id: novoId,
      nome: formData.nome,
      whatsapp: formData.telefone || '(--) -----',
      email: formData.email,
      ultimaInteracao: hojeFormatado,
      status: 'Ativo',
      badge: formData.origem,
      badgeColor: formData.origem === 'Tráfego Pago' ? '#ef5350' : '#66bb6a',
      avatarColor: corAleatoria,
    };

    setContatosList([novoContato, ...contatosList]);
    addContatoGlobal(novoContato);
    fecharNovoContatoModal();
  };

  // ============ FILTRO ============
  const contatosFiltrados = useMemo(() => {
    return contatosList.filter((c) => {
      const matchSearch =
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.whatsapp.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchOrigem = filterOrigem === 'Todas' || c.badge === filterOrigem;
      return matchSearch && matchOrigem;
    });
  }, [contatosList, searchTerm, filterOrigem]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    const semanaInicio = new Date(); semanaInicio.setDate(semanaInicio.getDate() - 7);
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const countHoje = contatosList.filter(c => c.ultimaInteracao.split(' ')[0] === hojeFormatado).length;
    const countSemana = contatosList.filter(c => {
      const d = new Date(c.ultimaInteracao.split(' ')[0]);
      return d >= semanaInicio && d <= hoje;
    }).length;
    const countMes = contatosList.filter(c => {
      const [a, m] = c.ultimaInteracao.split(' ')[0].split('-');
      return parseInt(a) === anoAtual && parseInt(m) === mesAtual;
    }).length;
    const countPago = contatosList.filter(c => c.badge === 'Trabalho Pago').length;
    const countOrganico = contatosList.filter(c => c.badge === 'Orgânico').length;

    return {
      hoje: countHoje || 5,
      semana: countSemana || 8,
      mes: countMes || 8,
      total: contatosList.length,
      pago: countPago,
      organico: countOrganico,
    };
  }, [contatosList]);

  // ============ IMPORTAR / EXPORTAR ============
  const importarDaAgenda = async () => {
    try {
      const navigatorWithContacts = navigator as any;
      if (!navigatorWithContacts.contacts) {
        alert('A API de Contatos não é suportada neste navegador. Tente importar via arquivo.');
        return;
      }
      const props = ['name', 'tel', 'email'];
      const contacts = await navigatorWithContacts.contacts.select(props, { multiple: true });

      contacts.forEach((contact: any) => {
        const novoId = Math.max(...contatosList.map(c => c.id), 0) + 1;
        const hoje = new Date();
        const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
        const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];
        const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

        const novoContato = {
          id: novoId,
          nome: contact.name?.[0] || 'Sem Nome',
          whatsapp: contact.tel?.[0] || '(--) -----',
          email: contact.email?.[0] || '',
          ultimaInteracao: hojeFormatado,
          status: 'Ativo',
          badge: 'Importado',
          badgeColor: '#3498db',
          avatarColor: corAleatoria,
        };
        setContatosList((prev) => [novoContato, ...prev]);
      });
      setImportarExportarMenuVisible(false);
      alert(`${contacts.length} contato(s) importado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao importar contatos:', error);
    }
  };

  const importarArquivo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const content = event.target.result;
          const linhas = content.split('\n');
          let importados = 0;

          linhas.forEach((linha: string, index: number) => {
            if (index === 0 || !linha.trim()) return;
            const [nome, telefone, email] = linha.split(',').map((x: string) => x.trim());
            if (!nome || !email) return;

            const novoId = Math.max(...contatosList.map(c => c.id), 0) + 1;
            const hoje = new Date();
            const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
            const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];
            const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

            const novoContato = {
              id: novoId, nome,
              whatsapp: telefone || '(--) -----',
              email, ultimaInteracao: hojeFormatado, status: 'Ativo',
              badge: 'Importado', badgeColor: '#3498db', avatarColor: corAleatoria,
            };
            setContatosList((prev) => [novoContato, ...prev]);
            importados++;
          });

          setImportarExportarMenuVisible(false);
          alert(`${importados} contato(s) importado(s) com sucesso!`);
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique o formato.');
          console.error('Erro:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportarParaExcel = () => {
    if (mesesSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um mês para exportar.');
      return;
    }

    const contatosFiltradosExport = contatosList.filter((contato) => {
      const [data] = contato.ultimaInteracao.split(' ');
      const [ano, mes] = data.split('-');
      return mesesSelecionados.includes(parseInt(mes)) && parseInt(ano) === anoSelecionado;
    });

    if (contatosFiltradosExport.length === 0) {
      alert('Nenhum contato encontrado para o período selecionado.');
      return;
    }

    let csvContent = 'RELATÓRIO DE CONTATOS - PROCLINIC CRM\n\n';
    csvContent += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n`;
    const mesesNomes = mesesSelecionados.sort((a, b) => a - b).map(m => NOMES_MESES[m - 1]).join(', ');
    csvContent += `Período: ${mesesNomes} de ${anoSelecionado}\n\n`;
    csvContent += 'NOME,TELEFONE,EMAIL,ORIGEM,STATUS\n';
    contatosFiltradosExport.forEach((contato) => {
      csvContent += `"${contato.nome}","${contato.whatsapp}","${contato.email}","${contato.badge}","${contato.status}"\n`;
    });
    csvContent += `\n\nTOTAL DE CONTATOS NO PERÍODO: ${contatosFiltradosExport.length}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const mesesCurtos = mesesSelecionados.sort((a, b) => a - b).map(m => NOMES_MESES[m - 1].substring(0, 3).toLowerCase()).join('_');
    link.setAttribute('download', `contatos_${mesesCurtos}_${anoSelecionado}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportarModalVisible(false);
    setImportarExportarMenuVisible(false);
    alert('Contatos exportados com sucesso!');
  };

  // ============ ACTIONS ROW ============
  const abrirTicket = (contato: any) => {
    setContatoSelecionado(contato);
    setFilaSelecionada('');
    setConexaoSelecionada('');
    setAbrirTicketModalVisible(true);
  };

  const abrirEdicao = (contato: any) => {
    setContatoSelecionado(contato);
    setFormEditacao({
      nome: contato.nome,
      whatsapp: contato.whatsapp,
      email: contato.email,
      tipo: contato.badge || '',
      conexao: '',
      agenteResponsavel: '',
    });
    setEditarContatoModalVisible(true);
  };

  const abrirExclusao = (contato: any) => {
    setContatoSelecionado(contato);
    setExcluirContatoModalVisible(true);
  };

  const salvarEdicao = () => {
    if (!formEditacao.nome.trim()) return alert('O nome é obrigatório');
    if (!contatoSelecionado) return;
    const atualizado = {
      ...contatoSelecionado,
      nome: formEditacao.nome,
      whatsapp: formEditacao.whatsapp,
      email: formEditacao.email,
      badge: formEditacao.tipo || contatoSelecionado.badge,
    };
    updateContatoGlobal(contatoSelecionado.id, atualizado);
    setContatosList(contatosList.map(c => c.id === contatoSelecionado.id ? atualizado : c));
    setEditarContatoModalVisible(false);
    setContatoSelecionado(null);
  };

  const confirmarExclusao = () => {
    if (!contatoSelecionado) return;
    removeContatoGlobal(contatoSelecionado.id);
    setContatosList(contatosList.filter(c => c.id !== contatoSelecionado.id));
    setExcluirContatoModalVisible(false);
    setContatoSelecionado(null);
  };

  // ============ UI ============
  const statsCards = [
    { label: 'Hoje', value: stats.hoje, sub: 'interações recentes', color: '#c9943a', icon: <Calendar size={14} /> },
    { label: 'Esta Semana', value: stats.semana, sub: 'últimos 7 dias', color: '#3498db', icon: <BarChart3 size={14} /> },
    { label: 'Este Mês', value: stats.mes, sub: 'no período atual', color: '#9b59b6', icon: <TrendingUp size={14} /> },
    { label: 'Total de Contatos', value: stats.total, sub: 'na base', color: '#2ecc71', icon: <Users size={14} /> },
  ];

  const origemFilters: Array<'Todas' | 'Trabalho Pago' | 'Orgânico' | 'Importado'> = ['Todas', 'Trabalho Pago', 'Orgânico', 'Importado'];
  const origemColor = (o: string) => o === 'Trabalho Pago' ? '#ef5350' : o === 'Orgânico' ? '#66bb6a' : '#3498db';

  return (
    <div style={{
      padding: '24px 28px 40px',
      background: 'radial-gradient(1200px 600px at 10% -10%, rgba(201,148,58,0.08), transparent 60%), #0d1f2d',
      minHeight: '100vh',
      color: '#e8edf2',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes ctFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ctPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.45); } 50% { box-shadow: 0 0 0 8px rgba(46,204,113,0); } }
        @keyframes ctModalIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes ctShimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .ct-fadeIn { animation: ctFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .ct-pulse::before {
          content: ''; position: absolute; left: 6px; top: 50%; width: 6px; height: 6px; border-radius: 50%;
          background: #2ecc71; transform: translateY(-50%); animation: ctPulse 2s infinite;
        }
        .ct-modal { animation: ctModalIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .ct-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
        .ct-scroll::-webkit-scrollbar-track { background: rgba(13,31,45,0.4); border-radius: 6px; }
        .ct-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(201,148,58,0.35), rgba(201,148,58,0.6));
          border-radius: 6px; border: 2px solid rgba(13,31,45,0.3);
        }
        .ct-scroll::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, rgba(201,148,58,0.7), rgba(201,148,58,0.9)); }
        .ct-card { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); position: relative; overflow: hidden; }
        .ct-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(500px circle at var(--mx,50%) var(--my,0%), rgba(201,148,58,0.10), transparent 40%);
          opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
        }
        .ct-card:hover::before { opacity: 1; }
        .ct-card:hover { transform: translateY(-2px); border-color: rgba(201,148,58,0.45) !important; box-shadow: 0 14px 36px rgba(0,0,0,0.42); }
        .ct-row { transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1); position: relative; }
        .ct-row:hover { transform: translateX(3px); border-color: rgba(201,148,58,0.4) !important; background: linear-gradient(180deg, #14283a, #112132) !important; box-shadow: 0 10px 24px rgba(0,0,0,0.32); }
        .ct-iconBtn { transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
        .ct-iconBtn:hover { transform: translateY(-1px); }
        .ct-pill { transition: all 0.25s ease; }
        .ct-input:focus { outline: none; border-color: #c9943a !important; box-shadow: 0 0 0 3px rgba(201,148,58,0.18); }
        .ct-goldBtn {
          background: linear-gradient(135deg, #c9943a, #a87a28);
          color: #0d1f2d; border: none; font-weight: 800; cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 6px 18px rgba(201,148,58,0.25);
        }
        .ct-goldBtn:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(201,148,58,0.42); }
        .ct-ghostBtn { background: transparent; border: 1px solid #1e3d54; color: #b0c4d4; font-weight: 700; cursor: pointer; transition: all 0.25s ease; }
        .ct-ghostBtn:hover { border-color: #c9943a; color: #c9943a; background: rgba(201,148,58,0.08); }
      `}</style>

      {/* HERO */}
      <div className="ct-fadeIn" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 20, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px',
            borderRadius: 999, border: '1px solid rgba(201,148,58,0.35)',
            background: 'rgba(201,148,58,0.08)', color: '#d9a848',
            fontSize: 10, letterSpacing: 1.4, fontWeight: 700, textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <Sparkles size={12} /> Gestão de Relacionamento · Base Unificada
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 900, margin: 0, letterSpacing: -0.8,
            background: 'linear-gradient(135deg, #e8edf2 0%, #c9943a 60%, #a87a28 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Contatos
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#7a96aa' }}>
            Centralize, segmente e ative sua base inteira · <strong style={{ color: '#e8edf2' }}>{stats.total}</strong> contatos ativos
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setImportarExportarMenuVisible(!importarExportarMenuVisible)}
              className="ct-ghostBtn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10, fontSize: 12,
                background: importarExportarMenuVisible ? 'rgba(201,148,58,0.08)' : 'transparent',
                borderColor: importarExportarMenuVisible ? '#c9943a' : '#1e3d54',
                color: importarExportarMenuVisible ? '#c9943a' : '#b0c4d4',
              }}
            >
              <Download size={14} /> Importar / Exportar
            </button>

            {importarExportarMenuVisible && (
              <div className="ct-modal" style={{
                position: 'absolute', top: 48, right: 0, width: 300, zIndex: 1000,
                background: 'linear-gradient(180deg, #132636, #0f2130)',
                border: '1px solid #2a4a64', borderRadius: 12,
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden',
                backdropFilter: 'blur(14px)',
              }}>
                {[
                  { icon: <Phone size={16} />, label: 'Importar da Agenda', sub: 'Contatos do dispositivo', onClick: importarDaAgenda },
                  { icon: <FileUp size={16} />, label: 'Importar Arquivo', sub: 'CSV ou JSON', onClick: importarArquivo },
                  { icon: <Download size={16} />, label: 'Exportar Excel', sub: 'Por período', onClick: () => { setExportarModalVisible(true); setImportarExportarMenuVisible(false); } },
                ].map((opt, i) => (
                  <button key={i} onClick={opt.onClick} style={{
                    width: '100%', padding: '14px 16px', border: 'none',
                    background: 'transparent', color: '#e8edf2', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                    borderBottom: i < 2 ? '1px solid #1e3d54' : 'none',
                    transition: 'all 0.25s ease',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,148,58,0.10)'; e.currentTarget.style.color = '#c9943a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e8edf2'; }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(201,148,58,0.12)', border: '1px solid rgba(201,148,58,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9943a',
                    }}>{opt.icon}</span>
                    <span style={{ flex: 1 }}>
                      <div>{opt.label}</div>
                      <div style={{ fontSize: 10, color: '#7a96aa', fontWeight: 500, marginTop: 2 }}>{opt.sub}</div>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={abrirNovoContatoModal} className="ct-goldBtn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10, fontSize: 12,
          }}>
            <UserPlus size={14} strokeWidth={2.6} /> Adicionar Contato
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="ct-fadeIn" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14, marginBottom: 20,
      }}>
        {statsCards.map((s) => (
          <div key={s.label} className="ct-card"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              (e.currentTarget as HTMLElement).style.setProperty('--mx', `${e.clientX - r.left}px`);
              (e.currentTarget as HTMLElement).style.setProperty('--my', `${e.clientY - r.top}px`);
            }}
            style={{
              padding: '16px 18px', borderRadius: 14,
              background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
              border: '1px solid #1e3d54',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, color: s.color,
                background: `${s.color}1a`, border: `1px solid ${s.color}40`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.icon}</span>
              {s.label}
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: -1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 6, fontWeight: 500 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="ct-fadeIn" style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        padding: '10px 12px', borderRadius: 12,
        background: 'rgba(19,38,54,0.85)', backdropFilter: 'blur(14px)',
        border: '1px solid #1e3d54', marginBottom: 16, position: 'sticky', top: 8, zIndex: 10,
      }}>
        <div style={{
          flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: '#0f2130', border: '1px solid #1e3d54',
          borderRadius: 10,
        }}>
          <Search size={14} color="#7a96aa" />
          <input
            className="ct-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, WhatsApp ou e-mail..."
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#e8edf2', fontSize: 13, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {origemFilters.map(o => {
            const ativo = filterOrigem === o;
            const cor = o === 'Todas' ? '#c9943a' : origemColor(o);
            return (
              <button key={o}
                onClick={() => setFilterOrigem(o)}
                className="ct-pill"
                style={{
                  padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                  background: ativo ? `${cor}22` : 'transparent',
                  border: `1px solid ${ativo ? cor : '#1e3d54'}`,
                  color: ativo ? cor : '#7a96aa',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cor }} />
                {o}
              </button>
            );
          })}
        </div>

        <select
          value={filterCanal}
          onChange={(e) => setFilterCanal(e.target.value)}
          className="ct-input"
          style={{
            padding: '8px 12px', borderRadius: 10, fontSize: 12,
            background: '#0f2130', border: '1px solid #1e3d54', color: '#e8edf2', cursor: 'pointer',
          }}>
          <option>Todos os canais</option>
          <option>WhatsApp</option>
          <option>Instagram</option>
          <option>Email</option>
        </select>

        <select
          value={filterPipeline}
          onChange={(e) => setFilterPipeline(e.target.value)}
          className="ct-input"
          style={{
            padding: '8px 12px', borderRadius: 10, fontSize: 12,
            background: '#0f2130', border: '1px solid #1e3d54', color: '#e8edf2', cursor: 'pointer',
          }}>
          <option>Todos os pipelines</option>
          <option>Comercial</option>
          <option>Follow-up</option>
          <option>Suporte</option>
        </select>
      </div>

      {/* LIST */}
      <div className="ct-scroll" style={{ maxHeight: 'calc(100vh - 360px)', overflowY: 'auto', paddingRight: 6 }}>
        {contatosFiltrados.length === 0 ? (
          <div className="ct-fadeIn" style={{
            padding: '60px 20px', textAlign: 'center',
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px dashed #1e3d54', borderRadius: 14,
          }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>👤</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Nenhum contato encontrado</div>
            <div style={{ fontSize: 12, color: '#7a96aa' }}>Tente ajustar os filtros ou a busca, ou adicione um novo contato.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contatosFiltrados.map((c) => (
              <div key={c.id} className="ct-row ct-fadeIn" style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(240px, 1.4fr) minmax(160px, 1fr) minmax(200px, 1.2fr) minmax(140px, 0.9fr) minmax(110px, 0.6fr) auto',
                alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: 'linear-gradient(180deg, #132636 0%, #0f2130 100%)',
                border: '1px solid #1e3d54', borderRadius: 12,
              }}>
                {/* NOME + AVATAR */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c.avatarColor}, ${c.avatarColor}bb)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.3,
                    boxShadow: `0 6px 16px ${c.avatarColor}55`,
                    border: '2px solid rgba(255,255,255,0.08)', flexShrink: 0,
                  }}>
                    {initials(c.nome)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e8edf2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.nome}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                        color: c.badgeColor, background: `${c.badgeColor}1a`,
                        border: `1px solid ${c.badgeColor}40`,
                      }}>{c.badge}</span>
                    </div>
                  </div>
                </div>

                {/* WHATSAPP */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b0c4d4', fontSize: 12, minWidth: 0 }}>
                  <MessageCircle size={13} color="#25d366" style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.whatsapp}</span>
                </div>

                {/* EMAIL */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b0c4d4', fontSize: 12, minWidth: 0 }}>
                  <AtSign size={13} color="#3498db" style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</span>
                </div>

                {/* ÚLTIMA INTERAÇÃO */}
                <div style={{ fontSize: 11, color: '#7a96aa' }}>
                  <div style={{ fontWeight: 700, color: '#e8edf2' }}>{formatarUltimaInteracao(c.ultimaInteracao)}</div>
                  <div style={{ marginTop: 2 }}>Última interação</div>
                </div>

                {/* STATUS */}
                <div style={{ position: 'relative' }}>
                  <span className="ct-pulse" style={{
                    position: 'relative', display: 'inline-flex', alignItems: 'center',
                    padding: '5px 12px 5px 20px',
                    borderRadius: 999, fontSize: 11, fontWeight: 700,
                    color: '#2ecc71',
                    background: 'rgba(46,204,113,0.12)',
                    border: '1px solid rgba(46,204,113,0.35)',
                  }}>
                    {c.status}
                  </span>
                </div>

                {/* AÇÕES */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => abrirTicket(c)} className="ct-iconBtn" title="Abrir ticket" style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(52,152,219,0.10)', border: '1px solid rgba(52,152,219,0.35)',
                    color: '#3498db', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Eye size={14} />
                  </button>
                  <button onClick={() => abrirEdicao(c)} className="ct-iconBtn" title="Editar" style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(201,148,58,0.10)', border: '1px solid rgba(201,148,58,0.35)',
                    color: '#c9943a', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => abrirExclusao(c)} className="ct-iconBtn" title="Excluir" style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(231,76,60,0.10)', border: '1px solid rgba(231,76,60,0.35)',
                    color: '#e74c3c', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====================== MODAL: NOVO CONTATO ====================== */}
      {novoContatoModalVisible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,13,20,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={fecharNovoContatoModal}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{
            width: 'min(560px, 100%)', borderRadius: 16,
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px solid #2a4a64', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #1e3d54',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(201,148,58,0.10), transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #c9943a, #a87a28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0d1f2d', boxShadow: '0 8px 18px rgba(201,148,58,0.35)',
                }}>
                  <UserPlus size={18} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2' }}>Novo Contato</div>
                  <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>Cadastre na base unificada</div>
                </div>
              </div>
              <button onClick={fecharNovoContatoModal} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: '1px solid #1e3d54', color: '#7a96aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={14} /></button>
            </div>

            <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Nome *" gridArea="1 / 1 / 2 / 3">
                <input className="ct-input" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Maria Silva" style={inputStyle} />
              </Field>
              <Field label="Telefone">
                <input className="ct-input" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-0000" style={inputStyle} />
              </Field>
              <Field label="Canal">
                <select className="ct-input" value={formData.canal} onChange={(e) => setFormData({ ...formData, canal: e.target.value })} style={inputStyle}>
                  <option>WhatsApp</option><option>Instagram</option><option>Email</option>
                </select>
              </Field>
              <Field label="Email *" gridArea="3 / 1 / 4 / 3">
                <input className="ct-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nome@email.com" style={inputStyle} />
              </Field>
              <Field label="Agente">
                <select className="ct-input" value={formData.agente} onChange={(e) => setFormData({ ...formData, agente: e.target.value })} style={inputStyle}>
                  {membros.map((m) => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                </select>
              </Field>
              <Field label="Origem">
                <select className="ct-input" value={formData.origem} onChange={(e) => setFormData({ ...formData, origem: e.target.value })} style={inputStyle}>
                  {origens.map((o, i) => <option key={i}>{o}</option>)}
                </select>
              </Field>
              <Field label="Observações" gridArea="5 / 1 / 6 / 3">
                <textarea className="ct-input" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Informações adicionais..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </Field>
            </div>

            <div style={{
              padding: '14px 22px', borderTop: '1px solid #1e3d54',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              background: 'rgba(13,31,45,0.4)',
            }}>
              <button onClick={fecharNovoContatoModal} className="ct-ghostBtn" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 12 }}>Cancelar</button>
              <button onClick={handleSalvarContato} className="ct-goldBtn" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} strokeWidth={2.6} /> Salvar Contato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL: EXPORTAR EXCEL ====================== */}
      {exportarModalVisible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,13,20,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={() => setExportarModalVisible(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{
            width: 'min(560px, 100%)', borderRadius: 16,
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px solid #2a4a64', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #1e3d54',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(46,204,113,0.10), transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #2ecc71, #16a085)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0d1f2d', boxShadow: '0 8px 18px rgba(46,204,113,0.35)',
                }}>
                  <Download size={18} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2' }}>Exportar Contatos</div>
                  <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>Selecione o período desejado</div>
                </div>
              </div>
              <button onClick={() => setExportarModalVisible(false)} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: '1px solid #1e3d54', color: '#7a96aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={14} /></button>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Meses</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
                {NOMES_MESES_CURTOS.map((m, i) => {
                  const idx = i + 1;
                  const ativo = mesesSelecionados.includes(idx);
                  return (
                    <button key={idx} onClick={() => toggleMesSelecionado(idx)} style={{
                      padding: '10px 6px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      background: ativo ? 'linear-gradient(135deg, #c9943a, #a87a28)' : 'transparent',
                      color: ativo ? '#0d1f2d' : '#b0c4d4',
                      border: `1px solid ${ativo ? '#c9943a' : '#1e3d54'}`,
                      boxShadow: ativo ? '0 6px 14px rgba(201,148,58,0.35)' : 'none',
                    }}>{m}</button>
                  );
                })}
              </div>

              <div style={{ fontSize: 11, color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Ano</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
                {[2023, 2024, 2025, 2026, 2027].map(y => {
                  const ativo = anoSelecionado === y;
                  return (
                    <button key={y} onClick={() => setAnoSelecionado(y)} style={{
                      padding: '10px 6px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      background: ativo ? 'linear-gradient(135deg, #3498db, #2980b9)' : 'transparent',
                      color: ativo ? '#0d1f2d' : '#b0c4d4',
                      border: `1px solid ${ativo ? '#3498db' : '#1e3d54'}`,
                      boxShadow: ativo ? '0 6px 14px rgba(52,152,219,0.35)' : 'none',
                    }}>{y}</button>
                  );
                })}
              </div>

              <div style={{
                padding: 12, borderRadius: 10,
                background: 'rgba(13,31,45,0.4)', border: '1px solid #1e3d54',
                fontSize: 12, color: '#7a96aa',
              }}>
                <strong style={{ color: '#e8edf2' }}>Resumo:</strong>{' '}
                {mesesSelecionados.length === 0
                  ? 'Nenhum mês selecionado'
                  : `${mesesSelecionados.length} ${mesesSelecionados.length === 1 ? 'mês' : 'meses'} de ${anoSelecionado}`}
              </div>
            </div>

            <div style={{
              padding: '14px 22px', borderTop: '1px solid #1e3d54',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              background: 'rgba(13,31,45,0.4)',
            }}>
              <button onClick={() => setExportarModalVisible(false)} className="ct-ghostBtn" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 12 }}>Cancelar</button>
              <button onClick={exportarParaExcel} className="ct-goldBtn" style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 12,
                background: 'linear-gradient(135deg, #2ecc71, #16a085)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: '0 6px 18px rgba(46,204,113,0.35)',
              }}>
                <Download size={14} strokeWidth={2.6} /> Exportar CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL: ABRIR TICKET ====================== */}
      {abrirTicketModalVisible && contatoSelecionado && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,13,20,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={() => setAbrirTicketModalVisible(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{
            width: 'min(520px, 100%)', borderRadius: 16,
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px solid #2a4a64', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #1e3d54',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(52,152,219,0.10), transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0d1f2d', boxShadow: '0 8px 18px rgba(52,152,219,0.35)',
                }}>
                  <Eye size={18} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2' }}>Abrir Ticket</div>
                  <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>{contatoSelecionado.nome}</div>
                </div>
              </div>
              <button onClick={() => setAbrirTicketModalVisible(false)} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: '1px solid #1e3d54', color: '#7a96aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={14} /></button>
            </div>

            <div style={{ padding: 22 }}>
              <Field label="Fila">
                <select className="ct-input" value={filaSelecionada} onChange={(e) => setFilaSelecionada(e.target.value)} style={inputStyle}>
                  <option value="">Selecione uma fila</option>
                  {mockFilas.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </Field>
              <div style={{ height: 10 }} />
              <Field label="Conexão Ativa">
                <select className="ct-input" value={conexaoSelecionada} onChange={(e) => setConexaoSelecionada(e.target.value)} style={inputStyle}>
                  <option value="">Selecione uma conexão</option>
                  {mockConexoes.filter((c: any) => c.status === 'conectado').map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div style={{
              padding: '14px 22px', borderTop: '1px solid #1e3d54',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              background: 'rgba(13,31,45,0.4)',
            }}>
              <button onClick={() => setAbrirTicketModalVisible(false)} className="ct-ghostBtn" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 12 }}>Cancelar</button>
              <button
                onClick={() => {
                  if (!filaSelecionada) return alert('Selecione uma fila');
                  if (!conexaoSelecionada) return alert('Selecione uma conexão ativa');
                  alert(`Atendimento iniciado para ${contatoSelecionado.nome}`);
                  setAbrirTicketModalVisible(false);
                }}
                className="ct-goldBtn"
                style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 12,
                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 6px 18px rgba(52,152,219,0.35)',
                }}>
                <Eye size={14} strokeWidth={2.6} /> Iniciar Atendimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL: EDITAR CONTATO ====================== */}
      {editarContatoModalVisible && contatoSelecionado && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,13,20,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={() => setEditarContatoModalVisible(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{
            width: 'min(560px, 100%)', borderRadius: 16,
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px solid #2a4a64', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #1e3d54',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(90deg, rgba(201,148,58,0.10), transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #c9943a, #a87a28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0d1f2d', boxShadow: '0 8px 18px rgba(201,148,58,0.35)',
                }}>
                  <Pencil size={18} strokeWidth={2.6} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2' }}>Editar Contato</div>
                  <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>{contatoSelecionado.nome}</div>
                </div>
              </div>
              <button onClick={() => setEditarContatoModalVisible(false)} style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'transparent', border: '1px solid #1e3d54', color: '#7a96aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={14} /></button>
            </div>

            <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Nome *" gridArea="1 / 1 / 2 / 3">
                <input className="ct-input" value={formEditacao.nome} onChange={(e) => setFormEditacao({ ...formEditacao, nome: e.target.value })}
                  placeholder="Nome completo" style={inputStyle} />
              </Field>
              <Field label="WhatsApp">
                <input className="ct-input" value={formEditacao.whatsapp} onChange={(e) => setFormEditacao({ ...formEditacao, whatsapp: e.target.value })}
                  placeholder="(11) 99999-0000" style={inputStyle} />
              </Field>
              <Field label="Email">
                <input className="ct-input" value={formEditacao.email} onChange={(e) => setFormEditacao({ ...formEditacao, email: e.target.value })}
                  placeholder="email@exemplo.com" style={inputStyle} />
              </Field>
              <Field label="Tipo / Origem">
                <select className="ct-input" value={formEditacao.tipo} onChange={(e) => setFormEditacao({ ...formEditacao, tipo: e.target.value })} style={inputStyle}>
                  <option value="">—</option>
                  <option>Trabalho Pago</option>
                  <option>Orgânico</option>
                  <option>Importado</option>
                </select>
              </Field>
              <Field label="Conexão">
                <select className="ct-input" value={formEditacao.conexao} onChange={(e) => setFormEditacao({ ...formEditacao, conexao: e.target.value })} style={inputStyle}>
                  <option value="">Selecione</option>
                  {mockConexoes.map((c: any) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </Field>
              <Field label="Agente Responsável" gridArea="4 / 1 / 5 / 3">
                <select className="ct-input" value={formEditacao.agenteResponsavel} onChange={(e) => setFormEditacao({ ...formEditacao, agenteResponsavel: e.target.value })} style={inputStyle}>
                  <option value="">Selecione</option>
                  {membros.map((m) => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                </select>
              </Field>
            </div>

            <div style={{
              padding: '14px 22px', borderTop: '1px solid #1e3d54',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              background: 'rgba(13,31,45,0.4)',
            }}>
              <button onClick={() => setEditarContatoModalVisible(false)} className="ct-ghostBtn" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 12 }}>Cancelar</button>
              <button onClick={salvarEdicao} className="ct-goldBtn" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Pencil size={14} strokeWidth={2.6} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== MODAL: EXCLUIR CONTATO ====================== */}
      {excluirContatoModalVisible && contatoSelecionado && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,13,20,0.78)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={() => setExcluirContatoModalVisible(false)}>
          <div className="ct-modal" onClick={(e) => e.stopPropagation()} style={{
            width: 'min(460px, 100%)', borderRadius: 16,
            background: 'linear-gradient(180deg, #132636, #0f2130)',
            border: '1px solid rgba(231,76,60,0.35)', boxShadow: '0 24px 60px rgba(231,76,60,0.18)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 22px', borderBottom: '1px solid #1e3d54',
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(90deg, rgba(231,76,60,0.12), transparent)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', boxShadow: '0 8px 18px rgba(231,76,60,0.38)',
              }}>
                <Trash2 size={18} strokeWidth={2.6} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#e8edf2' }}>Excluir Contato</div>
                <div style={{ fontSize: 11, color: '#7a96aa', marginTop: 2 }}>Esta ação não pode ser desfeita</div>
              </div>
            </div>

            <div style={{ padding: 22 }}>
              <div style={{ fontSize: 13, color: '#b0c4d4', lineHeight: 1.6 }}>
                Tem certeza que deseja excluir o contato{' '}
                <strong style={{ color: '#e8edf2' }}>{contatoSelecionado.nome}</strong>?
                Todos os dados relacionados serão removidos da base.
              </div>
            </div>

            <div style={{
              padding: '14px 22px', borderTop: '1px solid #1e3d54',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
              background: 'rgba(13,31,45,0.4)',
            }}>
              <button onClick={() => setExcluirContatoModalVisible(false)} className="ct-ghostBtn" style={{ padding: '10px 18px', borderRadius: 10, fontSize: 12 }}>Cancelar</button>
              <button onClick={confirmarExclusao} style={{
                padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(231,76,60,0.38)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Trash2 size={14} strokeWidth={2.6} /> Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SUB-COMPONENTES ============
function Field({ label, children, gridArea }: { label: string; children: React.ReactNode; gridArea?: string }) {
  return (
    <div style={{ gridArea, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, color: '#7a96aa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  background: '#0f2130',
  border: '1px solid #1e3d54',
  color: '#e8edf2',
  fontSize: 13,
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  transition: 'all 0.25s ease',
};
