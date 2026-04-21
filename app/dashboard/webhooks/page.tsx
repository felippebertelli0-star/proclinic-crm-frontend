/**
 * Página: Webhooks
 * Gerenciar webhooks e triggers de API
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockWebhooks, filtrarWebhooks, paginar, formatarData } from '@/lib/mockData';
import { Link, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function WebhooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventoFilter, setEventoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEventoFilter = (value: string) => {
    setEventoFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const webhookStats = useMemo(() => {
    return {
      total: mockWebhooks.length,
      ativos: mockWebhooks.filter((w) => w.ativo).length,
      inativos: mockWebhooks.filter((w) => !w.ativo).length,
      totalDisparos: mockWebhooks.reduce((sum, w) => sum + w.totalDisparos, 0),
      failureRate: Math.round(
        (mockWebhooks.reduce((sum, w) => sum + w.tentativasFailadas, 0) /
        mockWebhooks.reduce((sum, w) => sum + w.totalDisparos, 0) * 100) || 0,
      ),
    };
  }, []);

  const webhooksFiltrados = useMemo(() => {
    return filtrarWebhooks(searchTerm, eventoFilter || undefined);
  }, [searchTerm, eventoFilter]);

  const { items: webhooksPaginados, total: totalWebhooks } = useMemo(() => {
    return paginar(webhooksFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [webhooksFiltrados, currentPage]);

  const totalPages = Math.ceil(totalWebhooks / ITEMS_PER_PAGE);

  // Eventos únicos para filtro
  const eventos = Array.from(new Set(mockWebhooks.map((w) => w.evento)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
        <p className="text-gray-600 mt-2">Gerenciar webhooks e triggers de API</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Webhooks</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{webhookStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Webhooks Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{webhookStats.ativos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Disparos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{webhookStats.totalDisparos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Taxa de Falha</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{webhookStats.failureRate}%</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por URL ou nome..."
        filters={[
          {
            label: 'Evento',
            name: 'evento',
            value: eventoFilter,
            options: eventos.map((e) => ({ label: e, value: e })),
            onChange: handleEventoFilter,
          },
        ]}
      />

      {/* Tabela de Webhooks */}
      <TableCard title={`Total de Webhooks: ${totalWebhooks}`} actionLabel="Novo Webhook">
        {webhooksPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Disparos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Falhas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Último Disparo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {webhooksPaginados.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{webhook.nome}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <Link size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                        <code className="text-xs text-blue-600 break-all">{webhook.url}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                        {webhook.evento.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {webhook.ativo ? (
                          <CheckCircle2 className="text-green-600" size={18} />
                        ) : (
                          <AlertTriangle className="text-orange-600" size={18} />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            webhook.ativo ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {webhook.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{webhook.totalDisparos}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`font-semibold ${
                          webhook.tentativasFailadas > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {webhook.tentativasFailadas}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatarData(webhook.dataUltimoDisparo)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar webhook:', webhook.id)}
                        onDelete={() => console.log('Deletar webhook:', webhook.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="px-6 py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">🪝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum webhook encontrado</h3>
            <p className="text-gray-600">Configure seu primeiro webhook</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
