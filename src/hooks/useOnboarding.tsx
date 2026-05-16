import { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingCtx {
  open: boolean;
  step: number;
  next: () => void;
  back: () => void;
  close: () => void;
}

const Ctx = createContext<OnboardingCtx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < 3) setStep(step + 1);
    else setOpen(false);
  };
  const back = () => setStep(s => Math.max(1, s - 1));
  const close = () => setOpen(false);

  return <Ctx.Provider value={{ open, step, next, back, close }}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOnboarding outside provider');
  return v;
}
