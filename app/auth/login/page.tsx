/**
 * Página de Login
 */

import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - ProClinic CRM',
  description: 'Faça login no seu sistema ProClinic CRM',
};

export default function LoginPage() {
  return <LoginForm />;
}
