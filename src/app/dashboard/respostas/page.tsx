'use client';

export default function RespostasPage() {
  const responses = [
    { shortcut: '/ol', text: 'Olá! Como posso ajudar você?' },
    { shortcut: '/ag', text: 'Gostaria de agendar uma consulta?' },
    { shortcut: '/info', text: 'Qual informação você precisa?' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Respostas Rápidas</h1>
        <p className="text-sm text-slate-400 mt-1">Templates para responder rápido</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {responses.map((r) => (
          <div key={r.shortcut} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="text-[#c9943a] font-bold text-sm mb-2">{r.shortcut}</div>
            <p className="text-sm text-white">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
