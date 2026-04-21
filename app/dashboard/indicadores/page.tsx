/**
 * Página: Indicadores (KPI)
 * Dashboard de indicadores de desempenho e métricas
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';
import { mockIndicadores } from '@/lib/mockData';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Zap,
  BarChart3,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function IndicadoresPage() {
  const [periodo, setPeriodo] = useState('mes');

  // Ícone por tipo de indicador
  const getIconeIndicador = (titulo: string) => {
    if (titulo.includes('Paciente')) return <Users className="text-blue-600" size={24} />;
    if (titulo.includes('Receita')) return <DollarSign className="text-green-600" size={24} />;
    if (titulo.includes('Satisfação')) return <Zap className="text-yellow-600" size={24} />;
    if (titulo.includes('Presença')) return <CheckCircle2 className="text-purple-600" size={24} />;
    if (titulo.includes('Tempo')) return <Clock className="text-orange-600" size={24} />;
    return <BarChart3 className="text-gray-600" size={24} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Indicadores de Desempenho</h1>
          <p className="text-gray-600 mt-2">Dashboard de KPIs e métricas do sistema</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <option value="dia">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="trimestre">Este Trimestre</option>
          <option value="ano">Este Ano</option>
        </select>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockIndicadores.map((indicador) => {
          const variacaoPositiva = indicador.variacao >= 0;

          return (
            <div
              key={indicador.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getIconeIndicador(indicador.titulo)}
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    variacaoPositiva
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {variacaoPositiva ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {Math.abs(indicador.variacao)}%
                </div>
              </div>

              {/* Título e Período */}
              <h3 className="text-lg font-semibold text-gray-900">{indicador.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{indicador.periodo}</p>

              {/* Valor Principal */}
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">
                  {indicador.valor.toLocaleString('pt-BR')}
                </div>
                {indicador.unidade && (
                  <span className="text-sm text-gray-600 ml-2">{indicador.unidade}</span>
                )}
              </div>

              {/* Barra de Progresso (para alguns indicadores) */}
              {indicador.titulo.includes('Taxa') && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((indicador.valor as number) / 100 * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Comparativo */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  {variacaoPositiva ? 'Aumento' : 'Redução'} de{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.abs(indicador.variacao)}%
                  </span>{' '}
                  {indicador.periodo}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos e Tabelas Complementares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo Executivo */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Executivo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-600">Total de Pacientes Ativos</span>
              <span className="font-semibold text-gray-900">
                {mockIndicadores[0].valor.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-600">Receita do Período</span>
              <span className="font-semibold text-gray-900">
                R$ {mockIndicadores[3].valor.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-gray-600">Agendamentos Realizados</span>
              <span className="font-semibold text-gray-900">
                {mockIndicadores[1].valor.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Taxa Média de Presença</span>
              <span className="font-semibold text-gray-900">
                {mockIndicadores[2].valor}%
              </span>
            </div>
          </div>
        </div>

        {/* Metas e Objetivos */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metas e Objetivos</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Meta de Receita</span>
                <span className="text-sm font-semibold text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Meta de Agendamentos</span>
                <span className="text-sm font-semibold text-gray-900">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Presença</span>
                <span className="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Satisfação do Cliente</span>
                <span className="text-sm font-semibold text-gray-900">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights e Recomendações</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">→</span>
            <span className="text-gray-700">
              Sua taxa de presença está acima da média. Continue com as estratégias atuais.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">→</span>
            <span className="text-gray-700">
              Considere aumentar os esforços de marketing para atingir a meta de receita.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">→</span>
            <span className="text-gray-700">
              A satisfação dos pacientes está excelente. Mantenha este nível de qualidade.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">→</span>
            <span className="text-gray-700">
              Tempo médio de atendimento acima do ideal. Considere revisar fluxo operacional.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
