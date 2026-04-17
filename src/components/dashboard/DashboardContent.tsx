/**
 * Componente de Dashboard
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import apiClient, { getErrorMessage } from '@/lib/api';
import { connectSocket, isSocketConnected, disconnectSocket, onNovaMsg } from '@/lib/socket';
import { Pagamento, PagamentoResponse } from '@/types';

// ============================================================================
// COMPONENT
// ============================================================================

export function DashboardContent() {
  const { usuario } = useAuthStore();

  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketStatus, setSocketStatus] = useState('desconectado');
  const [realtimeMsg, setRealtimeMsg] = useState<string | null>(null);

  // ============================================================================
  // EFEITOS
  // ============================================================================

  /**
   * Carregar pagamentos ao montar
   */
  useEffect(() => {
    loadPagamentos();
  }, []);

  /**
   * Conectar ao Socket.io
   */
  useEffect(() => {
    if (!usuario) return;

    try {
      connectSocket(usuario.id, usuario.sistemaId);
      setSocketStatus('conectado');

      // Ouvir novas mensagens real-time
      onNovaMsg((data) => {
        setRealtimeMsg(`Nova mensagem recebida em tempo real! 🔔`);
        setTimeout(() => setRealtimeMsg(null), 3000);
      });
    } catch (err) {
      setSocketStatus('erro');
      console.error('❌ Erro ao conectar socket:', err);
    }

    return () => {
      disconnectSocket();
    };
  }, [usuario]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Carregar pagamentos
   */
  const loadPagamentos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sistemaId = usuario?.sistemaId;
      if (!sistemaId) {
        setError('Sistema ID não encontrado');
        return;
      }

      const response = await apiClient.get<PagamentoResponse>(
        `/asaas/pagamentos/${sistemaId}`
      );

      setPagamentos(response.data.pagamentos);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('❌ Erro ao carregar pagamentos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Formatar status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'falhou':
        return 'bg-red-100 text-red-800';
      case 'reembolsado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Formatar moeda
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Formatar data
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Bem-vindo, {usuario?.nome}! 👋
        </h1>
        <p className="text-slate-400 mt-2">
          Sistema: <span className="font-semibold text-slate-300">{usuario?.sistemaId}</span>
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Socket Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Real-time</h3>
          <p className="text-2xl font-bold text-white">
            {socketStatus === 'conectado' ? '🟢' : '🔴'} {socketStatus}
          </p>
          <p className="text-xs text-slate-500 mt-1">Socket.io Status</p>
        </div>

        {/* Total Pagamentos */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Total de Pagamentos</h3>
          <p className="text-2xl font-bold text-white">{pagamentos.length}</p>
          <p className="text-xs text-slate-500 mt-1">Registros no sistema</p>
        </div>

        {/* API Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Status da API</h3>
          <p className="text-2xl font-bold text-green-400">✅ Online</p>
          <p className="text-xs text-slate-500 mt-1">Conectado ao backend</p>
        </div>
      </div>

      {/* Real-time Notification */}
      {realtimeMsg && (
        <div className="p-4 bg-blue-950 border border-blue-800 rounded-lg animate-pulse">
          <p className="text-sm text-blue-300">{realtimeMsg}</p>
        </div>
      )}

      {/* Pagamentos Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Pagamentos</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="p-4 bg-red-950 border border-red-800 rounded-lg mb-4">
              <p className="text-sm text-red-300">❌ {error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">
                <div className="animate-spin mb-2">⏳</div>
                <p>Carregando pagamentos...</p>
              </div>
            </div>
          ) : pagamentos.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="mb-2">📭 Nenhum pagamento encontrado</p>
              <p className="text-sm">Os pagamentos aparecerão aqui quando forem criados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {pagamentos.map((pagamento) => (
                    <tr key={pagamento.id} className="hover:bg-slate-700">
                      <td className="px-6 py-4 text-sm text-white font-mono">
                        {pagamento.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {formatCurrency(pagamento.valor)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pagamento.status)}`}>
                          {pagamento.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(pagamento.criadoEm)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 py-4">
        <p>Sistema Premium AAA • v1.0.0 • Todos os direitos reservados</p>
      </div>
    </div>
  );
}
