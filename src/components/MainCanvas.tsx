import { useGraphState } from '@/hooks/useGraphState';
import { CanvasToolbar } from './CanvasToolbar';
import { GraphPlaceholder } from './GraphPlaceholder';
import { NodeContextPanel } from './NodeContextPanel';
import { ActionQueuePanel } from './ActionQueuePanel';
import { LegendPanel } from './LegendPanel';

export function MainCanvas() {
  const { graphData } = useGraphState();

  return (
    <main
      style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08080d' }}
      data-graph-loaded={graphData ? 'true' : 'false'}
    >
      <GraphPlaceholder />
      <CanvasToolbar />
      <NodeContextPanel />
      <ActionQueuePanel />
      <LegendPanel />
    </main>
  );
}
