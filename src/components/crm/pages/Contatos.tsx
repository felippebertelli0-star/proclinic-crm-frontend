/**
 * Página de Contatos - CRM ProClinic
 * 100% Fiel ao protótipo - Tabela de contatos com filtros
 */

'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, Users, BarChart3, Phone, FileUp, Download } from 'lucide-react';
import { useEquipeStore } from '@/store/equipeStore';
import { useOrigensStore } from '@/store/origensStore';
import { useContatosStore } from '@/store/contatosStore';

export function Contatos() {
  // ============ STORES GLOBAIS ============
  const membros = useEquipeStore((state) => state.membros);
  const origens = useOrigensStore((state) => state.origens);
  const contatosGlobais = useContatosStore((state) => state.contatos);
  const addContatoGlobal = useContatosStore((state) => state.addContato);

  const [filterCanal, setFilterCanal] = useState('Todos os canais');
  const [filterPipeline, setFilterPipeline] = useState('Todos os pipelines');
  const [searchTerm, setSearchTerm] = useState('');

  // ============ STATES PARA NOVO CONTATO MODAL ============
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

  // ============ STATES PARA MENU IMPORTAR/EXPORTAR ============
  const [importarExportarMenuVisible, setImportarExportarMenuVisible] = useState(false);
  const [exportarModalVisible, setExportarModalVisible] = useState(false);
  const [mesesSelecionados, setMesesSelecionados] = useState<number[]>([]);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

  // ============ FUNÇÃO PARA TOGGLE DE MESES ============
  const toggleMesSelecionado = (mesIndex: number) => {
    if (mesesSelecionados.includes(mesIndex)) {
      // Se já está selecionado, remove
      setMesesSelecionados(mesesSelecionados.filter(m => m !== mesIndex));
    } else {
      // Se não está selecionado, adiciona
      setMesesSelecionados([...mesesSelecionados, mesIndex]);
    }
  };

  // Mock data de resumo
  const resumo = [
    { label: 'Hoje', value: 5, color: '#c9943a', isTotal: false },
    { label: 'Esta Semana', value: 8, color: '#c9943a', isTotal: false },
    { label: 'Este Mês', value: 8, color: '#c9943a', isTotal: false },
    { label: 'Total', value: 8, color: '#c9943a', isTotal: true },
  ];

  // ============ FORMATADOR DE DATA E HORA ============
  const formatarUltimaInteracao = (dataHora: string) => {
    const [data, hora] = dataHora.split(' ');
    const [ano, mes, dia] = data.split('-');

    // Obter data de hoje
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    if (data === hojeFormatado) {
      return `Hoje, ${hora}`;
    } else {
      return `${dia}/${mes}/${ano} ${hora}`;
    }
  };

  // Mock data inicial de contatos com badges e cores de avatar
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

  // ============ FUNÇÕES PARA NOVO CONTATO ============
  const abrirNovoContatoModal = () => {
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      canal: 'WhatsApp',
      agente: 'Havila',
      origem: 'Tráfego Pago',
      observacoes: '',
    });
    setNovoContatoModalVisible(true);
  };

  const fecharNovoContatoModal = () => {
    setNovoContatoModalVisible(false);
  };

  const handleSalvarContato = () => {
    // Validar campos obrigatórios
    if (!formData.nome.trim()) {
      alert('Por favor, preencha o nome do contato');
      return;
    }
    if (!formData.email.trim()) {
      alert('Por favor, preencha o email do contato');
      return;
    }

    // Gerar ID único
    const novoId = Math.max(...contatosList.map(c => c.id), 0) + 1;
    const hoje = new Date();
    const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;

    // Cores aleatórias para o avatar
    const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

    // Criar novo contato
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

    // Adicionar à lista local e ao store global
    setContatosList([novoContato, ...contatosList]);
    addContatoGlobal(novoContato);
    fecharNovoContatoModal();
  };

  // Filtrar contatos
  const contatosFiltrados = contatosList.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.whatsapp.includes(searchTerm) ||
                       c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  // ============ FUNÇÕES IMPORTAR/EXPORTAR ============

  // Importar da Agenda do Telefone
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

  // Importar Arquivo
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
            if (index === 0 || !linha.trim()) return; // Skip header e linhas vazias

            const [nome, telefone, email] = linha.split(',').map((x: string) => x.trim());
            if (!nome || !email) return;

            const novoId = Math.max(...contatosList.map(c => c.id), 0) + 1;
            const hoje = new Date();
            const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')} ${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`;
            const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];
            const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

            const novoContato = {
              id: novoId,
              nome,
              whatsapp: telefone || '(--) -----',
              email,
              ultimaInteracao: hojeFormatado,
              status: 'Ativo',
              badge: 'Importado',
              badgeColor: '#3498db',
              avatarColor: corAleatoria,
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

  // Exportar para Excel (com filtro de mês/ano)
  const exportarParaExcel = () => {
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    // Validação: verificar se pelo menos um mês foi selecionado
    if (mesesSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos um mês para exportar.');
      return;
    }

    // Filtrar contatos pelos meses e ano selecionado
    const contatosFiltrados = contatosList.filter((contato) => {
      const [data] = contato.ultimaInteracao.split(' ');
      const [ano, mes] = data.split('-');
      return mesesSelecionados.includes(parseInt(mes)) && parseInt(ano) === anoSelecionado;
    });

    if (contatosFiltrados.length === 0) {
      alert('Nenhum contato encontrado para o período selecionado.');
      return;
    }

    // Criar conteúdo CSV (compatível com Excel)
    let csvContent = 'RELATÓRIO DE CONTATOS - PROCLINIC CRM\n\n';
    csvContent += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n`;
    const mesesNomes = mesesSelecionados
      .sort((a, b) => a - b)
      .map(m => nomesMeses[m - 1])
      .join(', ');
    csvContent += `Período: ${mesesNomes} de ${anoSelecionado}\n\n`;
    csvContent += 'NOME,TELEFONE,EMAIL,ORIGEM,STATUS\n';

    contatosFiltrados.forEach((contato) => {
      csvContent += `"${contato.nome}","${contato.whatsapp}","${contato.email}","${contato.badge}","${contato.status}"\n`;
    });

    csvContent += `\n\nTOTAL DE CONTATOS NO PERÍODO: ${contatosFiltrados.length}\n`;

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const mesesCurtos = mesesSelecionados
      .sort((a, b) => a - b)
      .map(m => nomesMeses[m - 1].substring(0, 3).toLowerCase())
      .join('_');
    link.setAttribute('download', `contatos_${mesesCurtos}_${anoSelecionado}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportarModalVisible(false);
    setImportarExportarMenuVisible(false);
    alert('Contatos exportados com sucesso!');
  };

  return (
    <div style={{
      padding: '24px',
      background: '#0d1f2d',
      minHeight: '100vh',
      color: '#e8edf2',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* HEADER COM TÍTULO E BOTÕES */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        gap: '16px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Contatos</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* BOTÃO IMPORTAR/EXPORTAR */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setImportarExportarMenuVisible(!importarExportarMenuVisible)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #1e3d54',
                background: importarExportarMenuVisible ? '#1e3d54' : 'transparent',
                color: '#7a96aa',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!importarExportarMenuVisible) {
                  e.currentTarget.style.borderColor = '#c9943a';
                  e.currentTarget.style.color = '#c9943a';
                }
              }}
              onMouseLeave={(e) => {
                if (!importarExportarMenuVisible) {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.color = '#7a96aa';
                }
              }}
            >
              Importar / Exportar
            </button>

            {/* DROPDOWN MENU */}
            {importarExportarMenuVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  left: 0,
                  background: 'linear-gradient(180deg, #132636, #0d1f2d)',
                  border: '1px solid #2a4a64',
                  borderRadius: '12px',
                  minWidth: '280px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                {/* Opção 1: Importar da Agenda */}
                <button
                  onClick={() => {
                    importarDaAgenda();
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#e8edf2',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: '1px solid #1e3d54',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1e3d54';
                    e.currentTarget.style.color = '#c9943a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e8edf2';
                  }}
                >
                  <Phone size={16} /> Importar da Agenda do Telefone
                </button>

                {/* Opção 2: Importar Arquivo */}
                <button
                  onClick={() => {
                    importarArquivo();
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#e8edf2',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: '1px solid #1e3d54',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1e3d54';
                    e.currentTarget.style.color = '#c9943a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e8edf2';
                  }}
                >
                  <FileUp size={16} /> Importar Arquivo
                </button>

                {/* Opção 3: Exportar Excel */}
                <button
                  onClick={() => {
                    setExportarModalVisible(true);
                    setImportarExportarMenuVisible(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#e8edf2',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1e3d54';
                    e.currentTarget.style.color = '#c9943a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e8edf2';
                  }}
                >
                  <Download size={16} /> Exportar Excel
                </button>
              </div>
            )}
          </div>
          {/* BOTÃO ADICIONAR */}
          <button
            onClick={abrirNovoContatoModal}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#c9943a',
              color: '#0d1f2d',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d9a344'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c9943a'}
          >
            Adicionar Contato
          </button>
        </div>
      </div>

      {/* RESUMO CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {resumo.map((card) => (
          <div
            key={card.label}
            style={{
              background: `linear-gradient(135deg, ${card.color}33, #132636)`,
              border: `2px solid ${card.color}BF`,
              borderRadius: '14px',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '12px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px ${card.color}33`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* ÍCONE SVG MINIMALISTA PREMIUM AAA - COLORIDO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: card.color,
            }}>
              {card.label === 'Hoje' && <Calendar size={28} strokeWidth={1.5} />}
              {card.label === 'Esta Semana' && <BarChart3 size={28} strokeWidth={1.5} />}
              {card.label === 'Este Mês' && <TrendingUp size={28} strokeWidth={1.5} />}
              {card.label === 'Total' && <Users size={28} strokeWidth={1.5} />}
            </div>
            {/* CONTEÚDO - ABAIXO DO ÍCONE */}
            <div style={{ width: '100%' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#9ca3af',
                marginBottom: '2px',
                lineHeight: '1',
                letterSpacing: '-0.5px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.value}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '4px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#9ca3af',
                fontWeight: 500,
                letterSpacing: '0.2px',
                WebkitFontSmoothing: 'antialiased',
              }}>
                {card.label === 'Hoje' && 'Novos contatos'}
                {card.label === 'Esta Semana' && 'Últimos 7 dias'}
                {card.label === 'Este Mês' && 'Mês atual'}
                {card.label === 'Total' && 'Todos os contatos'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTROS E AÇÕES */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* FILTRO CANAL */}
          <select
            value={filterCanal}
            onChange={(e) => setFilterCanal(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option>Todos os canais</option>
            <option>WhatsApp</option>
            <option>Instagram</option>
            <option>Email</option>
          </select>

          {/* FILTRO PIPELINE */}
          <select
            value={filterPipeline}
            onChange={(e) => setFilterPipeline(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option>Todos os pipelines</option>
            <option>Comercial</option>
            <option>Follow-up</option>
            <option>Suporte</option>
          </select>

          {/* BUSCA */}
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #1e3d54',
              background: '#0d1f2d',
              color: '#e8edf2',
              fontSize: '12px',
              minWidth: '200px',
              fontWeight: 500,
            }}
          />
        </div>
      </div>

      {/* TABELA DE CONTATOS */}
      <div style={{
        background: '#132636',
        border: '1px solid #1e3d54',
        borderRadius: '14px',
        overflow: 'hidden',
        maxHeight: '600px',
        overflowY: 'auto',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e3d54', background: '#0d1f2d' }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                NOME
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                WHATSAPP / HANDLE
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                EMAIL
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                ÚLTIMA INTERAÇÃO
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 700,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                STATUS
              </th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'center',
                fontWeight: 600,
                color: '#7a96aa',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {contatosFiltrados.map((contato) => (
              <tr key={contato.id} style={{ borderBottom: '1px solid #1e3d54' }}>
                <td style={{ padding: '12px 16px', color: '#e8edf2', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `${contato.avatarColor}33`,
                      border: `2px solid ${contato.avatarColor}B3`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      flexShrink: 0,
                      color: '#e8b86d',
                      marginTop: '2px',
                    }}>
                      {contato.nome[0]}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '2px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#e8edf2', lineHeight: '1.2' }}>{contato.nome}</span>
                      <span style={{
                        fontSize: '9px',
                        color: contato.badgeColor,
                        fontWeight: 700,
                        backgroundColor: `${contato.badgeColor}26`,
                        border: `0.5px solid ${contato.badgeColor}99`,
                        padding: '2px 6px',
                        borderRadius: '10px',
                        display: 'inline-block',
                        width: 'fit-content',
                      }}>
                        {contato.badge}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.whatsapp}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa' }}>{contato.email}</td>
                <td style={{ padding: '12px 16px', color: '#7a96aa', fontSize: '12px' }}>
                  {formatarUltimaInteracao(contato.ultimaInteracao)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#2ecc7133',
                    border: '1px solid #2ecc71A6',
                    color: '#2ecc71',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'default',
                  }}>
                    {contato.status}
                  </button>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l1.65-3.66a9 9 0 1 1 14.142-14.142A9 9 0 0 1 3.21 21z" />
                        <line x1="9" y1="10" x2="15" y2="10" />
                        <line x1="9" y1="14" x2="13" y2="14" />
                      </svg>
                    </button>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00d4ff';
                        e.currentTarget.style.borderColor = '#00d4ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                      style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#6b7280',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {contatosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#7a96aa',
        }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Nenhum contato encontrado</div>
          <div style={{ fontSize: '12px' }}>Tente ajustar os filtros ou criar um novo contato</div>
        </div>
      )}

      {/* MODAL NOVO CONTATO */}
      {novoContatoModalVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2332, #132636)',
            borderRadius: '16px',
            border: '2px solid #c9943a',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 148, 58, 0.15)',
          }}>
            {/* HEADER COM ÍCONE */}
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              paddingBottom: '16px',
              borderBottom: '1px solid #1e3d54',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '32px',
              }}>
                👤
              </div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: 800,
                margin: '0 0 8px 0',
                color: '#c9943a',
                letterSpacing: '0.5px',
              }}>
                Novo Contato
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#7a96aa',
                margin: 0,
              }}>
                Preencha os dados do contato
              </p>
            </div>

            {/* FORMULÁRIO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {/* NOME */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nome *
                </label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid #1e3d54',
                    background: '#0d1f2d',
                    color: '#e8edf2',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c9943a';
                    e.target.style.borderWidth = '2px';
                    e.target.style.boxShadow = '0 0 12px rgba(201, 148, 58, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#1e3d54';
                    e.target.style.borderWidth = '1px';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* TELEFONE E CANAL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Telefone / Handle
                  </label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #1e3d54',
                      background: '#132636',
                      color: '#e8edf2',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#c9943a'}
                    onBlur={(e) => e.target.style.borderColor = '#1e3d54'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Canal
                  </label>
                  <select
                    value={formData.canal}
                    onChange={(e) => setFormData({ ...formData, canal: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #1e3d54',
                      background: '#132636',
                      color: '#e8edf2',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#c9943a'}
                    onBlur={(e) => e.target.style.borderColor = '#1e3d54'}
                  >
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Email</option>
                    <option>Telefone</option>
                  </select>
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  E-mail *
                </label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #1e3d54',
                    background: '#132636',
                    color: '#e8edf2',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c9943a'}
                  onBlur={(e) => e.target.style.borderColor = '#1e3d54'}
                />
              </div>

              {/* AGENTE E ORIGEM */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Agente Responsável
                  </label>
                  <select
                    value={formData.agente}
                    onChange={(e) => setFormData({ ...formData, agente: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #1e3d54',
                      background: '#0d1f2d',
                      color: '#e8edf2',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#c9943a';
                      e.target.style.borderWidth = '2px';
                      e.target.style.boxShadow = '0 0 12px rgba(201, 148, 58, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e3d54';
                      e.target.style.borderWidth = '1px';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {membros.length > 0 ? (
                      membros.map((m) => (
                        <option key={m.id} value={m.nome}>
                          {m.nome}
                        </option>
                      ))
                    ) : (
                      <>
                        <option>Havila</option>
                        <option>João</option>
                        <option>Maria</option>
                        <option>Pedro</option>
                        <option>Ana</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Origem
                  </label>
                  <select
                    value={formData.origem}
                    onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid #1e3d54',
                      background: '#0d1f2d',
                      color: '#e8edf2',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#c9943a';
                      e.target.style.borderWidth = '2px';
                      e.target.style.boxShadow = '0 0 12px rgba(201, 148, 58, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#1e3d54';
                      e.target.style.borderWidth = '1px';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {origens.length > 0 ? (
                      origens.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))
                    ) : (
                      <>
                        <option>Tráfego Pago</option>
                        <option>Orgânico</option>
                        <option>Indicação</option>
                        <option>Direto</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* OBSERVAÇÕES */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#7a96aa', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Observações
                </label>
                <textarea
                  placeholder="Notas sobre este contato..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #1e3d54',
                    background: '#132636',
                    color: '#e8edf2',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    minHeight: '80px',
                    resize: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c9943a'}
                  onBlur={(e) => e.target.style.borderColor = '#1e3d54'}
                />
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #1e3d54',
            }}>
              <button
                onClick={fecharNovoContatoModal}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9943a';
                  e.currentTarget.style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.color = '#7a96aa';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarContato}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #c9943a, #d9a344)',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(201, 148, 58, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 148, 58, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 148, 58, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Salvar Contato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL EXPORTAR COM MÊS/ANO ============ */}
      {exportarModalVisible && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a2332, #132636)',
            border: '2px solid #c9943a',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            color: '#e8edf2',
            fontFamily: "'Segoe UI', sans-serif",
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 148, 58, 0.1)',
          }}>
            {/* TÍTULO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '24px',
            }}>
              <BarChart3 size={24} color="#c9943a" />
              <h2 style={{
                fontSize: '18px',
                fontWeight: 800,
                margin: 0,
                color: '#c9943a',
              }}>
                Exportar Contatos
              </h2>
            </div>

            {/* SELETOR DE MÊS */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7a96aa',
                display: 'block',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Selecione o Mês
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}>
                {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes, index) => (
                  <button
                    key={mes}
                    onClick={() => toggleMesSelecionado(index + 1)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: mesesSelecionados.includes(index + 1) ? 'none' : '1px solid #1e3d54',
                      background: mesesSelecionados.includes(index + 1) ? 'linear-gradient(135deg, #c9943a, #d9a344)' : 'transparent',
                      color: mesesSelecionados.includes(index + 1) ? '#0d1f2d' : '#7a96aa',
                      fontSize: '11px',
                      fontWeight: mesesSelecionados.includes(index + 1) ? 700 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: mesesSelecionados.includes(index + 1) ? '0 4px 12px rgba(201, 148, 58, 0.2)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!mesesSelecionados.includes(index + 1)) {
                        e.currentTarget.style.borderColor = '#c9943a';
                        e.currentTarget.style.color = '#c9943a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!mesesSelecionados.includes(index + 1)) {
                        e.currentTarget.style.borderColor = '#1e3d54';
                        e.currentTarget.style.color = '#7a96aa';
                      }
                    }}
                  >
                    {mes.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* SELETOR DE ANO */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#7a96aa',
                display: 'block',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Selecione o Ano
              </label>
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
              }}>
                {[2023, 2024, 2025, 2026, 2027].map((ano) => (
                  <button
                    key={ano}
                    onClick={() => setAnoSelecionado(ano)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: anoSelecionado === ano ? 'none' : '1px solid #1e3d54',
                      background: anoSelecionado === ano ? 'linear-gradient(135deg, #c9943a, #d9a344)' : 'transparent',
                      color: anoSelecionado === ano ? '#0d1f2d' : '#7a96aa',
                      fontSize: '12px',
                      fontWeight: anoSelecionado === ano ? 700 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: anoSelecionado === ano ? '0 4px 12px rgba(201, 148, 58, 0.2)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (anoSelecionado !== ano) {
                        e.currentTarget.style.borderColor = '#c9943a';
                        e.currentTarget.style.color = '#c9943a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (anoSelecionado !== ano) {
                        e.currentTarget.style.borderColor = '#1e3d54';
                        e.currentTarget.style.color = '#7a96aa';
                      }
                    }}
                  >
                    {ano}
                  </button>
                ))}
              </div>
            </div>

            {/* RESUMO */}
            <div style={{
              background: 'linear-gradient(135deg, #0d1f2d, #132636)',
              border: '1px solid #1e3d54',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#9ca3af',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: '#c9943a' }}>Período selecionado:</span> {mesesSelecionados.length === 0 ? 'Nenhum mês selecionado' : mesesSelecionados.map(m => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][m - 1]).join(', ')} de {anoSelecionado}
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#c9943a' }}>Total de contatos:</span> {mesesSelecionados.length === 0 ? 0 : contatosList.filter(c => {
                  const [data] = c.ultimaInteracao.split(' ');
                  const [ano, mes] = data.split('-');
                  return mesesSelecionados.includes(parseInt(mes)) && parseInt(ano) === anoSelecionado;
                }).length}
              </div>
            </div>

            {/* BOTÕES */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #1e3d54',
            }}>
              <button
                onClick={() => setExportarModalVisible(false)}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #1e3d54',
                  background: 'transparent',
                  color: '#7a96aa',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c9943a';
                  e.currentTarget.style.color = '#c9943a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e3d54';
                  e.currentTarget.style.color = '#7a96aa';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={exportarParaExcel}
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #c9943a, #d9a344)',
                  color: '#0d1f2d',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(201, 148, 58, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 148, 58, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 148, 58, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Download size={16} /> Exportar Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
