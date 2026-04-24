/**
 * Cliente API de conexões WhatsApp (Evolution v2.3.x).
 * Tenant-scoped: /whatsapp/sistemas/:sistemaId/conexoes.
 */

import apiClient from './api';

export interface WhatsappConexao {
  id: string;
  nome: string;
  descricao?: string | null;
  status: string;
  ativo: boolean;
  criadoEm: string;
  instanceName?: string;
  ownerJid?: string;
}

export interface CriarConexaoInput {
  nome: string;
  descricao?: string;
  numero?: string;
}

export interface CriarConexaoResponse {
  conexaoId: string;
  instanceName: string;
  qrCodeBase64?: string;
  pairingCode?: string;
  status: string;
}

export interface QrCodeResponse {
  qrCodeBase64?: string;
  pairingCode?: string;
  instanceName?: string;
}

export interface StatusResponse {
  status: string;
  state: string;
  ownerJid?: string;
  instanceName?: string;
  erro?: string;
}

export async function listarConexoesWhatsapp(sistemaId: string): Promise<WhatsappConexao[]> {
  const resp = await apiClient.get<WhatsappConexao[]>(`/whatsapp/sistemas/${sistemaId}/conexoes`);
  return Array.isArray(resp.data) ? resp.data : [];
}

export async function criarConexaoWhatsapp(
  sistemaId: string,
  input: CriarConexaoInput,
): Promise<CriarConexaoResponse> {
  const resp = await apiClient.post<CriarConexaoResponse>(
    `/whatsapp/sistemas/${sistemaId}/conexoes`,
    input,
  );
  return resp.data;
}

export async function buscarQrCodeWhatsapp(
  sistemaId: string,
  conexaoId: string,
): Promise<QrCodeResponse> {
  const resp = await apiClient.get<QrCodeResponse>(
    `/whatsapp/sistemas/${sistemaId}/conexoes/${conexaoId}/qrcode`,
  );
  return resp.data;
}

export async function buscarStatusWhatsapp(
  sistemaId: string,
  conexaoId: string,
): Promise<StatusResponse> {
  const resp = await apiClient.get<StatusResponse>(
    `/whatsapp/sistemas/${sistemaId}/conexoes/${conexaoId}/status`,
  );
  return resp.data;
}

export async function removerConexaoWhatsapp(
  sistemaId: string,
  conexaoId: string,
): Promise<void> {
  await apiClient.delete(`/whatsapp/sistemas/${sistemaId}/conexoes/${conexaoId}`);
}

import { getToken } from './auth';

export function isMockToken(): boolean {
  if (typeof window === 'undefined') return true;
  const token = getToken() || '';
  return token === '' || token.startsWith('mock_token_');
}
