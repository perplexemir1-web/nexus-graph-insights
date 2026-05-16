import { useState, useEffect } from 'react'
import { generateActionsFn } from '@/lib/outreach'
import { useGraphState } from '@/hooks/useGraphState'

export type QueueAction = {
  priority: number
  boldName: string
  action: string
}

export function useActionQueue() {
  const { graphData } = useGraphState()
  const [actions, setActions] = useState<QueueAction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!graphData) return
    if (actions.length > 0) return // already loaded

    const topNodes = graphData.nodes
      .filter(n => n.kind === 'person' && n.warmness)
      .sort((a, b) => (b.warmness ?? 0) - (a.warmness ?? 0))
      .slice(0, 8)
      .map(n => ({
        id: n.id,
        name: n.name,
        sub: n.sub,
        university: n.university,
        company: n.company,
        warmness: n.warmness,
      }))

    const targetCompanies = graphData.nodes
      .filter(n => n.kind === 'company')
      .map(n => n.name)

    setIsLoading(true)

    generateActionsFn({
      data: {
        userProfile: {
          name: 'Ahmad Kamal',
          university: 'University of Malaya',
          skills: ['Machine Learning', 'React', 'Python'],
        },
        topNodes,
        targetCompanies,
      },
    })
      .then(result => {
        if (result.actions && result.actions.length > 0) {
          setActions(result.actions)
        }
      })
      .catch(e => {
        console.error('Action queue error:', e)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [graphData])

  return { actions, isLoading }
}
