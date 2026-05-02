interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetTime?: number;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs; // 1 minute window
    this.maxRequests = maxRequests; // 10 requests per minute
  }

  async check(request: Request): Promise<RateLimitResult> {
    const clientIp = this.getClientIp(request);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    const clientData = this.requests.get(clientIp);
    
    if (!clientData) {
      // First request from this IP
      this.requests.set(clientIp, {
        count: 1,
        resetTime: now + this.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }
    
    if (now > clientData.resetTime) {
      // Window has reset
      clientData.count = 1;
      clientData.resetTime = now + this.windowMs;
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: clientData.resetTime
      };
    }
    
    if (clientData.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: clientData.resetTime
      };
    }
    
    clientData.count++;
    
    return {
      allowed: true,
      remaining: this.maxRequests - clientData.count,
      resetTime: clientData.resetTime
    };
  }

  private getClientIp(request: Request): string {
    // Try various headers for real IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    
    if (realIp) {
      return realIp;
    }
    
    if (cfConnectingIp) {
      return cfConnectingIp;
    }
    
    // Fallback to a default or generate a hash from user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `hash_${this.simpleHash(userAgent)}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
  }

  private cleanup(now: number): void {
    for (const [key, data] of this.requests.entries()) {
      if (now > data.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();
