'use client';

import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function JarvisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou Jarvis, seu assistente inteligente. Como posso ajudar você hoje?',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Entendi sua pergunta. Deixe-me analisar isso... Posso ajudar você com essa informação!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>⚡</span> Jarvis Assistant
        </h1>
        <p className="text-sm text-[#7a8291] mt-1">Seu assistente inteligente para gerenciamento administrativo</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#151d2a] border border-[#2a3647] rounded-[12px] p-6 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-xs ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-[#0f1419]'
                    : 'bg-[#1a2332] text-[#d4af37]'
                }`}>
                  {msg.role === 'assistant' ? 'J' : 'A'}
                </div>
                <div className={`rounded-lg p-3 ${
                  msg.role === 'assistant'
                    ? 'bg-[#1a2332] border border-[#2a3647] text-[#b0b8c1]'
                    : 'bg-[rgba(212,175,55,0.15)] border border-[#d4af37] text-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-[#7a8291] mt-2">
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-[#2a3647]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta para Jarvis..."
            className="flex-1 px-4 py-3 bg-[#1a2332] border border-[#2a3647] rounded-lg text-white placeholder-[#7a8291] focus:border-[#d4af37] focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#e8c547] text-[#0f1419] font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/30 transition-all flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>

      {/* Quick Commands */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          '💾 Backup status',
          '📊 Relatório mensal',
          '👥 Usuários ativos',
          '💰 Receita hoje',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => setInput(cmd.split(' ').slice(1).join(' '))}
            className="px-3 py-2 bg-[#1a2332] border border-[#2a3647] text-[#d4af37] text-xs font-bold rounded-lg hover:border-[#d4af37] hover:bg-[rgba(212,175,55,0.08)] transition-all"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
