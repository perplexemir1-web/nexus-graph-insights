import { Bell, Settings } from 'lucide-react';

export function TopBar() {
  return (
    <div style={{
      height: 44, background: '#0c0c10',
      borderBottom: '0.5px solid rgba(255,255,255,0.07)',
      padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      zIndex: 100, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: '#F4A742',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#412402', fontSize: 12, fontWeight: 700,
        }}>✦</div>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '0.02em' }}>Nexus</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button className="nx-icon-btn" style={iconBtn}>
          <Bell size={17} color="rgba(255,255,255,0.35)" strokeWidth={1.7} />
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#F4A742',
            position: 'absolute', top: 7, right: 7,
          }} />
        </button>
        <button className="nx-icon-btn" style={iconBtn}>
          <Settings size={17} color="rgba(255,255,255,0.35)" strokeWidth={1.7} />
        </button>
        <div style={{ width: '0.5px', height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: 'rgba(225,245,238,0.9)', cursor: 'pointer',
        }}>AK</div>
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: 6, border: 'none', background: 'transparent',
  cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
