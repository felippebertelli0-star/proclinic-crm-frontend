/**
 * Página do Dashboard
 */

import { CRMLayout } from '@/components/crm/CRMLayout';

export const metadata = {
  title: 'Dashboard - ProClinic CRM',
  description: 'Dashboard principal do ProClinic CRM',
};

export default function DashboardPage() {
  return <CRMLayout />;
}
