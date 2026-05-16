import { Mail, Coffee, GitPullRequest } from 'lucide-react';
import { useGraphState } from '@/hooks/useGraphState';
import { useOutreach } from '@/hooks/useOutreach';
import { mockGraphData } from '@/data/mockGraphData';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NodeContextPanel() {
  const { selectedNode, activePath } = useGraphState();
  const { setOpen } = useOutreach();
  if (!selectedNode) return null;

  const warm = selectedNode.warmness ?? 0;
  const sharedSchool = selectedNode.university ?? 'Unknown';

  const mutualVia = (() => {
    const viaId = activePath.find(
      id => id !== selectedNode.id && mockGraphData.nodes.find(n => n.id === id)?.kind === 'person',
    );
    if (!viaId) return 'Direct connection';
    return mockGraphData.nodes.find(n => n.id === viaId)?.name ?? 'Direct connection';
  })();

  const hopsAway = activePath.length > 0 ? String(activePath.length - 1) : '—';

  return (
    <div style={{
      position: 'absolute', top: 58, right: 14, width: 190, zIndex: 30,
      background: 'rgba(16,16,22,0.96)', border: '0.5px solid rgba(255,255,255,0.09)',
      borderRadius: 12, padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'rgba(83,74,183,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, color: '#AFA9EC',
        }}>{initials(selectedNode.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.82)' }}>{selectedNode.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{selectedNode.sub}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>Warmness</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#F4A742' }}>{warm} / 100</span>
      </div>
      <div style={{ width: '100%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', marginBottom: 12 }}>
        <div style={{ width: `${warm}%`, height: '100%', borderRadius: 2, background: '#F4A742' }} />
      </div>

      {[
        ['Shared school', sharedSchool],
        ['Mutual via', mutualVia],
        ['Hops away', hopsAway],
        ['Response rate', '~68%'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{k}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{v}</span>
        </div>
      ))}

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <button onClick={() => setOpen(true)} className="nx-btn-primary" style={{
          width: '100%', padding: '7px 10px', borderRadius: 6,
          border: '0.5px solid rgba(244,167,66,0.40)', background: 'rgba(244,167,66,0.09)',
          color: '#F4A742', fontSize: 11, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 0.12s',
        }}>
          <Mail size={13} strokeWidth={1.8} /> Draft outreach
        </button>
        <SecondaryBtn icon={<Coffee size={13} strokeWidth={1.8} />}>Coffee chat request</SecondaryBtn>
        <SecondaryBtn icon={<GitPullRequest size={13} strokeWidth={1.8} />}>Request referral</SecondaryBtn>
      </div>
    </div>
  );
}

function SecondaryBtn({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button className="nx-btn-secondary" style={{
      width: '100%', padding: '7px 10px', borderRadius: 6,
      border: '0.5px solid rgba(255,255,255,0.10)', background: 'transparent',
      color: 'rgba(255,255,255,0.50)', fontSize: 11,
      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      fontFamily: 'inherit', transition: 'all 0.12s',
    }}>
      {icon}{children}
    </button>
  );
}
