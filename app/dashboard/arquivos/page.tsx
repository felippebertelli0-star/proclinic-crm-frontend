/**
 * Página: Arquivos
 * Gerenciar arquivos e documentos do sistema
 * Qualidade: Premium AAA
 */

'use client';

import { useState, useMemo } from 'react';
import { TableCard } from '@/components/dashboard/TableCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ActionButtons } from '@/components/dashboard/ActionButtons';
import { Pagination } from '@/components/dashboard/Pagination';
import { mockArquivos, filtrarArquivos, paginar, formatarData } from '@/lib/mockData';
import { FileText, Lock, Share2, HardDrive } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Ícone por tipo de arquivo
const getIconeArquivo = (tipo: string) => {
  const tipoLower = tipo.toLowerCase();
  if (tipoLower === 'pdf') return '📄';
  if (tipoLower === 'doc') return '📝';
  if (tipoLower === 'xls') return '📊';
  if (tipoLower === 'jpg' || tipoLower === 'png') return '🖼️';
  if (tipoLower === 'zip') return '📦';
  return '📋';
};

export default function ArquivosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoriaFilter = (value: string) => {
    setCategoriaFilter(value);
    setCurrentPage(1);
  };

  // Cálculos de estatísticas
  const arquivoStats = useMemo(() => {
    const totalSize = mockArquivos.reduce((sum, a) => sum + a.tamanho, 0);
    return {
      total: mockArquivos.length,
      tamanhoTotal: totalSize,
      privados: mockArquivos.filter((a) => a.acesso === 'privado').length,
      compartilhados: mockArquivos.filter((a) => a.acesso === 'compartilhado').length,
    };
  }, []);

  const arquivosFiltrados = useMemo(() => {
    return filtrarArquivos(searchTerm, categoriaFilter || undefined);
  }, [searchTerm, categoriaFilter]);

  const { items: arquivosPaginados, total: totalArquivos } = useMemo(() => {
    return paginar(arquivosFiltrados, ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE);
  }, [arquivosFiltrados, currentPage]);

  const totalPages = Math.ceil(totalArquivos / ITEMS_PER_PAGE);

  // Categorias únicas para filtro
  const categorias = Array.from(new Set(mockArquivos.map((a) => a.categoria)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Arquivos</h1>
        <p className="text-gray-600 mt-2">Gerenciar arquivos e documentos</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total de Arquivos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{arquivoStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Tamanho Total</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {arquivoStats.tamanhoTotal.toFixed(1)}MB
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Privados</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{arquivoStats.privados}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Compartilhados</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{arquivoStats.compartilhados}</p>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar por nome de arquivo..."
        filters={[
          {
            label: 'Categoria',
            name: 'categoria',
            value: categoriaFilter,
            options: categorias.map((c) => ({ label: c, value: c })),
            onChange: handleCategoriaFilter,
          },
        ]}
      />

      {/* Tabela de Arquivos */}
      <TableCard title={`Total de Arquivos: ${totalArquivos}`} actionLabel="Novo Arquivo">
        {arquivosPaginados.length > 0 ? (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Acesso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Criador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Modificado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {arquivosPaginados.map((arquivo) => (
                  <tr key={arquivo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getIconeArquivo(arquivo.tipo)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{arquivo.nome}</div>
                          <div className="text-xs text-gray-500">v{arquivo.versao}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {arquivo.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {arquivo.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold text-gray-900">
                        <HardDrive size={16} />
                        {arquivo.tamanho}MB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        {arquivo.acesso === 'privado' ? (
                          <>
                            <Lock size={16} className="text-orange-600" />
                            <span className="text-xs font-semibold text-orange-600">Privado</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={16} className="text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              Compartilhado ({arquivo.pessoas})
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {arquivo.criador}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatarData(arquivo.dataModificacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionButtons
                        onView={() => console.log('Abrir arquivo:', arquivo.id)}
                        onEdit={() => console.log('Editar arquivo:', arquivo.id)}
                        onDelete={() => console.log('Deletar arquivo:', arquivo.id)}
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
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum arquivo encontrado</h3>
            <p className="text-gray-600">Faça upload de seus primeiros arquivos</p>
          </div>
        )}
      </TableCard>
    </div>
  );
}
