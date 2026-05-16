import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { GraphNode } from '@/types/graph.types'
import { generateOutreachFn } from '@/lib/outreach'
//import { generateOutreachFn } from '@/server/outreach'

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
      console.log('Calling generateOutreachFn for:', node.name)
      const result = await generateOutreachFn({
        data: {
          targetNode: {
            name: node.name,
            sub: node.sub,
            university: node.university,
          },
          msgType: type,
          tone: selectedTone,
          userProfile: {
            name: 'Ahmad Kamal',
            university: 'University of Malaya',
            degree: 'Computer Science',
            skills: ['Machine Learning', 'React', 'Python'],
            targetRole: 'Software Engineer',
          },
        },
      })
      setMessage(result.message ?? 'Failed to generate message.')
    } catch (e: unknown) {
      const err = e as { message?: string; stack?: string }
      console.error('OUTREACH ERROR TYPE:', typeof e)
      console.error('OUTREACH ERROR:', e)
      console.error('OUTREACH ERROR MESSAGE:', err?.message)
      console.error('OUTREACH ERROR STACK:', err?.stack)
      console.error('OUTREACH ERROR JSON:', JSON.stringify(e, null, 2))
      setMessage('Error: ' + (err?.message ?? JSON.stringify(e)))
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
