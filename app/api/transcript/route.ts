// app/api/transcript/route.ts
import { NextResponse } from 'next/server';
import { withRetry } from '@/lib/youtube/retry';
import { rateLimiter } from '@/lib/youtube/rate-limiter';
import { cache } from '@/lib/youtube/cache';
import { validateYouTubeUrl } from '@/lib/youtube/validation';
import { fetchWithFallback } from '@/lib/youtube/youtube-fallback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL format
  const validation = validateYouTubeUrl(videoUrl);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Check rate limit
  const rateLimitResult = await rateLimiter.check(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  // Check cache first
  const cacheKey = `transcript:${validation.videoId}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    // Get video metadata with retry
    const metadata = await withRetry(
      async () => {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
        const response = await fetch(oEmbedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
      { maxAttempts: 3, delay: 1000 }
    );

    // Get transcript with fallback methods
    const transcriptData = await fetchWithFallback(videoUrl);
    
    // Combine text into one string
    const fullTranscript = transcriptData.map((t: { text: string }) => t.text).join(' ');

    const result = { 
      title: metadata.title, 
      transcript: fullTranscript,
      videoId: validation.videoId
    };

    // Cache the result for 1 hour
    await cache.set(cacheKey, result, 3600);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Return specific error messages based on error type
    if (errorMessage.includes('No transcript available')) {
      return NextResponse.json(
        { error: 'This video has no available transcript or captions are disabled.' },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes('Video unavailable') || errorMessage.includes('404')) {
      return NextResponse.json(
        { error: 'This video is unavailable or private.' },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'YouTube is rate limiting requests. Please try again in a few minutes.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Could not fetch transcript. Please try again later.' },
      { status: 500 }
    );
  }
}
