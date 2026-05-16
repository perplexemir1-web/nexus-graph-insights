import { Route as RouteIcon, LayoutGrid, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useGraphState } from '@/hooks/useGraphState';

export function CanvasToolbar() {
  const { activeToolbar, setActiveToolbar } = useGraphState();
  const isActive = (k: string) => activeToolbar === k;

  return (
    <div style={{
      position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
      zIndex: 20, display: 'flex', alignItems: 'center', gap: 3,
      background: 'rgba(18,18,26,0.92)', border: '0.5px solid rgba(255,255,255,0.09)',
      borderRadius: 9, padding: 4,
    }}>
      <ToolBtn active={isActive('Path mode')} onClick={() => setActiveToolbar('Path mode')}>
        <RouteIcon size={16} strokeWidth={1.7} /> Path mode
      </ToolBtn>
      <Sep />
      <ToolBtn active={isActive('Cluster view')} onClick={() => setActiveToolbar('Cluster view')}>
        <LayoutGrid size={16} strokeWidth={1.7} /> Cluster view
      </ToolBtn>
      <Sep />
      <ToolBtn title="Zoom in"><ZoomIn size={16} strokeWidth={1.7} /></ToolBtn>
      <ToolBtn title="Zoom out"><ZoomOut size={16} strokeWidth={1.7} /></ToolBtn>
      <Sep />
      <ToolBtn title="Reset graph"><RotateCcw size={16} strokeWidth={1.7} /></ToolBtn>
    </div>
  );
}

function Sep() {
  return <div style={{ width: '0.5px', height: 16, background: 'rgba(255,255,255,0.07)', margin: '0 2px' }} />;
}

function ToolBtn({ children, active, onClick, title }: { children: React.ReactNode; active?: boolean; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} className={active ? '' : 'nx-toolbar-btn'} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 6, fontSize: 11,
      color: active ? '#F4A742' : 'rgba(255,255,255,0.40)',
      cursor: 'pointer', whiteSpace: 'nowrap',
      background: active ? 'rgba(244,167,66,0.12)' : 'transparent',
      border: 'none', fontFamily: 'inherit',
    }}>
      {children}
    </button>
  );
}
