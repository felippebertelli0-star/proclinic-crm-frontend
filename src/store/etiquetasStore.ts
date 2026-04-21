import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Etiqueta {
  id: string;
  nome: string;
  cor: string; // Hex string: "#c9943a"
  descricao?: string;
  createdAt: Date;
}

interface EtiquetasState {
  etiquetas: Etiqueta[];
  addEtiqueta: (nome: string, cor: string, descricao?: string) => void;
  deleteEtiqueta: (id: string) => void;
  updateEtiqueta: (id: string, nome: string, cor: string, descricao?: string) => void;
  getEtiquetaById: (id: string) => Etiqueta | undefined;
}

// Cores padrão para sugestão
export const CORES_PADRAO = [
  '#c9943a', // Ouro
  '#3498db', // Azul
  '#2ecc71', // Verde
  '#e74c3c', // Vermelho
  '#9b59b6', // Roxo
  '#f39c12', // Laranja
  '#1abc9c', // Turquesa
  '#34495e', // Cinza escuro
];

export const useEtiquetasStore = create<EtiquetasState>()(
  persist(
    (set, get) => ({
      etiquetas: [
        {
          id: 'etiqueta-1',
          nome: 'Urgente',
          cor: '#e74c3c',
          createdAt: new Date(),
        },
        {
          id: 'etiqueta-2',
          nome: 'Importante',
          cor: '#f39c12',
          createdAt: new Date(),
        },
        {
          id: 'etiqueta-3',
          nome: 'Rotina',
          cor: '#3498db',
          createdAt: new Date(),
        },
      ],

      addEtiqueta: (nome: string, cor: string, descricao?: string) => {
        const id = `etiqueta-${Date.now()}`;
        set((state) => ({
          etiquetas: [
            ...state.etiquetas,
            {
              id,
              nome,
              cor,
              descricao,
              createdAt: new Date(),
            },
          ],
        }));
      },

      deleteEtiqueta: (id: string) => {
        set((state) => ({
          etiquetas: state.etiquetas.filter((e) => e.id !== id),
        }));
      },

      updateEtiqueta: (id: string, nome: string, cor: string, descricao?: string) => {
        set((state) => ({
          etiquetas: state.etiquetas.map((e) =>
            e.id === id ? { ...e, nome, cor, descricao: descricao || e.descricao } : e
          ),
        }));
      },

      getEtiquetaById: (id: string) => {
        return get().etiquetas.find((e) => e.id === id);
      },
    }),
    {
      name: 'etiquetas-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);
