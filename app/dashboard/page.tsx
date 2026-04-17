/**
 * Página do Dashboard CRM
 * 100% Fiel ao protótipo localhost:3456
 * Layout com Sidebar navegável completo
 */

import { CRMLayout } from '@/components/crm/CRMLayout';

export const metadata = {
  title: 'Dashboard - ProClinic CRM',
  description: 'Dashboard principal do ProClinic CRM - 100% Completo',
};

export default function DashboardPage() {
  return <CRMLayout />;
}
