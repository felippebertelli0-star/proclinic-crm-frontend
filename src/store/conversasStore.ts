import { create } from 'zustand';

interface ConversasStoreState {
  totalAtendendo: number;
  totalAguardando: number;
  totalGrupos: number;
  setConversasCounts: (atendendo: number, aguardando: number, grupos: number) => void;
}

export const useConversasStore = create<ConversasStoreState>((set) => ({
  totalAtendendo: 0,
  totalAguardando: 0,
  totalGrupos: 0,
  setConversasCounts: (atendendo: number, aguardando: number, grupos: number) =>
    set({
      totalAtendendo: atendendo,
      totalAguardando: aguardando,
      totalGrupos: grupos,
    }),
}));
