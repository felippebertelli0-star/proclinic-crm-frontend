/**
 * Página do Dashboard CRM
 * Fiel ao protótipo localhost:3456/dashboard
 */

import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Dashboard - ProClinic CRM',
  description: 'Dashboard principal do ProClinic CRM',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
