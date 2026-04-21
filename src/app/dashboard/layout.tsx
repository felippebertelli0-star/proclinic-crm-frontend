/**
 * Layout do Dashboard
 */

import { CRMLayout } from '@/components/crm/CRMLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CRMLayout>{children}</CRMLayout>;
}
