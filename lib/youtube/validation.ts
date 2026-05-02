export interface ValidationResult {
  isValid: boolean;
  videoId?: string;
  error?: string;
}

export function validateYouTubeUrl(url: string): ValidationResult {
  try {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return {
          isValid: true,
          videoId: match[1]
        };
      }
    }

    return {
      isValid: false,
      error: 'Invalid YouTube URL format. Please provide a valid YouTube video URL.'
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format.'
    };
  }
}
