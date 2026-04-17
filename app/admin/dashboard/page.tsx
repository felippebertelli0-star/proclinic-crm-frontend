/**
 * Página Admin Dashboard
 * Fiel ao protótipo localhost:3456/admin.html
 */

import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard - Jarvis',
  description: 'Painel administrativo Jarvis',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
