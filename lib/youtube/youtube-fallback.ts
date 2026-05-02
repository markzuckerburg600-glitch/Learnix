import { YoutubeTranscript } from 'youtube-transcript';
import { withRetry } from './retry';

export interface TranscriptSegment {
  text: string;
  duration?: number;
  offset?: number;
  lang?: string;
}

export async function fetchWithFallback(videoUrl: string): Promise<TranscriptSegment[]> {
  const errors: Error[] = [];

  // Method 1: Try youtube-transcript library with different configurations
  try {
    const transcript = await withRetry(async () => {
      return await YoutubeTranscript.fetchTranscript(videoUrl, {
        lang: 'en'
      });
    }, { maxAttempts: 2, delay: 1000 });

    return transcript.map(segment => ({
      text: segment.text,
      duration: segment.duration,
      offset: segment.offset
    }));
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error(String(error)));
  }

  // Method 2: Try without language specification
  try {
    const transcript = await withRetry(async () => {
      return await YoutubeTranscript.fetchTranscript(videoUrl);
    }, { maxAttempts: 2, delay: 1000 });

    return transcript.map(segment => ({
      text: segment.text,
      duration: segment.duration,
      offset: segment.offset
    }));
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error(String(error)));
  }

  // Method 3: Try with different user agent and direct fetch
  try {
    const transcript = await fetchTranscriptDirect(videoUrl);
    return transcript;
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error(String(error)));
  }

  // All methods failed, throw the most relevant error
  const lastError = errors[errors.length - 1];
  
  if (lastError.message.includes('No transcript available')) {
    throw new Error('No transcript available - This video has no captions or subtitles');
  }
  
  if (lastError.message.includes('Video unavailable') || lastError.message.includes('404')) {
    throw new Error('Video unavailable - This video may be private, deleted, or restricted');
  }
  
  if (lastError.message.includes('rate limit') || lastError.message.includes('429')) {
    throw new Error('Rate limit exceeded - YouTube is temporarily blocking requests');
  }
  
  throw new Error(`Failed to fetch transcript: ${lastError.message}`);
}

async function fetchTranscriptDirect(videoUrl: string): Promise<TranscriptSegment[]> {
  // Extract video ID
  const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch) {
    throw new Error('Invalid YouTube URL');
  }
  
  const videoId = videoIdMatch[1];
  
  // Try to get transcript via YouTube's internal API
  const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.youtube.com/',
      'Origin': 'https://www.youtube.com'
    }
  });

  if (!response.ok) {
    throw new Error(`Direct fetch failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.events) {
    throw new Error('No transcript data available');
  }

  interface YouTubeEvent {
  segs?: Array<{ utf8: string }>;
  dDurationMs?: number;
  tStartMs?: number;
}

interface YouTubeResponse {
  events: YouTubeEvent[];
}

const typedData = data as YouTubeResponse;
return typedData.events
    .filter((event: YouTubeEvent) => event.segs)
    .map((event: YouTubeEvent) => ({
      text: event.segs!.map((seg: { utf8: string }) => seg.utf8).join(''),
      duration: event.dDurationMs,
      offset: event.tStartMs
    }));
}
