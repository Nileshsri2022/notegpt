export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { messages, model } = body

  if (!messages || !Array.isArray(messages)) {
    throw createError({ statusCode: 400, message: 'messages array is required' })
  }

  if (!config.openrouterApiKey) {
    throw createError({ statusCode: 500, message: 'OPENROUTER_API_KEY not configured' })
  }

  try {
    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://notegpt.io',
        'X-Title': 'NoteGPT',
      },
      body: {
        model: model || 'google/gemini-2.0-flash-exp:free',
        messages,
      },
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get AI response',
    })
  }
})
