// API Optimization and Monitoring Service
export class APIOptimizationService {
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_DELAY = 100; // 100ms between requests

  // Rate limiting to respect Google's quotas
  async throttleRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      const delay = this.RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  // Monitor API usage
  getUsageStats() {
    return {
      totalRequests: this.requestCount,
      requestsPerMinute: this.calculateRequestsPerMinute(),
      estimatedCost: this.estimateCost()
    };
  }

  private calculateRequestsPerMinute(): number {
    // Implementation for tracking requests per minute
    return this.requestCount; // Simplified
  }

  private estimateCost(): number {
    // Google Places API pricing estimation
    const nearbySearchCost = 0.032; // $0.032 per request
    const placeDetailsCost = 0.017; // $0.017 per request
    const photosCost = 0.007; // $0.007 per request
    
    // Estimate based on typical usage patterns
    return this.requestCount * (nearbySearchCost + placeDetailsCost + photosCost);
  }

  // Cache management for reducing API calls
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiOptimization = new APIOptimizationService();