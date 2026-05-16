const rows = [
  { dot: '#F4A742', label: 'You' },
  { dot: '#378ADD', label: 'People' },
  { dot: '#1D9E75', label: 'Companies' },
  { dot: null, label: 'Warm path' },
];

export function LegendPanel() {
  return (
    <div style={{
      position: 'absolute', bottom: 14, right: 14, zIndex: 30,
      background: 'rgba(16,16,22,0.96)', border: '0.5px solid rgba(255,255,255,0.09)',
      borderRadius: 10, padding: '10px 12px',
    }}>
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.22)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
      }}>Legend</div>
      {rows.map((r, i) => (
        <div key={r.label} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          marginBottom: i === rows.length - 1 ? 0 : 5,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: r.dot ?? 'transparent',
            border: r.dot ? 'none' : '1px solid #F4A742',
          }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)' }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}
