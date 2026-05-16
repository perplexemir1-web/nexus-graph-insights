import { createContext, useContext, useState, ReactNode } from 'react';

interface OutreachCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  msgType: string;
  setMsgType: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
}

const Ctx = createContext<OutreachCtx | null>(null);

export function OutreachProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msgType, setMsgType] = useState('LinkedIn DM');
  const [tone, setTone] = useState('Warm');
  return (
    <Ctx.Provider value={{ open, setOpen, msgType, setMsgType, tone, setTone }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOutreach() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOutreach outside provider');
  return v;
}
