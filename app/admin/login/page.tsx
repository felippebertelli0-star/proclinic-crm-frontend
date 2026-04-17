/**
 * Página de Login Admin
 * Fiel ao protótipo localhost:3456/admin.html
 */

import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata = {
  title: 'Admin Login - Jarvis',
  description: 'Painel administrativo Jarvis',
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
