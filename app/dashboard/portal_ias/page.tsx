import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Portal das IAs - ProClinic CRM',
};

export default function PortalIasLegacyRedirect() {
  redirect('/dashboard/portal-ias');
}
