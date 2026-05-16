import { createContext, useContext, useState, ReactNode } from 'react';
import type { GraphNode } from '@/types/graph.types';
import type { MockGraphData } from '@/data/mockGraphData';

export type GapAnalysis = {
  fitScore: number
  hasSkills: string[]
  missingSkills: string[]
  quickestWin: string
  summary: string
  gapResources: Array<{
    skill: string
    action: string
    platform: string
    url: string
  }>
}

export type WarmPathPlan = {
  message: string
  weeks: Array<{
    week: number
    action: string
    reason: string
  }>
}

interface GraphStateCtx {
  selectedNode: GraphNode | null;
  setSelectedNode: (n: GraphNode | null) => void;
  activePath: string[];
  setActivePath: (path: string[]) => void;
  graphData: MockGraphData | null;
  loadGraphData: (data: MockGraphData) => void;
  activeFilters: Record<string, boolean>;
  toggleFilter: (k: string) => void;
  activeAgent: string;
  setActiveAgent: (k: string) => void;
  activeToolbar: string;
  setActiveToolbar: (k: string) => void;
  highlightedCompany: string | null;
  setHighlightedCompany: (k: string | null) => void;
  selectedCompany: GraphNode | null;
  setSelectedCompany: (n: GraphNode | null) => void;
  gapAnalysis: GapAnalysis | null;
  setGapAnalysis: (analysis: GapAnalysis | null) => void;
  isGeneratingGap: boolean;
  setIsGeneratingGap: (v: boolean) => void;
  warmPathPlan: WarmPathPlan | null;
  setWarmPathPlan: (plan: WarmPathPlan | null) => void;
  isGeneratingPlan: boolean;
  setIsGeneratingPlan: (v: boolean) => void;
  enabledAgents: Record<string, boolean>;
  toggleAgent: (key: string) => void;
  noPathFound: boolean;
  setNoPathFound: (v: boolean) => void;
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
  const [activePath, setActivePath] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<MockGraphData | null>(null);
  const [activeFilters, setFilters] = useState<Record<string, boolean>>({
    Companies: true, Alumni: true, Skills: false, Community: false,
  });
  const [activeAgent, setActiveAgent] = useState('Pathfinder');
  const [activeToolbar, setActiveToolbar] = useState('Path mode');
  const [highlightedCompany, setHighlightedCompany] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<GraphNode | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [isGeneratingGap, setIsGeneratingGap] = useState(false);
  const [warmPathPlan, setWarmPathPlan] = useState<WarmPathPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [noPathFound, setNoPathFound] = useState(false);
  const [enabledAgents, setEnabledAgents] = useState<Record<string, boolean>>({
    'Pathfinder': true,
    'Gap Analyser': false,
    'Cold → Warm': false,
    'Outreach writer': false,
    'Strategy agent': false,
  });

  const toggleAgent = (key: string) => {
    if (key === 'Pathfinder') return;
    setEnabledAgents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFilter = (k: string) => setFilters(f => ({ ...f, [k]: !f[k] }));
  const loadGraphData = (data: MockGraphData) => {
    setGraphData(data);
    const priya = data.nodes.find(n => n.id === 'priya');
    if (priya) setSelectedNode(priya);
  };

  return (
    <Ctx.Provider value={{
      selectedNode, setSelectedNode, activePath, setActivePath, graphData, loadGraphData,
      activeFilters, toggleFilter, activeAgent, setActiveAgent,
      activeToolbar, setActiveToolbar, highlightedCompany, setHighlightedCompany,
      selectedCompany, setSelectedCompany, gapAnalysis, setGapAnalysis,
      isGeneratingGap, setIsGeneratingGap, warmPathPlan, setWarmPathPlan,
      isGeneratingPlan, setIsGeneratingPlan,
      enabledAgents, toggleAgent,
      noPathFound, setNoPathFound,
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
