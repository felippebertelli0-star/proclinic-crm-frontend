/**
 * Página: Contatos
 * Gerenciar contatos de clientes e parceiros
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockContatos, filtrarContatos, paginar } from '@/lib/mockData';
import { Phone, Mail } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ContatosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const contatosFiltrados = useMemo(() => {
    return filtrarContatos(searchTerm, statusFilter || undefined);
  }, [searchTerm, statusFilter]);

  const { items: contatosPaginados, total: totalContatos } = useMemo(() => {
    return paginar(contatosFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [contatosFiltrados, currentPage]);

  const totalPages = Math.ceil(totalContatos / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
        <p className="text-gray-600 mt-2">Gerencie seus contatos e relacionamentos</p>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome, email ou telefone..."
        filters={[
          {
            label: 'Status',
            name: 'status',
            value: statusFilter,
            options: [
              { label: 'Ativo', value: 'ativo' },
              { label: 'Inativo', value: 'inativo' },
              { label: 'Suspenso', value: 'suspenso' },
            ],
            onChange: handleStatusFilter,
          },
        ]}
      />

      <TableCard title={`Total de Contatos: ${totalContatos}`} actionLabel="Novo Contato">
        {contatosPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contatosPaginados.map((contato) => (
                  <tr key={contato.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {contato.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-sm">
                        {contato.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} />
                            {contato.email}
                          </div>
                        )}
                        {contato.telefone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} />
                            {contato.telefone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {contato.empresa || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={contato.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {contato.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar contato:', contato.id)}
                        onDelete={() => console.log('Deletar contato:', contato.id)}
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
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum contato encontrado</h3>
            <p className="text-gray-600">Comece adicionando seus primeiros contatos</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
