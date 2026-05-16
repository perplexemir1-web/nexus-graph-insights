import { createServerFn } from '@tanstack/react-start'

type OutreachInput = {
  targetNode: {
    name: string
    sub?: string
    university?: string
  }
  msgType: string
  tone: string
  userProfile: {
    name: string
    university: string
    degree: string
    skills: string[]
    targetRole: string
  }
}

export const generateOutreachFn = createServerFn({ method: 'POST' })
  .inputValidator((data: OutreachInput) => data)
  .handler(async ({ data }) => {
    console.log('SERVER FN CALLED with:', data.targetNode.name)

    const { targetNode, msgType, tone, userProfile } = data

    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('SERVER FN: GOOGLE_AI_API_KEY is missing')
      return { message: 'API key not configured. Add GOOGLE_AI_API_KEY to .env.local' }
    }

    try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const messageTypeInstructions: Record<string, string> = {
      'LinkedIn DM':  'Write a short LinkedIn connection message, 3-4 sentences max. End with a low-friction ask like a quick chat.',
      'Coffee chat':  'Write a warm coffee chat request, 3-4 sentences. Be specific about wanting to learn from their experience.',
      'Referral ask': 'Write a polite referral request, 4-5 sentences. Acknowledge it is a big ask and show genuine interest in the company.',
    }

    const toneInstructions: Record<string, string> = {
      'Warm':   'Tone: conversational, friendly, personal. Like messaging someone you almost know.',
      'Formal': 'Tone: professional and respectful. Appropriate for senior contacts.',
      'Bold':   'Tone: confident and direct. Get straight to the point.',
    }

    const prompt = `You are a professional networking coach writing outreach messages for fresh graduates.

${messageTypeInstructions[msgType] ?? messageTypeInstructions['LinkedIn DM']}
${toneInstructions[tone] ?? toneInstructions['Warm']}

Sender: ${userProfile.name}, ${userProfile.degree} graduate from ${userProfile.university}
Skills: ${userProfile.skills.join(', ')}
Looking for: ${userProfile.targetRole} roles

Recipient: ${targetNode.name}, ${targetNode.sub ?? 'Professional'}
Shared background: Both attended ${targetNode.university ?? 'the same university'}

Rules:
- Never use "I hope this message finds you well" or any generic opener
- Reference one specific shared detail naturally
- Sound human, not templated
- Maximum 5 sentences
- Do not use placeholders like [X] or [your name]
- Write only the message itself, no subject line, no sign-off label`

    const result = await model.generateContent(prompt)
    const message = result.response.text()
    console.log('SERVER FN: message generated, length:', message.length)
    return { message }
    } catch (err: unknown) {
      const error = err as { message?: string }
      console.error('SERVER FN GEMINI ERROR:', err)
      console.error('SERVER FN GEMINI ERROR MESSAGE:', error?.message)
      throw err
    }
  })

type ActionsInput = {
  userProfile: {
    name: string
    university: string
    skills: string[]
  }
  topNodes: Array<{
    id: string
    name: string
    sub?: string
    university?: string
    company?: string
    warmness?: number
  }>
  targetCompanies: string[]
}

export const generateActionsFn = createServerFn({ method: 'POST' })
  .inputValidator((data: ActionsInput) => data)
  .handler(async ({ data }) => {
    console.log('generateActionsFn called')

    if (!process.env.GOOGLE_AI_API_KEY) {
      return { actions: getDefaultActions() }
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const nodeList = data.topNodes
      .map(n => `- ${n.name} (${n.sub ?? 'Professional'}, warmness: ${n.warmness ?? 'unknown'}, university: ${n.university ?? 'unknown'})`)
      .join('\n')

    const prompt = `You are a career networking strategist for fresh graduates.

Given this professional's background and their network, generate exactly 3 
high-impact networking actions they should take today.

User: ${data.userProfile.name}, ${data.userProfile.university} graduate
Skills: ${data.userProfile.skills.join(', ')}
Target companies: ${data.targetCompanies.join(', ')}

Their warmest connections:
${nodeList}

Return ONLY a valid JSON array with exactly 3 objects. No markdown, no backticks, 
no explanation. Just the raw JSON array.

Format:
[
  {
    "priority": 1,
    "boldName": "Person or Community Name",
    "action": "Full action description explaining who this is and why to contact them now"
  }
]

Rules:
- Each action must name a specific person or community from the list above
- Explain the strategic reason in one clause after a dash
- Keep each action under 12 words after the dash
- Priority 1 is most important
- Make it feel urgent and specific, not generic`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()

      const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      const actions = JSON.parse(cleaned)

      if (Array.isArray(actions) && actions.length > 0) {
        return { actions: actions.slice(0, 3) }
      }
      return { actions: getDefaultActions() }
    } catch (e) {
      console.error('Actions generation error:', e)
      return { actions: getDefaultActions() }
    }
  })

function getDefaultActions() {
  return [
    { priority: 1, boldName: 'James Tan', action: 'Message James Tan — UM alum, direct warm path to Google' },
    { priority: 2, boldName: 'AI/ML Malaysia', action: 'Join AI/ML Malaysia — bridges you to 3 Google engineers' },
    { priority: 3, boldName: 'Priya Sharma', action: 'Connect with Priya Sharma — highest warmness in your network' },
  ]
}
