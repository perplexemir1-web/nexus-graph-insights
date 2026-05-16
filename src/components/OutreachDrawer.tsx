import { useState } from 'react';
import { X, RefreshCw, Copy, Check } from 'lucide-react';
import { useOutreach } from '@/hooks/useOutreach';

const defaultMsg = "Hi Priya, I came across your profile while exploring the ML engineering space at Google. I'm a CS grad from UM and noticed we share the same alma mater — small world! I've been working on [X] and would love to hear how you navigated the transition into Google. Would you be open to a quick 15-min chat? No agenda, just curious to learn from your experience.";

export function OutreachDrawer() {
  const { open, setOpen, msgType, setMsgType, tone, setTone } = useOutreach();
  const [msg, setMsg] = useState(defaultMsg);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div style={{
      width: 360, height: 'calc(100vh - 44px)',
      position: 'fixed', right: 0, top: 44, background: '#0e0e14',
      borderLeft: '0.5px solid rgba(255,255,255,0.08)', zIndex: 80,
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 18px', borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.80)' }}>Outreach generator</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Priya Sharma · Google</div>
        </div>
        <button onClick={() => setOpen(false)} className="nx-icon-btn" style={{
          width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4,
        }}>
          <X size={20} color="rgba(255,255,255,0.30)" strokeWidth={1.8} />
        </button>
      </div>

      {/* Body */}
      <div className="nx-scroll" style={{
        padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14,
        overflowY: 'auto', flex: 1,
      }}>
        <PillGroup options={['LinkedIn DM', 'Coffee chat', 'Referral ask']} value={msgType} onChange={setMsgType} />

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)',
          borderRadius: 7, padding: '10px 12px',
        }}>
          <div style={{
            fontSize: 9, color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7,
          }}>Using these details</div>
          <DRow k="Shared school" v="University of Malaya, CS" />
          <DRow k="Mutual contact" v="James Tan" last />
        </div>

        <div>
          <Label>Generated message</Label>
          <textarea className="nx-textarea" value={msg} onChange={e => setMsg(e.target.value)} style={{
            width: '100%', minHeight: 140, background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.10)', borderRadius: 7,
            padding: 12, fontSize: 12, color: 'rgba(255,255,255,0.70)',
            lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit',
          }} />
        </div>

        <div>
          <Label>Tone</Label>
          <PillGroup options={['Warm', 'Formal', 'Bold']} value={tone} onChange={setTone} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button className="nx-btn-secondary" style={{
            flex: 1, padding: 8, borderRadius: 6,
            border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent',
            color: 'rgba(255,255,255,0.50)', fontSize: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
          }}>
            <RefreshCw size={13} strokeWidth={1.8} /> Regenerate
          </button>
          <button onClick={onCopy} className="nx-modal-cta" style={{
            flex: 1, padding: 8, borderRadius: 6, background: '#F4A742',
            color: '#1a0e00', fontSize: 11, fontWeight: 600, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s',
          }}>
            {copied ? <><Check size={13} strokeWidth={2.2} /> Copied!</> : <><Copy size={13} strokeWidth={1.8} /> Copy message</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{
    fontSize: 10, color: 'rgba(255,255,255,0.28)',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6,
  }}>{children}</div>;
}

function DRow({ k, v, last }: { k: string; v: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: last ? 0 : 5 }}>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{k}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.60)' }}>{v}</span>
    </div>
  );
}

function PillGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(o => {
        const active = value === o;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            fontSize: 11, padding: '5px 12px', borderRadius: 10, cursor: 'pointer',
            border: active ? '0.5px solid rgba(244,167,66,0.40)' : '0.5px solid rgba(255,255,255,0.10)',
            background: active ? 'rgba(244,167,66,0.12)' : 'transparent',
            color: active ? '#F4A742' : 'rgba(255,255,255,0.40)',
            fontFamily: 'inherit', transition: 'all 0.12s',
          }}>{o}</button>
        );
      })}
    </div>
  );
}
