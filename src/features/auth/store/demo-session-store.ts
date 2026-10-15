import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_PERSONAS } from '@/auth';

export type DemoPersonaId = 'user_elena_vance' | 'user_arjun_mehta' | 'user_chloe_lin' | 'user_pioneer_labs';

export interface SimulatedPaymentResult {
  transactionId: string;
  vaultTransferId: string;
  grossAmountCents: number;
  taxWithheldCents: number;
  netOperatingCents: number;
  withholdingRateBps: number;
  currency: string;
  counterparty: string;
  timestamp: number;
}

interface DemoSessionState {
  activePersonaId: string;
  quarterOffset: number; // 0 = Q2 2025 (current), 1 = Q3, 2 = Q4, etc.
  isSimulating: boolean;
  lastSimulation: SimulatedPaymentResult | null;
  
  // Actions
  setActivePersonaId: (id: string) => void;
  advanceQuarter: () => void;
  resetQuarter: () => void;
  setIsSimulating: (val: boolean) => void;
  setLastSimulation: (result: SimulatedPaymentResult | null) => void;
  getActivePersona: () => typeof DEMO_PERSONAS[0];
}

export const useDemoSessionStore = create<DemoSessionState>()(
  persist(
    (set, get) => ({
      activePersonaId: 'user_elena_vance',
      quarterOffset: 0,
      isSimulating: false,
      lastSimulation: null,

      setActivePersonaId: (id) => set({ activePersonaId: id }),
      advanceQuarter: () => set((state) => ({ quarterOffset: (state.quarterOffset + 1) % 4 })),
      resetQuarter: () => set({ quarterOffset: 0 }),
      setIsSimulating: (isSimulating) => set({ isSimulating }),
      setLastSimulation: (lastSimulation) => set({ lastSimulation }),
      
      getActivePersona: () => {
        const id = get().activePersonaId;
        const found = DEMO_PERSONAS.find((p) => p.id === id);
        return found || DEMO_PERSONAS[0];
      },
    }),
    {
      name: 'solofi-demo-session',
      partialize: (state) => ({
        activePersonaId: state.activePersonaId,
        quarterOffset: state.quarterOffset,
      }),
    }
  )
);
