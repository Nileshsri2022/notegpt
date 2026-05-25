export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { content, type } = body

  if (!content) {
    throw createError({ statusCode: 400, message: 'content is required' })
  }

  if (!config.openrouterApiKey) {
    throw createError({ statusCode: 500, message: 'OPENROUTER_API_KEY not configured' })
  }

  const systemPrompt = `You are an expert summarizer. Create a comprehensive summary of the following ${type || 'content'}. 
Include:
- A brief overview (2-3 sentences)
- Key points (bullet points)
- Main takeaways
- Any important details or timestamps

Be concise but thorough.`

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
          { role: 'user', content },
        ],
      },
    })

    return {
      summary: response.choices?.[0]?.message?.content || 'Failed to generate summary',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to summarize content',
    })
  }
})
