import { useGraphState } from '@/hooks/useGraphState'
import { TypingText } from './TypingText'

export function WarmPathPlanPanel() {
  const {
    selectedCompany,
    warmPathPlan,
    isGeneratingPlan,
    activePath,
  } = useGraphState()

  if (!selectedCompany) return null
  if (activePath.length > 0) return null
  if (!warmPathPlan && !isGeneratingPlan) return null

  return (
    <div style={{
      position: 'absolute',
      top: 58,
      right: 14,
      width: 220,
      background: 'rgba(16, 16, 22, 0.96)',
      border: '0.5px solid rgba(244,167,66,0.20)',
      borderRadius: 12,
      padding: '12px 14px',
      zIndex: 30,
    }}>

      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontSize: 9,
          fontWeight: 500,
          color: '#F4A742',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: 3,
          opacity: 0.7,
        }}>
          No warm path found
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.80)',
        }}>
          Build one into {selectedCompany.name}
        </div>
      </div>

      {isGeneratingPlan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.50)',
            lineHeight: 1.6,
            marginBottom: 2,
          }}>
            <TypingText lines={[
              'No direct path found...',
              'Scanning alternative routes...',
              'Building your 30-day plan...',
            ]} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[90, 70, 80, 65].map((w, i) => (
              <div key={i} style={{
                height: 24,
                width: w + '%',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 5,
              }} />
            ))}
          </div>

        </div>
      )}

      {!isGeneratingPlan && warmPathPlan && (
        <>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.40)',
            marginBottom: 10,
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}>
            {warmPathPlan.message}
          </div>

          {warmPathPlan.weeks.map((week) => (
            <div key={week.week} style={{
              display: 'flex',
              gap: 8,
              marginBottom: 8,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: 'rgba(244,167,66,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
                color: '#F4A742',
                flexShrink: 0,
                marginTop: 1,
              }}>
                W{week.week}
              </div>
              <div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.75)',
                  fontWeight: 500,
                  marginBottom: 1,
                }}>
                  {week.action}
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.35)',
                  lineHeight: 1.4,
                }}>
                  → {week.reason}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
