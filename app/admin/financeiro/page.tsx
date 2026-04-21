'use client';

export default function FinanceiroPage() {
  const invoices = [
    { id: 'INV-001', cliente: 'ProClinic Clinic', amount: 'R$ 4.500', date: '2026-04-15', status: 'Pago' },
    { id: 'INV-002', cliente: 'Health Solutions', amount: 'R$ 3.200', date: '2026-04-10', status: 'Pendente' },
    { id: 'INV-003', cliente: 'MedTech Corp', amount: 'R$ 5.800', date: '2026-04-05', status: 'Pago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financeiro</h1>
        <p className="text-sm text-[#7a8291] mt-1">Gerenciamento de faturamento e assinaturas</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Receita Total</div>
          <div className="text-3xl font-black text-[#d4af37]">R$ 48.5k</div>
          <div className="text-xs text-[#2ecc71] mt-2 font-bold">+8.2% vs mês anterior</div>
        </div>
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Clientes Ativos</div>
          <div className="text-3xl font-black text-[#d4af37]">84</div>
          <div className="text-xs text-[#2ecc71] mt-2 font-bold">+6 este mês</div>
        </div>
        <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
          <div className="text-xs text-[#7a8291] uppercase font-bold mb-2">Pendentes</div>
          <div className="text-3xl font-black text-[#f39c12]">R$ 3.2k</div>
          <div className="text-xs text-[#f39c12] mt-2 font-bold">3 invoices</div>
        </div>
      </div>

      <div className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
        <h3 className="font-bold text-white text-lg mb-4">Faturas Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a3647]">
                <th className="text-left py-3 px-4 text-[#7a8291] font-bold uppercase text-xs">ID</th>
                <th className="text-left py-3 px-4 text-[#7a8291] font-bold uppercase text-xs">Cliente</th>
                <th className="text-left py-3 px-4 text-[#7a8291] font-bold uppercase text-xs">Valor</th>
                <th className="text-left py-3 px-4 text-[#7a8291] font-bold uppercase text-xs">Data</th>
                <th className="text-left py-3 px-4 text-[#7a8291] font-bold uppercase text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#2a3647] hover:bg-[rgba(212,175,55,0.05)]">
                  <td className="py-3 px-4 text-white">{inv.id}</td>
                  <td className="py-3 px-4 text-white">{inv.cliente}</td>
                  <td className="py-3 px-4 text-[#d4af37] font-bold">{inv.amount}</td>
                  <td className="py-3 px-4 text-[#7a8291]">{inv.date}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      inv.status === 'Pago'
                        ? 'bg-[rgba(46,204,113,0.15)] text-[#2ecc71]'
                        : 'bg-[rgba(243,156,18,0.15)] text-[#f39c12]'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
