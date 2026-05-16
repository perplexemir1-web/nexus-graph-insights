import { RefreshCw } from 'lucide-react';

const items = [
  { n: 1, parts: ['Message ', { hi: 'James T.' }, ' — UM alum, warm path to Google'] },
  { n: 2, parts: ['Join ', { hi: '#ml-malaysia' }, ' Slack — bridges 2 community nodes'] },
  { n: 3, parts: ['Follow up with ', { hi: 'Priya S.' }, ' — no reply in 5 days'] },
] as const;

export function ActionQueuePanel() {
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
      {items.map((it, i) => (
        <div key={it.n} style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          marginBottom: i === items.length - 1 ? 0 : 8,
        }}>
          <div style={{
            width: 17, height: 17, flexShrink: 0, marginTop: 1, borderRadius: 4,
            background: 'rgba(244,167,66,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 600, color: '#F4A742',
          }}>{it.n}</div>
          <div style={{ fontSize: 11, lineHeight: 1.45, color: 'rgba(255,255,255,0.45)' }}>
            {it.parts.map((p, j) =>
              typeof p === 'string'
                ? <span key={j}>{p}</span>
                : <span key={j} style={{ color: 'rgba(255,255,255,0.78)', fontWeight: 500 }}>{p.hi}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
