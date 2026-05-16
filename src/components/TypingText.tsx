import { useState, useEffect } from 'react'

interface TypingTextProps {
  lines: string[]
  typingSpeed?: number   // ms per character, default 35
  pauseTime?: number     // ms to pause on completed line, default 900
}

export function TypingText({
  lines,
  typingSpeed = 35,
  pauseTime = 900
}: TypingTextProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isPausing, setIsPausing] = useState(false)

  useEffect(() => {
    if (isPausing) {
      const pause = setTimeout(() => {
        const nextLine = (lineIndex + 1) % lines.length
        setLineIndex(nextLine)
        setCharIndex(0)
        setDisplayed('')
        setIsPausing(false)
      }, pauseTime)
      return () => clearTimeout(pause)
    }

    const currentLine = lines[lineIndex]

    if (charIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setDisplayed(currentLine.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, typingSpeed)
      return () => clearTimeout(timer)
    } else {
      setIsPausing(true)
    }
  }, [charIndex, lineIndex, isPausing, lines, typingSpeed, pauseTime])

  return (
    <span>
      {displayed}
      <span style={{
        display: 'inline-block',
        width: 1,
        height: '0.85em',
        background: '#F4A742',
        marginLeft: 2,
        verticalAlign: 'text-bottom',
        animation: 'nexus-blink 1s step-end infinite',
      }} />
      <style>{`
        @keyframes nexus-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}
