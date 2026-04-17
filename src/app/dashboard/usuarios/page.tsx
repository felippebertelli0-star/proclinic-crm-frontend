/**
 * Página: Usuários
 * Gerenciar usuários do sistema
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockUsuarios, filtrarUsuarios, paginar } from '@/lib/mockData';

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEMS_PER_PAGE = 10;

// ============================================================================
// COMPONENT
// ============================================================================

export default function UsuariosPage() {
  // ============================================================================
  // STATE
  // ============================================================================

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEdit = (id: string) => {
    console.log('Editar usuário:', id);
    // Aqui entraria a lógica de edição (modal, navegação, etc)
  };

  const handleDelete = (id: string) => {
    console.log('Deletar usuário:', id);
    // Aqui entraria a lógica de deleção (confirmação, API call, etc)
  };

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const usuariosFiltrados = useMemo(() => {
    return filtrarUsuarios(searchTerm);
  }, [searchTerm]);

  const { items: usuariosPaginados, total: totalUsuarios } = useMemo(() => {
    return paginar(usuariosFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [usuariosFiltrados, currentPage]);

  const totalPages = Math.ceil(totalUsuarios / ITEMS_PER_PAGE);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-2">Gerencie os usuários do seu sistema</p>
      </div>

      {/* Filter */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome ou email..."
      />

      {/* Table */}
      <TableCard title={`Total de Usuários: ${totalUsuarios}`} actionLabel="Novo Usuário">
        {usuariosPaginados.length > 0 ? (
          <>
            <table className="w-full">
              {/* Header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-gray-200">
                {usuariosPaginados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    {/* Nome */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {usuario.avatar && (
                          <img
                            src={usuario.avatar}
                            alt={usuario.nome}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <span className="font-medium text-gray-900">{usuario.nome}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.email}
                    </td>

                    {/* Tipo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.tipo === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={usuario.ativo ? 'ativo' : 'inativo'} />
                    </td>

                    {/* Último Acesso */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {usuario.ultimoAcesso
                        ? new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onEdit={() => handleEdit(usuario.id)}
                        onDelete={() => handleDelete(usuario.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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
          // Empty State
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando um novo usuário'}
            </p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
