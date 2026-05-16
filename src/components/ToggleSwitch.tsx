interface ToggleSwitchProps {
  enabled: boolean
  locked?: boolean
  onChange: () => void
}

export function ToggleSwitch({ enabled, locked = false, onChange }: ToggleSwitchProps) {
  return (
    <div
      onClick={e => {
        e.stopPropagation()
        if (!locked) onChange()
      }}
      style={{
        width: 28,
        height: 16,
        borderRadius: 8,
        background: enabled
          ? locked
            ? 'rgba(244,167,66,0.50)'
            : '#F4A742'
          : 'rgba(255,255,255,0.10)',
        position: 'relative',
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: 11,
        height: 11,
        borderRadius: '50%',
        background: enabled ? '#1a0e00' : 'rgba(255,255,255,0.35)',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: enabled ? 14 : 3,
        transition: 'left 0.2s, background 0.2s',
      }} />
    </div>
  )
}
