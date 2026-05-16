import { useRef, useState, useMemo, useEffect, lazy, Suspense } from 'react';

const ForceGraph2D = lazy(() => import('react-force-graph-2d'));
import type { GraphNode } from '@/types/graph.types';
import { useGraphState } from '@/hooks/useGraphState';
import { findWarmPath } from '@/utils/pathfinding';
import { DEMO_USER_ID } from '@/data/mockGraphData';
import { CanvasToolbar } from './CanvasToolbar';
import { GraphPlaceholder } from './GraphPlaceholder';
import { NodeContextPanel } from './NodeContextPanel';
import { ActionQueuePanel } from './ActionQueuePanel';
import { LegendPanel } from './LegendPanel';
import { GapAnalysisPanel } from './GapAnalysisPanel';
import { WarmPathPlanPanel } from './WarmPathPlanPanel';
import { generateWarmPathPlanFn, generateGapAnalysisFn } from '@/lib/outreach';

export function MainCanvas() {
  const {
    graphData,
    selectedNode,
    setSelectedNode,
    activePath,
    setActivePath,
    setSelectedCompany,
    setWarmPathPlan,
    setIsGeneratingPlan,
    setGapAnalysis,
    setIsGeneratingGap,
  } = useGraphState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [graphData]);

  const fgData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    return {
      nodes: graphData.nodes.map(n => ({ ...n })),
      links: graphData.edges.map(e => ({
        source: e.from,
        target: e.to,
        warm: e.warm ?? false,
        weight: e.weight ?? 0.5,
        edgeType: e.edgeType ?? 'knows',
      })),
    };
  }, [graphData]);

  return (
    <main
      style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08080d' }}
      data-graph-loaded={graphData ? 'true' : 'false'}
    >
      {graphData ? (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <Suspense fallback={null}>
            <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={fgData}
            backgroundColor="#08080d"
            nodeRelSize={1}
            cooldownTicks={120}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const n = node as GraphNode;
              const isOnPath = activePath.includes(n.id);
              const isSelected = selectedNode?.id === n.id;
              const hasActivePath = activePath.length > 0;

              // Dim nodes not on path when a path is active
              const dimmed = hasActivePath && !isOnPath;

              const baseRadius = n.val ?? 8;
              const radius = isOnPath ? baseRadius + 3 : baseRadius;

              const colorMap: Record<string, string> = {
                user:      '#F4A742',
                person:    '#378ADD',
                company:   '#1D9E75',
                skill:     '#7F77DD',
                community: '#D85A30',
              };
              const baseColor = colorMap[n.kind] ?? '#888';

              // Draw outer glow ring for path nodes
              if (isOnPath) {
                ctx.beginPath();
                ctx.arc(node.x!, node.y!, radius + 4, 0, 2 * Math.PI);
                ctx.fillStyle = n.kind === 'company'
                  ? 'rgba(29,158,117,0.20)'
                  : 'rgba(244,167,66,0.18)';
                ctx.fill();
              }

              // Draw main circle
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
              ctx.fillStyle = dimmed
                ? 'rgba(255,255,255,0.08)'
                : baseColor;
              ctx.globalAlpha = dimmed ? 0.3 : 1.0;
              ctx.fill();
              ctx.globalAlpha = 1.0;
              ctx.strokeStyle = isOnPath
                ? '#F4A742'
                : isSelected
                  ? 'rgba(255,255,255,0.6)'
                  : 'rgba(255,255,255,0.12)';
              ctx.lineWidth = isOnPath ? 1.5 : 0.5;
              ctx.stroke();

              // Draw warmness badge above path person nodes
              if (isOnPath && n.kind === 'person' && n.warmness) {
                const badgeY = node.y! - radius - 10;
                ctx.beginPath();
                ctx.arc(node.x!, badgeY, 8, 0, 2 * Math.PI);
                ctx.fillStyle = '#F4A742';
                ctx.fill();
                ctx.font = `bold ${Math.max(5, 8 / globalScale)}px Inter`;
                ctx.fillStyle = '#1a0e00';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(n.warmness), node.x!, badgeY);
              }

              // Draw label
              if (globalScale > 0.5 || isOnPath) {
                const fontSize = Math.max(3, 10 / globalScale);
                ctx.font = `${isOnPath ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
                ctx.fillStyle = dimmed
                  ? 'rgba(255,255,255,0.20)'
                  : isOnPath
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.65)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(n.name, node.x!, node.y! + radius + 3);
              }
            }}
            nodePointerAreaPaint={(node: any, color, ctx) => {
              const radius = (node.val ?? 8) + 4;
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
              ctx.fill();
            }}
            linkDirectionalParticles={0}
            linkCurvature={0.1}
            linkColor={(link: any) => {
              const src = typeof link.source === 'object' ? link.source.id : link.source;
              const tgt = typeof link.target === 'object' ? link.target.id : link.target;
              const isOnPath = activePath.length > 0
                && activePath.includes(src)
                && activePath.includes(tgt);

              if (isOnPath) return 'rgba(244, 167, 66, 0.90)';

              if (activePath.length > 0) return 'rgba(255,255,255,0.03)';

              const typeColors: Record<string, string> = {
                worked_at: 'rgba(29, 158, 117, 0.35)',
                knows:     'rgba(55, 138, 221, 0.30)',
                has_skill: 'rgba(127, 119, 221, 0.25)',
                member_of: 'rgba(216, 90, 48, 0.25)',
              };
              return typeColors[link.edgeType] ?? 'rgba(255,255,255,0.15)';
            }}
            linkWidth={(link: any) => {
              const src = typeof link.source === 'object' ? link.source.id : link.source;
              const tgt = typeof link.target === 'object' ? link.target.id : link.target;
              const isOnPath = activePath.length > 0
                && activePath.includes(src)
                && activePath.includes(tgt);

              if (isOnPath) return 3;
              if (activePath.length > 0) return 0.2;
              if (link.edgeType === 'worked_at') return 1.2;
              return 0.8;
            }}
            onNodeClick={(node: any) => {
              const n = node as GraphNode;

              if (n.kind === 'company') {
                if (!graphData) return;
                setSelectedCompany(n);
                const path = findWarmPath(graphData, DEMO_USER_ID, n.id);
                setActivePath(path);
                setSelectedNode(null);

                if (path.length === 0) {
                  setWarmPathPlan(null);
                  setIsGeneratingPlan(true);
                  setGapAnalysis(null);
                  setIsGeneratingGap(false);

                  const existingConnections = graphData.nodes
                    .filter(node => node.kind === 'person')
                    .map(node => node.name)
                    .slice(0, 6);

                  generateWarmPathPlanFn({
                    data: {
                      companyName: n.name,
                      userProfile: {
                        name: 'Ahmad Kamal',
                        university: 'University of Malaya',
                        skills: ['Machine Learning', 'React', 'Python'],
                      },
                      existingConnections,
                    },
                  })
                    .then(result => {
                      setWarmPathPlan(result.plan);
                    })
                    .catch(e => {
                      console.error('Warm path plan failed:', e);
                    })
                    .finally(() => {
                      setIsGeneratingPlan(false);
                    });
                } else {
                  setWarmPathPlan(null);
                  setIsGeneratingPlan(false);
                  setGapAnalysis(null);
                  setIsGeneratingGap(true);

                  const pathContactNames = path
                    .map(id => graphData.nodes.find(node => node.id === id)?.name)
                    .filter((name): name is string => Boolean(name));

                  generateGapAnalysisFn({
                    data: {
                      companyName: n.name,
                      userProfile: {
                        name: 'Ahmad Kamal',
                        university: 'University of Malaya',
                        skills: ['Machine Learning', 'React', 'Python'],
                        targetRole: 'Software Engineer',
                      },
                      pathContactNames,
                    },
                  })
                    .then(result => {
                      setGapAnalysis(result.analysis);
                    })
                    .catch(e => {
                      console.error('Gap analysis failed:', e);
                    })
                    .finally(() => {
                      setIsGeneratingGap(false);
                    });
                }
              } else if (n.kind === 'person') {
                setSelectedNode(n);
                setActivePath([]);
              } else {
                setSelectedNode(n);
                setActivePath([]);
              }
            }}
            onBackgroundClick={() => {
              setActivePath([]);
              setSelectedNode(null);
              setSelectedCompany(null);
              setWarmPathPlan(null);
              setIsGeneratingPlan(false);
              setGapAnalysis(null);
              setIsGeneratingGap(false);
            }}
          />
          </Suspense>
        </div>
      ) : (
        <GraphPlaceholder />
      )}
      <CanvasToolbar />
      <NodeContextPanel />
      <ActionQueuePanel />
      <LegendPanel />
      <GapAnalysisPanel />
      <WarmPathPlanPanel />
    </main>
  );
}
