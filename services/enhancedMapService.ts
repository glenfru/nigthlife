import { mapService } from './mapService';
import { apiOptimization } from './apiOptimization';

// Enhanced service with caching and optimization
export class EnhancedMapService {
  // Cached venue search with smart refresh
  async getCachedNightlifeVenues(
    center: { lat: number; lng: number },
    radiusKm: number = 15,
    city?: string
  ) {
    const cacheKey = `venues_${center.lat}_${center.lng}_${radiusKm}_${city}`;
    
    // Check cache first
    const cached = apiOptimization.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Using cached venue data');
      return cached;
    }

    // Apply rate limiting
    await apiOptimization.throttleRequest();
    
    // Fetch fresh data
    console.log('🔄 Fetching fresh venue data from Google Places API');
    const venues = await mapService.getNightlifeVenues(center, radiusKm, city);
    
    // Cache the results
    apiOptimization.setCachedData(cacheKey, venues);
    
    return venues;
  }

  // Smart refresh based on time and user activity
  shouldRefreshData(lastUpdate: Date): boolean {
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    
    // Refresh more frequently during peak hours (6PM - 2AM)
    const currentHour = now.getHours();
    const isPeakTime = currentHour >= 18 || currentHour <= 2;
    
    if (isPeakTime) {
      return hoursSinceUpdate >= 0.5; // 30 minutes during peak
    } else {
      return hoursSinceUpdate >= 2; // 2 hours during off-peak
    }
  }

  // Get API usage statistics
  getAPIStats() {
    return apiOptimization.getUsageStats();
  }

  // Clean up expired cache
  performMaintenance() {
    apiOptimization.clearExpiredCache();
  }
}

export const enhancedMapService = new EnhancedMapService();