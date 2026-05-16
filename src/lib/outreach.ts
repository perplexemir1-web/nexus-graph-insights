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

type WarmPathPlanInput = {
  companyName: string
  userProfile: {
    name: string
    university: string
    skills: string[]
  }
  existingConnections: string[]
}

export const generateWarmPathPlanFn = createServerFn({ method: 'POST' })
  .inputValidator((data: WarmPathPlanInput) => data)
  .handler(async ({ data }) => {
    console.log('generateWarmPathPlanFn called for:', data.companyName)

    if (!process.env.GOOGLE_AI_API_KEY) {
      return { plan: getDefaultWarmPlan(data.companyName) }
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a career networking strategist helping a 
fresh graduate build connections at a company where they have 
no existing warm path.

Candidate: ${data.userProfile.name}
University: ${data.userProfile.university}
Skills: ${data.userProfile.skills.join(', ')}
Target company: ${data.companyName}
Current connections (NOT at target company): ${data.existingConnections.join(', ')}

Generate a 4-week plan to build a warm path into ${data.companyName}.
Return ONLY a valid JSON object. No markdown, no backticks. Raw JSON only.

Format:
{
  "message": "One sentence explaining why there is no direct path. Max 12 words.",
  "weeks": [
    {
      "week": 1,
      "action": "Specific action to take this week. Max 8 words.",
      "reason": "Why this works for getting into ${data.companyName}. Max 10 words."
    }
  ]
}

Rules:
- Exactly 4 week objects
- Actions must be specific to ${data.companyName} and the candidate's background
- Reference real communities, platforms, or events where possible
- Week 4 should result in having at least one warm connection
- Do not use placeholder text like [Company] or [Name]`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      const plan = JSON.parse(cleaned)
      return { plan }
    } catch (e) {
      console.error('Warm path plan error:', e)
      return { plan: getDefaultWarmPlan(data.companyName) }
    }
  })

type GapAnalysisInput = {
  companyName: string
  userProfile: {
    name: string
    university: string
    skills: string[]
    targetRole: string
  }
  pathContactNames: string[]
}

export const generateGapAnalysisFn = createServerFn({ method: 'POST' })
  .inputValidator((data: GapAnalysisInput) => data)
  .handler(async ({ data }) => {
    console.log('generateGapAnalysisFn called for:', data.companyName)

    if (!process.env.GOOGLE_AI_API_KEY) {
      return { analysis: getDefaultGapAnalysis(data.companyName) }
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a career fit analyst for fresh graduates targeting tech companies.

Candidate: ${data.userProfile.name}, ${data.userProfile.university}
Skills: ${data.userProfile.skills.join(', ')}
Target role: ${data.userProfile.targetRole}
Target company: ${data.companyName}
Warm path contacts: ${data.pathContactNames.join(', ')}

Analyze how well this candidate fits ${data.companyName} given their skills and warm path.
Return ONLY a valid JSON object. No markdown, no backticks. Raw JSON only.

Format:
{
  "fitScore": 72,
  "hasSkills": ["React", "Python"],
  "missingSkills": ["System Design"],
  "quickestWin": "One specific action under 15 words."
}

Rules:
- fitScore is 0-100 integer
- hasSkills: 2-4 skills they already have relevant to ${data.companyName}
- missingSkills: 1-3 gaps to close
- quickestWin must reference a named contact from the warm path if possible
- Do not use placeholder text`

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      const analysis = JSON.parse(cleaned)
      return { analysis }
    } catch (e) {
      console.error('Gap analysis error:', e)
      return { analysis: getDefaultGapAnalysis(data.companyName) }
    }
  })

function getDefaultGapAnalysis(companyName: string) {
  return {
    fitScore: 74,
    hasSkills: ['Machine Learning', 'React', 'Python'],
    missingSkills: ['System Design', 'Distributed Systems'],
    quickestWin: `Ask James Tan for a Google referral intro`,
  }
}

function getDefaultWarmPlan(companyName: string) {
  return {
    message: `No direct warm path to ${companyName} found yet.`,
    weeks: [
      { week: 1, action: 'Join relevant GitHub communities', reason: `${companyName} engineers are active there` },
      { week: 2, action: 'Attend local tech meetup', reason: 'Alumni connections likely present' },
      { week: 3, action: 'Engage with engineers on LinkedIn', reason: 'Build familiarity before reaching out' },
      { week: 4, action: 'Request intro via mutual connection', reason: 'Warm introduction ready to send' },
    ],
  }
}
