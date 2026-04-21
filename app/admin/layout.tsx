import { AdminSidebar } from '@/components/ui/AdminSidebar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Jarvis Admin',
  description: 'Administrative Dashboard',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0f1419] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Admin Header */}
        <div className="border-b border-[#2a3647] bg-[#0a0e12] sticky top-0 z-50">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">JARVIS Control Panel</h1>
              <p className="text-sm text-[#7a8291] mt-1">System Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
