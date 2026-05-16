import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { GraphNode } from '@/types/graph.types'

interface OutreachCtx {
  open: boolean
  setOpen: (v: boolean) => void
  msgType: string
  setMsgType: (v: string) => void
  tone: string
  setTone: (v: string) => void
  targetNode: GraphNode | null
  openFor: (node: GraphNode) => void
  message: string
  setMessage: (v: string) => void
  isGenerating: boolean
  generateMessage: (node: GraphNode, msgType: string, tone: string) => Promise<void>
}

const Ctx = createContext<OutreachCtx | null>(null)

export function OutreachProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [msgType, setMsgType] = useState('LinkedIn DM')
  const [tone, setTone] = useState('Warm')
  const [targetNode, setTargetNode] = useState<GraphNode | null>(null)
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMessage = useCallback(async (
    node: GraphNode,
    type: string,
    selectedTone: string
  ) => {
    setIsGenerating(true)
    setMessage('')
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetNode: node,
          msgType: type,
          tone: selectedTone,
          userProfile: {
            name: 'Ahmad Kamal',
            university: 'University of Malaya',
            degree: 'Computer Science',
            skills: ['Machine Learning', 'React', 'Python'],
            targetRole: 'Software Engineer',
          },
        }),
      })
      const data = await res.json()
      setMessage(data.message ?? 'Failed to generate message.')
    } catch (e) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const openFor = useCallback((node: GraphNode) => {
    setTargetNode(node)
    setOpen(true)
    setMsgType('LinkedIn DM')
    setTone('Warm')
    generateMessage(node, 'LinkedIn DM', 'Warm')
  }, [generateMessage])

  return (
    <Ctx.Provider value={{
      open, setOpen,
      msgType, setMsgType,
      tone, setTone,
      targetNode, openFor,
      message, setMessage,
      isGenerating, generateMessage,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useOutreach() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useOutreach outside provider')
  return v
}
