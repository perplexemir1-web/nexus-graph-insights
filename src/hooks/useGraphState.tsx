import { createContext, useContext, useState, ReactNode } from 'react';
import type { GraphNode } from '@/types/graph.types';

interface GraphStateCtx {
  selectedNode: GraphNode | null;
  setSelectedNode: (n: GraphNode | null) => void;
  activeFilters: Record<string, boolean>;
  toggleFilter: (k: string) => void;
  activeAgent: string;
  setActiveAgent: (k: string) => void;
  activeToolbar: string;
  setActiveToolbar: (k: string) => void;
  highlightedCompany: string | null;
  setHighlightedCompany: (k: string | null) => void;
}

const Ctx = createContext<GraphStateCtx | null>(null);

const defaultNode: GraphNode = {
  id: 'priya',
  name: 'Priya Sharma',
  kind: 'person',
  sub: 'SWE II · Google',
  warmness: 78,
};

export function GraphStateProvider({ children }: { children: ReactNode }) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(defaultNode);
  const [activeFilters, setFilters] = useState<Record<string, boolean>>({
    Companies: true, Alumni: true, Skills: false, Community: false,
  });
  const [activeAgent, setActiveAgent] = useState('Pathfinder');
  const [activeToolbar, setActiveToolbar] = useState('Path mode');
  const [highlightedCompany, setHighlightedCompany] = useState<string | null>(null);

  const toggleFilter = (k: string) => setFilters(f => ({ ...f, [k]: !f[k] }));

  return (
    <Ctx.Provider value={{
      selectedNode, setSelectedNode, activeFilters, toggleFilter,
      activeAgent, setActiveAgent, activeToolbar, setActiveToolbar,
      highlightedCompany, setHighlightedCompany,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGraphState() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGraphState outside provider');
  return v;
}
