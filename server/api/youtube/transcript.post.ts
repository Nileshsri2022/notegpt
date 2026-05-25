export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({ statusCode: 400, message: 'YouTube URL is required' })
  }

  const videoId = extractVideoId(url)
  if (!videoId) {
    throw createError({ statusCode: 400, message: 'Invalid YouTube URL' })
  }

  try {
    // Fetch the YouTube video page
    const pageHtml = await $fetch<string>(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    // Extract video title
    const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/)
    const title = titleMatch
      ? titleMatch[1].replace(' - YouTube', '').trim()
      : 'Untitled Video'

    // Extract ytInitialPlayerResponse
    const playerResponseMatch = pageHtml.match(
      /var ytInitialPlayerResponse\s*=\s*({.+?})\s*;/
    )

    if (!playerResponseMatch) {
      throw createError({
        statusCode: 404,
        message: 'Could not extract video data. The video may be unavailable.',
      })
    }

    let playerResponse: any
    try {
      playerResponse = JSON.parse(playerResponseMatch[1])
    } catch {
      throw createError({
        statusCode: 500,
        message: 'Failed to parse video data',
      })
    }

    // Get video duration
    const duration = playerResponse?.videoDetails?.lengthSeconds
      ? formatDuration(parseInt(playerResponse.videoDetails.lengthSeconds))
      : 'Unknown'

    // Get captions track URL
    const captionTracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks

    if (!captionTracks || captionTracks.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'No captions available for this video',
      })
    }

    // Prefer English captions, fall back to first available
    const englishTrack = captionTracks.find(
      (track: any) => track.languageCode === 'en' || track.languageCode?.startsWith('en')
    )
    const captionTrack = englishTrack || captionTracks[0]
    const captionUrl = captionTrack.baseUrl

    // Fetch captions XML
    const captionsXml = await $fetch<string>(captionUrl)

    // Parse XML to plain text
    const transcript = parseCaptionsXml(captionsXml)

    if (!transcript) {
      throw createError({
        statusCode: 500,
        message: 'Failed to parse captions',
      })
    }

    return {
      transcript,
      title,
      duration,
      videoId,
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch transcript',
    })
  }
})

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/v\/([^?&]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  // If it looks like just a video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url

  return null
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

function parseCaptionsXml(xml: string): string {
  // Extract text content from <text> elements
  const textMatches = xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)
  const segments: string[] = []

  for (const match of textMatches) {
    let text = match[1]
    // Decode HTML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/\n/g, ' ')
      .trim()

    if (text) segments.push(text)
  }

  return segments.join(' ')
}
