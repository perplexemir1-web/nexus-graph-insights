import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { mockGraphData } from '@/data/mockGraphData';
import { useGraphState } from '@/hooks/useGraphState';

interface OnboardingCtx {
  open: boolean;
  step: number;
  isOnboardingComplete: boolean;
  next: () => void;
  back: () => void;
  close: () => void;
  completeOnboarding: () => void;
}

const Ctx = createContext<OnboardingCtx | null>(null);

function readShouldSkip(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has('demo') || params.has('skip');
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { loadGraphData } = useGraphState();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const completeOnboarding = useCallback(() => {
    setOpen(false);
    setIsOnboardingComplete(true);
    loadGraphData(mockGraphData);
  }, [loadGraphData]);

  useEffect(() => {
    if (!readShouldSkip()) return;
    setOpen(false);
    setIsOnboardingComplete(true);
    loadGraphData(mockGraphData);
  }, [loadGraphData]);

  const next = () => {
    if (step < 3) setStep(step + 1);
    else completeOnboarding();
  };
  const back = () => setStep(s => Math.max(1, s - 1));
  const close = () => setOpen(false);

  return (
    <Ctx.Provider value={{ open, step, isOnboardingComplete, next, back, close, completeOnboarding }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOnboarding() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOnboarding outside provider');
  return v;
}
