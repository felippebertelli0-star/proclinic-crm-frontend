/**
 * Página do Dashboard
 */

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Dashboard - ProClinic CRM',
  description: 'Dashboard principal do ProClinic CRM',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
