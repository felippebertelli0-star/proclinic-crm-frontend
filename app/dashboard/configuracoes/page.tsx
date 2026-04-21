/**
 * Página: Configurações
 * Gerenciar preferências e configurações do sistema
 * Qualidade: Premium AAA
 */

'use client';

import { useState } from 'react';
import { Bell, Lock, Zap, Users, Save, CheckCircle } from 'lucide-react';
import {
  mockConfiguracaoNotificacoes,
  mockConfiguracaoSeguranca,
  mockConfiguracaoIntegracao,
  mockConfiguracaoEquipe,
} from '@/lib/mockData';

type ConfigTab = 'notificacoes' | 'seguranca' | 'integracao' | 'equipe';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('notificacoes');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [notificacoes, setNotificacoes] = useState(mockConfiguracaoNotificacoes);
  const [seguranca, setSeguranca] = useState(mockConfiguracaoSeguranca);
  const [integracao, setIntegracao] = useState(mockConfiguracaoIntegracao);
  const [equipe, setEquipe] = useState(mockConfiguracaoEquipe);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    console.log('Configurações salvas!');
  };

  const tabs = [
    { id: 'notificacoes' as const, label: 'Notificações', icon: Bell },
    { id: 'seguranca' as const, label: 'Segurança', icon: Lock },
    { id: 'integracao' as const, label: 'Integração', icon: Zap },
    { id: 'equipe' as const, label: 'Equipe', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Personalize suas preferências e configurações</p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-semibold text-green-900">Salvo com sucesso!</p>
            <p className="text-sm text-green-700">Suas configurações foram atualizadas.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Notificações */}
          {activeTab === 'notificacoes' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências de Notificação</h3>
                <p className="text-gray-600 mb-6">Escolha como você gostaria de receber notificações</p>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={notificacoes.emailNotificacoes}
                      onChange={(e) =>
                        setNotificacoes({ ...notificacoes, emailNotificacoes: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">Receba notificações por email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={notificacoes.smsNotificacoes}
                      onChange={(e) =>
                        setNotificacoes({ ...notificacoes, smsNotificacoes: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">SMS</p>
                      <p className="text-sm text-gray-600">Receba notificações por SMS</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={notificacoes.pushNotificacoes}
                      onChange={(e) =>
                        setNotificacoes({ ...notificacoes, pushNotificacoes: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Push</p>
                      <p className="text-sm text-gray-600">Notificações push no navegador</p>
                    </div>
                  </label>

                  <div className="pt-4">
                    <label className="block mb-3">
                      <p className="font-semibold text-gray-900 mb-2">Frequência</p>
                      <select
                        value={notificacoes.frequencia}
                        onChange={(e) =>
                          setNotificacoes({ ...notificacoes, frequencia: e.target.value as any })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="imediata">Imediata</option>
                        <option value="diaria">Diária</option>
                        <option value="semanal">Semanal</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'seguranca' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900">Segurança</h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  <strong>Última alteração de senha:</strong>{' '}
                  {new Date(seguranca.ultimaAlteracaoSenha!).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={seguranca.autenticacaoDoisFatores}
                    onChange={(e) =>
                      setSeguranca({ ...seguranca, autenticacaoDoisFatores: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Autenticação em Dois Fatores</p>
                    <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                  </div>
                </label>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Últimos Logins ({seguranca.loginRecentes.length})</h4>
                <div className="space-y-2">
                  {seguranca.loginRecentes.map((login, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg text-sm">
                      <p className="font-semibold text-gray-900">{login.dispositivo}</p>
                      <p className="text-gray-600">
                        {login.localizacao} · {new Date(login.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Integração */}
          {activeTab === 'integracao' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
                <div className="space-y-3">
                  {integracao.webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-mono text-sm text-gray-600">{webhook.url}</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            webhook.ativa
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {webhook.ativa ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Eventos: {webhook.eventos.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chaves de API</h3>
                <div className="space-y-3">
                  {integracao.apiKeys.map((key) => (
                    <div key={key.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-semibold text-gray-900">{key.nome}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {key.id}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Criada em {new Date(key.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Equipe */}
          {activeTab === 'equipe' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Membros da Equipe</h3>
                <div className="space-y-3">
                  {equipe.membros.map((membro) => (
                    <div key={membro.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{membro.nome}</p>
                          <p className="text-sm text-gray-600">{membro.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                            {membro.role.charAt(0).toUpperCase() + membro.role.slice(1)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              membro.ativo
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {membro.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {equipe.convitesPendentes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Convites Pendentes</h3>
                  <div className="space-y-3">
                    {equipe.convitesPendentes.map((convite, idx) => (
                      <div key={idx} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{convite.email}</p>
                        <p className="text-sm text-gray-600">
                          Role: {convite.role} · Enviado em{' '}
                          {new Date(convite.enviadoEm).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="px-8 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
