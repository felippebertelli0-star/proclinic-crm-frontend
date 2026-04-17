/**
 * Página: Equipe
 * Gerenciar membros da equipe e departamentos
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockEquipe, filtrarEquipe, paginar, formatarData } from '@/lib/mockData';
import { Mail, Phone, Clock } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function EquipePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDepartamentoFilter = (value: string) => {
    setDepartamentoFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const equipeStats = useMemo(() => {
    return {
      total: mockEquipe.length,
      ativos: mockEquipe.filter((e) => e.status === 'ativo').length,
      inativos: mockEquipe.filter((e) => e.status === 'inativo').length,
      horasMedio: Math.round(mockEquipe.reduce((sum, e) => sum + e.horasTrabalhadas, 0) / mockEquipe.length),
    };
  }, []);

  const equipeFiltraga = useMemo(() => {
    return filtrarEquipe(searchTerm, departamentoFilter || undefined);
  }, [searchTerm, departamentoFilter]);

  const { items: equipePaginada, total: totalEquipe } = useMemo(() => {
    return paginar(equipeFiltraga, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [equipeFiltraga, currentPage]);

  const totalPages = Math.ceil(totalEquipe / ITEMS_PER_PAGE);

  // Departamentos únicos para filtro
  const departamentos = Array.from(new Set(mockEquipe.map((e) => e.departamento)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipe</h1>
        <p className="text-gray-600 mt-2">Gerenciar membros da equipe e departamentos</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Membros</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{equipeStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Membros Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{equipeStats.ativos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Membros Inativos</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{equipeStats.inativos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Horas Médias/Mês</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{equipeStats.horasMedio}h</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome ou email..."
        filters={[
          {
            label: 'Departamento',
            name: 'departamento',
            value: departamentoFilter,
            options: departamentos.map((d) => ({ label: d, value: d })),
            onChange: handleDepartamentoFilter,
          },
        ]}
      />

      {/* Tabela de Equipe */}
      <TableCard title={`Total de Membros: ${totalEquipe}`} actionLabel="Novo Membro">
        {equipePaginada.length > 0 ? (
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
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Especialidade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Horas/Mês
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {equipePaginada.map((membro) => (
                  <tr key={membro.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={membro.avatar}
                          alt={membro.nome}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{membro.nome}</div>
                          <div className="text-sm text-gray-500">{membro.cargo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          {membro.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          {membro.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {membro.cargo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {membro.departamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {membro.especialidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          membro.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {membro.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold text-gray-900">
                        <Clock size={16} />
                        {membro.horasTrabalhadas}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => console.log('Editar membro:', membro.id)}
                        onDelete={() => console.log('Deletar membro:', membro.id)}
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
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum membro encontrado</h3>
            <p className="text-gray-600">Adicione membros à sua equipe</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
