import { useGraphState } from '@/hooks/useGraphState'
import { TypingText } from './TypingText'

export function GapAnalysisPanel() {
  const { selectedCompany, activePath, gapAnalysis, isGeneratingGap } = useGraphState()

  if (!selectedCompany) return null
  if (activePath.length === 0) return null

  return (
    <div style={{
      position: 'absolute',
      top: 58,
      right: 14,
      width: 220,
      background: 'rgba(16, 16, 22, 0.96)',
      border: '0.5px solid rgba(29,158,117,0.25)',
      borderRadius: 12,
      padding: '12px 14px',
      zIndex: 30,
    }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontSize: 9,
          fontWeight: 500,
          color: '#1D9E75',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: 3,
          opacity: 0.7,
        }}>
          Gap analysis
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.80)',
        }}>
          {selectedCompany.name}
        </div>
      </div>

      {isGeneratingGap && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.50)',
            lineHeight: 1.6,
            marginBottom: 2,
          }}>
            <TypingText lines={[
              'Analysing your profile...',
              'Comparing skills to requirements...',
              'Identifying your quickest wins...',
            ]} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[85, 65, 75].map((w, i) => (
              <div key={i} style={{
                height: 8,
                width: w + '%',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 4,
              }} />
            ))}
          </div>

        </div>
      )}

      {!isGeneratingGap && gapAnalysis && (
        <>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#1D9E75',
            marginBottom: 8,
            lineHeight: 1,
          }}>
            {gapAnalysis.fitScore}%
          </div>
          <div style={{
            fontSize: 9,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}>
            Fit score
          </div>

          {gapAnalysis.hasSkills.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                Has
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {gapAnalysis.hasSkills.map(skill => (
                  <span key={skill} style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(29,158,117,0.15)',
                    color: '#1D9E75',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {gapAnalysis.missingSkills.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                Missing
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {gapAnalysis.missingSkills.map(skill => (
                  <span key={skill} style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.45)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.50)',
            lineHeight: 1.5,
            borderTop: '0.5px solid rgba(255,255,255,0.08)',
            paddingTop: 8,
          }}>
            <span style={{ color: '#F4A742' }}>Quickest win: </span>
            {gapAnalysis.quickestWin}
          </div>

          {gapAnalysis.gapResources && gapAnalysis.gapResources.length > 0 && (
            <>
              <div style={{
                height: '0.5px',
                background: 'rgba(255,255,255,0.06)',
                margin: '8px 0',
              }} />

              <div style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 6,
              }}>
                Close the gap
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {gapAnalysis.gapResources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      padding: '7px 9px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 6,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'border-color 0.12s, background 0.12s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                      ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: 10,
                        color: 'rgba(216,90,48,0.85)',
                        fontWeight: 500,
                      }}>
                        {resource.skill}
                      </span>
                      <span style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.30)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '1px 5px',
                        borderRadius: 4,
                      }}>
                        {resource.platform}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <span style={{
                        fontSize: 9,
                        color: '#F4A742',
                        opacity: 0.7,
                      }}>
                        →
                      </span>
                      <span style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.4,
                      }}>
                        {resource.action}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
