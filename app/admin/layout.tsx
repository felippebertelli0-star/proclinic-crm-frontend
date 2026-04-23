import { AdminSidebar } from '@/components/ui/AdminSidebar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'JARVIS · Master Admin',
  description: 'Control Panel — ProClinic SaaS',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a1520] text-white overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,21,32,0.85)] border-b border-[#132636]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-[#5a6f82]">JARVIS</span>
              <span className="text-[#2a3647]">/</span>
              <span className="text-white font-semibold">Visão Geral</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Status badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(46,204,113,0.08)] border border-[rgba(46,204,113,0.25)]">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-[#2ecc71] animate-ping opacity-60" />
                  <span className="relative rounded-full bg-[#2ecc71] w-2 h-2" />
                </span>
                <span className="text-[11px] font-semibold text-[#2ecc71]">Todos sistemas operacionais</span>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar clínicas, usuários, faturas..."
                  className="w-[320px] bg-[#0f1f2e] border border-[#1e3d54] rounded-[10px] px-4 py-2 text-[13px] text-white placeholder:text-[#5a6f82] focus:outline-none focus:border-[#c9943a] transition-colors"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#5a6f82] bg-[#1a3347] px-1.5 py-0.5 rounded border border-[#2a3647]">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
