import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { text, voiceId, modelId, stability, clarity, style, speed } = body

  if (!text || !voiceId) {
    throw createError({ statusCode: 400, message: 'text and voiceId are required' })
  }

  if (!config.elevenlabsApiKey) {
    throw createError({ statusCode: 500, message: 'ELEVENLABS_API_KEY not configured' })
  }

  const client = new ElevenLabsClient({
    apiKey: config.elevenlabsApiKey,
  })

  try {
    const audio = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: modelId || 'eleven_multilingual_v2',
      voice_settings: {
        stability: stability ?? 0.5,
        similarity_boost: clarity ?? 0.75,
        style: style ?? 0,
        speed: speed ?? 1.0,
      },
    })

    // Convert readable stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of audio) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    setResponseHeader(event, 'Content-Type', 'audio/mpeg')
    setResponseHeader(event, 'Content-Length', buffer.length.toString())
    return buffer
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to generate speech',
    })
  }
})
