import { createFileRoute } from '@tanstack/react-router'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const Route = createFileRoute('/api/outreach')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { targetNode, msgType, tone, userProfile } = body

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const messageTypeInstructions: Record<string, string> = {
          'LinkedIn DM':   'Write a short LinkedIn connection message, 3-4 sentences maximum. End with a low-friction ask like a quick chat.',
          'Coffee chat':   'Write a warm coffee chat request, 3-4 sentences. Be specific about wanting to learn from their experience.',
          'Referral ask':  'Write a polite referral request, 4-5 sentences. Acknowledge it is a big ask and show genuine interest in the company.',
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

        return Response.json({ message })
      },
    },
  },
})
