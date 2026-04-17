'use client';

export default function MonitoramentoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoramento</h1>
        <p className="text-sm text-[#7a8291] mt-1">Acompanhe a saúde e desempenho dos sistemas</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {[
          { name: 'ProClinic CRM', status: 'Saudável', uptime: '99.9%', latency: '45ms' },
          { name: 'Jarvis API', status: 'Saudável', uptime: '99.8%', latency: '52ms' },
          { name: 'Database', status: 'Alerta', uptime: '99.5%', latency: '120ms' },
          { name: 'Cache Server', status: 'Saudável', uptime: '99.9%', latency: '8ms' },
        ].map((sys) => (
          <div key={sys.name} className="bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">{sys.name}</h3>
                <p className={`text-xs font-bold mt-1 ${
                  sys.status === 'Saudável' ? 'text-[#2ecc71]' : 'text-[#f39c12]'
                }`}>{sys.status}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7a8291]">Uptime:</span>
                <span className="text-[#d4af37] font-bold">{sys.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8291]">Latência:</span>
                <span className="text-[#d4af37] font-bold">{sys.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
