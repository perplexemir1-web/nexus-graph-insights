import { RefreshCw } from 'lucide-react';
import { useActionQueue } from '@/hooks/useActionQueue';
import { useGraphState } from '@/hooks/useGraphState';

function ActionText({ action, boldName }: { action: string; boldName: string }) {
  if (!action.includes(boldName)) {
    return <span>{action}</span>;
  }
  const parts = action.split(boldName);
  return (
    <>
      {parts[0]}
      <span style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>{boldName}</span>
      {parts[1]}
    </>
  );
}

export function ActionQueuePanel() {
  const { actions, isLoading } = useActionQueue();
  const { enabledAgents } = useGraphState();

  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 14, width: 210, zIndex: 30,
      background: 'rgba(16,16,22,0.96)', border: '0.5px solid rgba(255,255,255,0.09)',
      borderRadius: 12, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.07em', textTransform: 'uppercase',
        }}>Today's moves</span>
        <button className="nx-icon-btn" style={{
          width: 22, height: 22, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', borderRadius: 4,
        }}>
          <RefreshCw size={14} color="rgba(255,255,255,0.22)" strokeWidth={1.8} />
        </button>
      </div>
      {isLoading && actions.length === 0
        ? [1, 2, 3].map((n, i) => (
            <div key={n} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              marginBottom: i === 2 ? 0 : 8,
            }}>
              <div style={{
                width: 17, height: 17, flexShrink: 0, marginTop: 1, borderRadius: 4,
                background: 'rgba(244,167,66,0.12)',
              }} />
              <div style={{
                flex: 1, height: 28, background: 'rgba(255,255,255,0.05)',
                borderRadius: 4,
              }} />
            </div>
          ))
        : actions.length === 0 && !isLoading && !enabledAgents['Strategist']
          ? (
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.22)',
              lineHeight: 1.6,
              padding: '2px 0',
            }}>
              Enable{' '}
              <span style={{ color: '#F4A742', fontWeight: 500 }}>
                Strategist
              </span>
              {' '}in the sidebar to generate your personalised
              daily networking moves.
            </div>
          )
        : actions.map((action, i) => (
            <div key={action.priority} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              marginBottom: i === actions.length - 1 ? 0 : 8,
            }}>
              <div style={{
                width: 17, height: 17, flexShrink: 0, marginTop: 1, borderRadius: 4,
                background: 'rgba(244,167,66,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 600, color: '#F4A742',
              }}>{action.priority}</div>
              <div style={{ fontSize: 11, lineHeight: 1.45, color: 'rgba(255,255,255,0.45)' }}>
                <ActionText action={action.action} boldName={action.boldName} />
              </div>
            </div>
          ))}
    </div>
  );
}
