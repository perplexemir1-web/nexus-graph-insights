import { useState, useEffect } from 'react';
import { Upload, Check, Loader2, Circle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

export function OnboardingModal() {
  const { open, step, next, back } = useOnboarding();
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 460, background: '#0e0e14',
        border: '0.5px solid rgba(255,255,255,0.10)',
        borderRadius: 14, padding: '28px 32px', position: 'relative',
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: step === i ? 20 : 5, height: 5,
              borderRadius: step === i ? 3 : '50%',
              background: step === i ? '#F4A742' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button onClick={back} className="nx-modal-back" style={{
              fontSize: 12, color: 'rgba(255,255,255,0.30)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'color 0.12s',
            }}>← Back</button>
          ) : <span />}
          <button onClick={next} className="nx-modal-cta" style={{
            padding: '9px 20px', borderRadius: 7, background: '#F4A742',
            color: '#1a0e00', fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.12s',
          }}>{step === 3 ? 'Enter Nexus' : 'Continue'}</button>
        </div>
      </div>
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.88)', margin: '0 0 6px' }}>{children}</h2>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6, margin: '0 0 24px' }}>{children}</p>;
}

function Step1() {
  return (
    <>
      <Title>Build your network map</Title>
      <Sub>Upload your resume and connect your profiles. Nexus builds your professional graph in seconds.</Sub>
      <div className="nx-upload" style={{
        width: '100%', height: 90, border: '1px dashed rgba(255,255,255,0.12)',
        borderRadius: 8, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
        cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
        transition: 'all 0.12s',
      }}>
        <Upload size={20} color="rgba(255,255,255,0.25)" strokeWidth={1.7} />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Drop your resume PDF here</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.20)' }}>or click to browse</div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="LinkedIn URL" placeholder="https://linkedin.com/in/yourname" />
        <Field label="GitHub URL" placeholder="https://github.com/yourusername" />
      </div>
    </>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <div style={{
        fontSize: 10, color: 'rgba(255,255,255,0.30)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
      }}>{label}</div>
      <input className="nx-input" placeholder={placeholder} style={{
        width: '100%', height: 36, background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.10)', borderRadius: 6,
        padding: '0 12px', fontSize: 12, color: 'rgba(255,255,255,0.65)',
        fontFamily: 'inherit',
      }} />
    </div>
  );
}

const allCompanies = ['Google', 'Stripe', 'Grab', 'Shopee', 'GoTo', 'Airbnb', 'Meta', 'ByteDance'];

function Step2() {
  const [selected, setSelected] = useState<string[]>(['Google', 'Stripe', 'Grab']);
  const toggle = (c: string) =>
    setSelected(s => s.includes(c) ? s.filter(x => x !== c) : s.length < 5 ? [...s, c] : s);
  return (
    <>
      <Title>Where do you want to work?</Title>
      <Sub>Select up to 5 companies. Nexus will map your shortest warm path into each.</Sub>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {allCompanies.map(c => {
          const on = selected.includes(c);
          return (
            <div key={c} onClick={() => toggle(c)} style={{
              padding: '9px 12px', borderRadius: 7,
              border: on ? '0.5px solid rgba(29,158,117,0.50)' : '0.5px solid rgba(255,255,255,0.09)',
              background: on ? 'rgba(29,158,117,0.07)' : 'transparent',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', fontSize: 12,
              color: on ? 'rgba(93,202,165,0.90)' : 'rgba(255,255,255,0.50)',
              transition: 'all 0.12s',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: on ? '#1D9E75' : 'rgba(255,255,255,0.15)',
              }} />
              {c}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Step3() {
  const { step, completeOnboarding } = useOnboarding();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const labels = [
    'Parsing resume and GitHub profile',
    'Mapping university alumni network',
    'Scoring connection warmness',
    'Generating referral pathways',
  ];

  useEffect(() => {
    if (step !== 3) return;

    setCompletedSteps([]);
    const timings = [800, 1600, 2400, 3200];
    const timers: ReturnType<typeof setTimeout>[] = [];

    timings.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, i]);
          if (i === labels.length - 1) {
            timers.push(setTimeout(() => completeOnboarding(), 600));
          }
        }, delay),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [step, completeOnboarding]);

  return (
    <>
      <Title>Building your network graph</Title>
      <Sub>Analysing your background and mapping connections...</Sub>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {labels.map((label, i) => {
          const state = completedSteps.includes(i)
            ? 'done'
            : i === completedSteps.length
              ? 'active'
              : 'pending';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {state === 'done' && <Check size={14} color="#1D9E75" strokeWidth={2.2} />}
              {state === 'active' && <Loader2 size={14} color="#F4A742" strokeWidth={2.2} className="nx-spin" />}
              {state === 'pending' && <Circle size={14} color="rgba(255,255,255,0.15)" strokeWidth={1.5} />}
              <span style={{
                fontSize: 12,
                color: state === 'done' ? 'rgba(255,255,255,0.55)' :
                       state === 'active' ? 'rgba(255,255,255,0.80)' :
                       'rgba(255,255,255,0.25)',
              }}>{label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
