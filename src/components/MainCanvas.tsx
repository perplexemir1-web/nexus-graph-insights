import { CanvasToolbar } from './CanvasToolbar';
import { GraphPlaceholder } from './GraphPlaceholder';
import { NodeContextPanel } from './NodeContextPanel';
import { ActionQueuePanel } from './ActionQueuePanel';
import { LegendPanel } from './LegendPanel';

export function MainCanvas() {
  return (
    <main style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#08080d' }}>
      <GraphPlaceholder />
      <CanvasToolbar />
      <NodeContextPanel />
      <ActionQueuePanel />
      <LegendPanel />
    </main>
  );
}
