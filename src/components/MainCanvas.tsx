import { useRef, useState, useMemo, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { GraphNode } from '@/types/graph.types';
import { useGraphState } from '@/hooks/useGraphState';
import { CanvasToolbar } from './CanvasToolbar';
import { GraphPlaceholder } from './GraphPlaceholder';
import { NodeContextPanel } from './NodeContextPanel';
import { ActionQueuePanel } from './ActionQueuePanel';
import { LegendPanel } from './LegendPanel';

export function MainCanvas() {
  const { graphData, setSelectedNode } = useGraphState();
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

  console.log('fgData nodes:', fgData.nodes.length);
  console.log('fgData links:', fgData.links.length);
  console.log('sample links:', fgData.links.slice(0, 3));

  return (
    <main
      style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08080d' }}
      data-graph-loaded={graphData ? 'true' : 'false'}
    >
      {graphData ? (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={fgData}
            backgroundColor="#08080d"
            nodeRelSize={1}
            cooldownTicks={120}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const n = node as GraphNode;
              const radius = n.val ?? 8;

              const colorMap: Record<string, string> = {
                user:      '#F4A742',
                person:    '#378ADD',
                company:   '#1D9E75',
                skill:     '#7F77DD',
                community: '#D85A30',
              };
              const color = colorMap[n.kind] ?? '#888';

              ctx.beginPath();
              ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.strokeStyle = 'rgba(255,255,255,0.15)';
              ctx.lineWidth = 0.5;
              ctx.stroke();

              if (globalScale > 0.6) {
                ctx.font = `${Math.max(3, 10 / globalScale)}px Inter, sans-serif`;
                ctx.fillStyle = 'rgba(255,255,255,0.65)';
                ctx.textAlign = 'center';
                ctx.fillText(n.name, node.x!, node.y! + radius + 5);
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
              if (link.warm) return 'rgba(244, 167, 66, 0.85)';
              const typeColors: Record<string, string> = {
                worked_at: 'rgba(29, 158, 117, 0.35)',
                knows:     'rgba(55, 138, 221, 0.30)',
                has_skill: 'rgba(127, 119, 221, 0.25)',
                member_of: 'rgba(216, 90, 48, 0.25)',
              };
              return typeColors[link.edgeType] ?? 'rgba(255,255,255,0.15)';
            }}
            linkWidth={(link: any) => {
              if (link.warm) return 2.5;
              if (link.edgeType === 'worked_at') return 1.2;
              if (link.edgeType === 'knows') return 1.0;
              return 0.6;
            }}
            onNodeClick={(node: any) => setSelectedNode(node as GraphNode)}
          />
        </div>
      ) : (
        <GraphPlaceholder />
      )}
      <CanvasToolbar />
      <NodeContextPanel />
      <ActionQueuePanel />
      <LegendPanel />
    </main>
  );
}
