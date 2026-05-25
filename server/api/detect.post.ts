export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { text } = body

  if (!text) {
    throw createError({ statusCode: 400, message: 'text is required' })
  }

  if (!config.openrouterApiKey) {
    throw createError({ statusCode: 500, message: 'OPENROUTER_API_KEY not configured' })
  }

  const systemPrompt = `You are an AI content detection expert. Analyze the following text and determine the likelihood that it was written by AI vs a human.

Respond in this exact JSON format:
{
  "score": <number 0-100 representing AI probability, where 100 = definitely AI>,
  "analysis": "<brief explanation of why you think this>",
  "highlights": ["<sentence or phrase that seems AI-generated>", "<another one>"]
}

Consider these factors:
- Repetitive sentence structures
- Overly formal or generic language
- Lack of personal voice or unique perspective
- Perfect grammar with no colloquialisms
- Predictable transitions and conclusions
- Use of filler phrases common in AI text

Only return valid JSON, no other text.`

  try {
    const response: any = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://notegpt.io',
        'X-Title': 'NoteGPT',
      },
      body: {
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      },
    })

    const content = response.choices?.[0]?.message?.content || ''

    // Parse JSON from response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          score: Math.min(100, Math.max(0, Number(parsed.score) || 50)),
          analysis: parsed.analysis || 'Unable to determine.',
          highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        }
      }
    } catch {
      // If JSON parsing fails, return a default
    }

    return {
      score: 50,
      analysis: content || 'Analysis could not be completed.',
      highlights: [],
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to analyze text',
    })
  }
})
