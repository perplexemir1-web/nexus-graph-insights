import { Route, Flame, Send, Crown, Building2, Users, Code2, Globe, Plus } from 'lucide-react';
import { useGraphState } from '@/hooks/useGraphState';

const agents = [
  { key: 'Pathfinder', icon: Route, badge: 'live' },
  { key: 'Warmness scorer', icon: Flame },
  { key: 'Outreach writer', icon: Send },
  { key: 'Strategy agent', icon: Crown },
];

const filters = [
  { key: 'Companies', icon: Building2 },
  { key: 'Alumni', icon: Users },
  { key: 'Skills', icon: Code2 },
  { key: 'Community', icon: Globe },
];

const companies = [
  { name: 'Google', color: '#378ADD' },
  { name: 'Stripe', color: '#7F77DD' },
  { name: 'Grab', color: '#F4A742' },
];

export function Sidebar() {
  const { activeAgent, setActiveAgent, activeFilters, toggleFilter, highlightedCompany, setHighlightedCompany } = useGraphState();

  return (
    <aside className="nx-scroll" style={{
      width: 224, background: '#0e0e14',
      borderRight: '0.5px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 0', overflowY: 'auto', flexShrink: 0,
    }}>
      {/* AI Agents */}
      <div style={section}>
        <div style={sectionLabel}>AI Agents</div>
        {agents.map(a => {
          const Icon = a.icon;
          const active = activeAgent === a.key;
          return (
            <div key={a.key} onClick={() => setActiveAgent(a.key)}
              className={active ? '' : 'nx-hover-bg'}
              style={{
                ...itemBase,
                background: active ? 'rgba(244,167,66,0.10)' : 'transparent',
                color: active ? '#F4A742' : 'rgba(255,255,255,0.45)',
              }}>
              <Icon size={16} strokeWidth={1.7} />
              <span>{a.key}</span>
              {a.badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, padding: '2px 7px', borderRadius: 10,
                  background: 'rgba(244,167,66,0.15)', color: '#F4A742',
                }}>{a.badge}</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.05)', margin: '2px 12px 16px' }} />

      {/* Filters */}
      <div style={section}>
        <div style={sectionLabel}>Filters</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12, paddingLeft: 6 }}>
          {filters.map(f => {
            const Icon = f.icon;
            const on = activeFilters[f.key];
            return (
              <button key={f.key} onClick={() => toggleFilter(f.key)}
                className={on ? '' : 'nx-chip-off'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, padding: '4px 9px', borderRadius: 10, cursor: 'pointer',
                  border: on ? '0.5px solid rgba(29,158,117,0.45)' : '0.5px solid rgba(255,255,255,0.10)',
                  color: on ? '#5DCAA5' : 'rgba(255,255,255,0.38)',
                  background: on ? 'rgba(29,158,117,0.08)' : 'transparent',
                  transition: 'all 0.12s', fontFamily: 'inherit',
                }}>
                <Icon size={12} strokeWidth={1.8} />
                {f.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Companies */}
      <div style={section}>
        <div style={sectionLabel}>Target companies</div>
        {companies.map(c => (
          <div key={c.name} onClick={() => setHighlightedCompany(highlightedCompany === c.name ? null : c.name)}
            className="nx-hover-bg"
            style={{
              ...itemBase,
              color: highlightedCompany === c.name ? 'rgba(255,255,255,0.80)' : 'rgba(255,255,255,0.50)',
            }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
            <span>{c.name}</span>
          </div>
        ))}
        <div className="nx-add-company" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 8px', fontSize: 11, color: 'rgba(255,255,255,0.22)',
          cursor: 'pointer', borderRadius: 6, transition: 'all 0.12s',
        }}>
          <Plus size={12} strokeWidth={1.8} />
          Add company
        </div>
      </div>

      {/* Identity card */}
      <div style={{ marginTop: 'auto', padding: 12 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: '#1D9E75',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: 'rgba(225,245,238,0.9)', flexShrink: 0,
          }}>AK</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>Ahmad Kamal</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>CS Graduate · UM</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const section: React.CSSProperties = { padding: '0 12px', marginBottom: 20 };
const sectionLabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.25)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  paddingLeft: 6, marginBottom: 6,
};
const itemBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 9,
  padding: '7px 8px', borderRadius: 6, cursor: 'pointer',
  fontSize: 12, marginBottom: 1, transition: 'background 0.12s, color 0.12s',
};
