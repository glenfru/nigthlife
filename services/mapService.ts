import { Platform } from 'react-native';

export interface VenueLocation {
  id: string;
  name: string;
  type: 'bar' | 'club' | 'hookah';
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  isOpen: boolean;
  busyness: 'low' | 'moderate' | 'high' | 'very-high';
  busynessScore: number; // 0-100
  peakHours: string[];
  features: string[];
  image: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  placeId: string;
  userRatingsTotal?: number;
  distance?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
  }>;
}

export interface BusynessData {
  venueId: string;
  currentBusyness: number; // 0-100
  predictedBusyness: { hour: number; busyness: number }[];
  isNightlifePeak: boolean; // true if busy between 10pm-8am
  peakNightHours: number[]; // hours when venue is busiest during nightlife hours
}

export interface MapBounds {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
}

class MapService {
  private apiKey: string;
  private bestTimeApiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    this.bestTimeApiKey = process.env.EXPO_PUBLIC_BESTTIME_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
    
    console.log('🚀 MapService initialized for real Google Places data');
  }

  // Get the correct API base URL for the current environment
  private getApiBaseUrl(): string {
    // If baseUrl is configured in environment, use it
    if (this.baseUrl && this.baseUrl !== '') {
      return this.baseUrl;
    }
    
    // For web platform, use relative URLs which will be handled by the same server
    if (Platform.OS === 'web') {
      return '';
    }
    
    // For native platforms, we need an absolute URL
    return 'http://localhost:3000';
  }

  // Get venues within a specific area with real-time busyness
  async getNightlifeVenues(
    center: { lat: number; lng: number },
    radiusKm: number = 15,
    city?: string
  ): Promise<VenueLocation[]> {
    try {
      console.log('🌟 Fetching real nightlife venues from Google Places API...');
      console.log('📍 Center:', center);
      console.log('📏 Radius:', radiusKm, 'km');
      console.log('🏙️ City:', city);
      
      // Check if API key is configured properly
      if (!this.apiKey || this.apiKey === 'your_actual_google_maps_api_key_here' || this.apiKey === 'YOUR_ACTUAL_API_KEY_HERE') {
        console.warn('⚠️ Google Places API key not configured properly');
        console.warn('📋 Please follow these steps to configure your API key:');
        console.warn('1. Go to https://console.cloud.google.com/apis/credentials');
        console.warn('2. Create or get your Google Maps API key');
        console.warn('3. Enable Places API (New), Maps JavaScript API, and Places API (Legacy)');
        console.warn('4. Replace the API key in your .env file');
        console.warn('5. Restart your development server');
        console.warn('🔄 Using mock data for now...');
        return this.getMockNightlifeVenues(city);
      }

      // Search for nightlife venues using local API route
      const radiusMeters = radiusKm * 1000;
      
      // Search for multiple venue types
      const venueTypes = ['night_club', 'bar', 'restaurant'];
      const allVenues: VenueLocation[] = [];

      for (const type of venueTypes) {
        try {
          console.log(`🔍 Searching for ${type} venues...`);
          
          // Use the correct API base URL
          const baseUrl = this.getApiBaseUrl();
          const apiUrl = `${baseUrl}/api/venues/nightlife`;
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: center,
              radius: radiusMeters,
              type: type
            }),
          });

          // Check if response is actually JSON before parsing
          const contentType = response.headers.get('content-type') || '';
          
          if (!response.ok) {
            console.error(`❌ API request failed for ${type}:`, response.status, response.statusText);
            
            // Try to get error details from response
            try {
              if (contentType.includes('application/json')) {
                const errorData = await response.json();
                console.error(`❌ API error details for ${type}:`, errorData);
                
                // If it's a configuration error, show helpful message
                if (errorData.setup_instructions) {
                  console.error('📋 Setup instructions:');
                  Object.entries(errorData.setup_instructions).forEach(([key, value]) => {
                    console.error(`   ${key}: ${value}`);
                  });
                }
              } else {
                const textError = await response.text();
                console.error(`❌ Non-JSON error response for ${type}:`, textError.substring(0, 200) + '...');
                
                // If we get HTML, it means the API route isn't working
                if (textError.includes('<!DOCTYPE html>')) {
                  console.error('🚨 CRITICAL: API route not found or not configured properly!');
                  console.error('📋 This usually means:');
                  console.error('   1. The Expo server is not configured for API routes');
                  console.error('   2. Add "web": { "output": "server" } to your app.json');
                  console.error('   3. Restart your development server completely');
                  console.error('   4. Ensure your .env file has the correct API keys');
                }
              }
            } catch (parseError) {
              console.error(`❌ Could not parse error response for ${type}:`, parseError);
            }
            continue; // Skip to next venue type
          }

          if (!contentType.includes('application/json')) {
            console.error(`❌ Expected JSON response for ${type}, got:`, contentType);
            
            // Try to read the response to see what we got
            try {
              const responseText = await response.text();
              console.error(`❌ Response content for ${type}:`, responseText.substring(0, 200) + '...');
              
              // If we get HTML, it means the API route isn't working
              if (responseText.includes('<!DOCTYPE html>')) {
                console.error('🚨 CRITICAL: API route not found or not configured properly!');
                console.error('📋 This usually means:');
                console.error('   1. The Expo server is not configured for API routes');
                console.error('   2. Add "web": { "output": "server" } to your app.json');
                console.error('   3. Restart your development server completely');
                console.error('   4. Ensure your .env file has the correct API keys');
              }
            } catch (readError) {
              console.error(`❌ Could not read response content for ${type}:`, readError);
            }
            continue; // Skip to next venue type
          }

          const data = await response.json();
          
          if (data.error) {
            console.error(`❌ API returned error for ${type}:`, data.error);
            if (data.details) {
              console.error(`❌ Error details for ${type}:`, data.details);
            }
            if (data.troubleshooting) {
              console.error('🔧 Troubleshooting steps:');
              Object.entries(data.troubleshooting).forEach(([key, value]) => {
                console.error(`   ${key}: ${value}`);
              });
            }
            continue; // Skip to next venue type
          }
          
          if (data.results && data.results.length > 0) {
            console.log(`✅ Found ${data.results.length} ${type} venues`);
            
            // Process and filter venues
            const processedVenues = await this.processGooglePlacesResults(data.results);
            allVenues.push(...processedVenues);
          } else {
            console.log(`ℹ️ No ${type} venues found in API response`);
          }
          
          // Small delay between requests to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Error searching for ${type}:`, error);
          // Continue to next venue type instead of throwing
        }
      }

      // Remove duplicates based on place_id
      const uniqueVenues = allVenues.filter((venue, index, self) =>
        index === self.findIndex(v => v.placeId === venue.placeId)
      );

      // Filter for actual nightlife venues
      const nightlifeVenues = uniqueVenues.filter(venue => this.isNightlifeVenue(venue));

      console.log(`🎯 Total unique nightlife venues found: ${nightlifeVenues.length}`);
      
      if (nightlifeVenues.length > 0) {
        return nightlifeVenues;
      } else {
        console.warn('⚠️ No nightlife venues found from Google API, using mock data');
        return this.getMockNightlifeVenues(city);
      }

    } catch (error) {
      console.error('💥 Error fetching nightlife venues:', error);
      console.warn('🔄 Falling back to mock data due to API error');
      // Return mock data as fallback
      return this.getMockNightlifeVenues(city);
    }
  }

  // Process Google Places API results into our venue format
  private async processGooglePlacesResults(results: any[]): Promise<VenueLocation[]> {
    const venues: VenueLocation[] = [];

    for (const place of results) {
      try {
        // Get detailed information for each place
        const details = await this.getPlaceDetails(place.place_id);
        
        if (details) {
          const venue = this.convertGooglePlaceToVenue(place, details);
          if (venue) {
            venues.push(venue);
          }
        }
        
        // Small delay between detail requests
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Error processing place ${place.place_id}:`, error);
      }
    }

    return venues;
  }

  // Get detailed place information
  private async getPlaceDetails(placeId: string): Promise<any> {
    try {
      // Use the correct API base URL
      const baseUrl = this.getApiBaseUrl();
      const apiUrl = `${baseUrl}/api/venues/details`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId }),
      });

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        console.error(`❌ Failed to get details for place ${placeId}:`, response.status, response.statusText);
        return null;
      }

      if (!contentType.includes('application/json')) {
        console.error(`❌ Expected JSON response for place details, got:`, contentType);
        return null;
      }

      const data = await response.json();
      
      if (data.error) {
        console.error(`❌ API returned error for place details ${placeId}:`, data.error);
        return null;
      }
      
      return data.result;
    } catch (error) {
      console.error(`❌ Error getting place details for ${placeId}:`, error);
      return null;
    }
  }

  // Convert Google Places result to our venue format
  private convertGooglePlaceToVenue(place: any, details: any): VenueLocation | null {
    try {
      const venue: VenueLocation = {
        id: place.place_id,
        placeId: place.place_id,
        name: details.name || place.name,
        type: this.categorizeVenue(details),
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: details.formatted_address || place.vicinity,
        phone: details.formatted_phone_number || details.international_phone_number || '(555) 000-0000',
        rating: details.rating || place.rating || 4.0,
        userRatingsTotal: details.user_ratings_total,
        priceRange: this.convertPriceLevel(details.price_level),
        isOpen: details.opening_hours?.open_now ?? place.opening_hours?.open_now ?? true,
        busyness: this.estimateBusyness(details),
        busynessScore: this.calculateBusynessScore(details),
        peakHours: this.generatePeakHours(),
        features: this.generateFeatures(this.categorizeVenue(details), details),
        image: this.getVenueImage(details.photos),
        website: details.website,
        reviews: details.reviews?.slice(0, 3) || []
      };

      return venue;
    } catch (error) {
      console.error('❌ Error converting Google Place to venue:', error);
      return null;
    }
  }

  // Check if a venue is actually a nightlife venue
  private isNightlifeVenue(venue: VenueLocation): boolean {
    const nightlifeKeywords = [
      'bar', 'club', 'nightclub', 'lounge', 'pub', 'tavern', 'brewery',
      'cocktail', 'hookah', 'shisha', 'dance', 'disco', 'nightlife'
    ];

    const venueText = (venue.name + ' ' + venue.address).toLowerCase();
    
    // Check if venue name or address contains nightlife keywords
    return nightlifeKeywords.some(keyword => venueText.includes(keyword));
  }

  // Categorize venue type based on Google Places data
  private categorizeVenue(details: any): 'bar' | 'club' | 'hookah' {
    const name = details.name?.toLowerCase() || '';
    const types = details.types?.join(' ').toLowerCase() || '';
    const text = name + ' ' + types;

    if (text.includes('hookah') || text.includes('shisha')) {
      return 'hookah';
    }

    if (text.includes('club') || text.includes('nightclub') || text.includes('dance')) {
      return 'club';
    }

    return 'bar'; // Default to bar
  }

  // Convert Google price level to our format
  private convertPriceLevel(priceLevel?: number): '$' | '$$' | '$$$' {
    if (!priceLevel) return '$$';
    
    switch (priceLevel) {
      case 1: return '$';
      case 2: return '$$';
      case 3:
      case 4: return '$$$';
      default: return '$$';
    }
  }

  // Estimate busyness based on Google data
  private estimateBusyness(details: any): 'low' | 'moderate' | 'high' | 'very-high' {
    const rating = details.rating || 4.0;
    const reviewCount = details.user_ratings_total || 0;
    
    // Higher rated venues with more reviews are likely busier
    const score = (rating * 0.7) + (Math.min(reviewCount / 100, 5) * 0.3);
    
    if (score >= 4.5) return 'very-high';
    if (score >= 4.0) return 'high';
    if (score >= 3.5) return 'moderate';
    return 'low';
  }

  // Calculate numerical busyness score
  private calculateBusynessScore(details: any): number {
    const rating = details.rating || 4.0;
    const reviewCount = details.user_ratings_total || 0;
    
    // Base score from rating (0-100)
    let score = (rating / 5) * 60; // Max 60 points from rating
    
    // Bonus points from review count (0-40)
    score += Math.min(reviewCount / 50, 40); // Max 40 points from reviews
    
    return Math.round(Math.min(score, 100));
  }

  // Generate peak hours for venue
  private generatePeakHours(): string[] {
    return ['21:00', '22:00', '23:00', '00:00', '01:00'];
  }

  // Generate features based on venue type and details
  private generateFeatures(type: 'bar' | 'club' | 'hookah', details: any): string[] {
    const baseFeatures = {
      bar: ['Drinks', 'Happy Hour', 'Music'],
      club: ['Dance Floor', 'DJ', 'VIP Area'],
      hookah: ['Hookah', 'Lounge', 'BYOB']
    };

    const features = [...baseFeatures[type]];
    
    // Add features based on Google data
    if (details.website) features.push('Online Presence');
    if (details.user_ratings_total > 100) features.push('Popular');
    if (details.price_level >= 3) features.push('Upscale');
    
    return features.slice(0, 4); // Limit to 4 features
  }

  // Get venue image from Google Photos or fallback
  private getVenueImage(photos?: any[]): string {
    if (photos && photos.length > 0) {
      // Use Google Photos API via our local endpoint
      const baseUrl = this.getApiBaseUrl();
      return `${baseUrl}/api/venues/photo?photoReference=${photos[0].photo_reference}&maxWidth=600`;
    }
    
    // Fallback images based on venue type
    const fallbackImages = [
      'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg',
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    ];
    
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  // Get real-time busyness data for venues
  async getBusynessData(venueIds: string[]): Promise<BusynessData[]> {
    try {
      // Use the correct API base URL
      const baseUrl = this.getApiBaseUrl();
      const apiUrl = `${baseUrl}/api/venues/busyness`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          venueIds,
          timeRange: { start: 22, end: 8 }, // 10pm to 8am
        }),
      });

      // Check if response is actually JSON before parsing
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        console.error('❌ Busyness API request failed:', response.status, response.statusText);
        return this.getMockBusynessData(venueIds);
      }

      if (!contentType.includes('application/json')) {
        console.error('❌ Expected JSON response for busyness data, got:', contentType);
        return this.getMockBusynessData(venueIds);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('❌ Busyness API returned error:', data.error);
        return this.getMockBusynessData(venueIds);
      }
      
      return data.busynessData || this.getMockBusynessData(venueIds);
    } catch (error) {
      console.error('❌ Error fetching busyness data:', error);
      return this.getMockBusynessData(venueIds);
    }
  }

  // Filter venues that are busy during nightlife hours (10pm-8am)
  filterNightlifeBusyVenues(
    venues: VenueLocation[],
    busynessData: BusynessData[]
  ): VenueLocation[] {
    const currentHour = new Date().getHours();
    const isNightlifeTime = currentHour >= 22 || currentHour <= 8;

    return venues.filter(venue => {
      const venueData = busynessData.find(data => data.venueId === venue.id);
      if (!venueData) return true; // Include venues without busyness data

      // Show venues that are currently busy during nightlife hours
      if (isNightlifeTime) {
        return venueData.currentBusyness >= 50; // 50% or higher busyness
      }

      // During day time, show venues that will be busy during nightlife hours
      return venueData.isNightlifePeak;
    });
  }

  // Calculate distance between two points
  calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLng = this.toRad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  // Mock data for development/demo purposes (fallback only)
  private getMockNightlifeVenues(city?: string): VenueLocation[] {
    console.log('🔄 Using mock data for city:', city);
    
    const venues: { [key: string]: VenueLocation[] } = {
      'Dallas, TX': [
        {
          id: 'mock-dallas-1',
          name: 'Deep Ellum Nightclub',
          type: 'club',
          latitude: 32.7767,
          longitude: -96.7970,
          address: '123 Main St, Dallas, TX 75201',
          phone: '(214) 555-0123',
          rating: 4.5,
          priceRange: '$$',
          isOpen: true,
          busyness: 'very-high',
          busynessScore: 85,
          peakHours: ['22:00', '23:00', '00:00', '01:00', '02:00'],
          features: ['Dance Floor', 'DJ', 'VIP Area', 'Bottle Service'],
          image: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg',
          website: 'https://example.com',
          placeId: 'mock-dallas-1',
          userRatingsTotal: 250
        },
        {
          id: 'mock-dallas-2',
          name: 'Uptown Sports Bar',
          type: 'bar',
          latitude: 32.7831,
          longitude: -96.8067,
          address: '456 Elm St, Dallas, TX 75202',
          phone: '(214) 555-0456',
          rating: 4.2,
          priceRange: '$$',
          isOpen: true,
          busyness: 'high',
          busynessScore: 75,
          peakHours: ['19:00', '20:00', '21:00', '22:00', '23:00'],
          features: ['Sports TV', 'Happy Hour', 'Pool Tables', 'Outdoor Patio'],
          image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg',
          placeId: 'mock-dallas-2',
          userRatingsTotal: 180
        },
        {
          id: 'mock-dallas-3',
          name: 'Oasis Hookah Lounge',
          type: 'hookah',
          latitude: 32.7555,
          longitude: -96.8100,
          address: '789 Commerce St, Dallas, TX 75203',
          phone: '(214) 555-0789',
          rating: 4.0,
          priceRange: '$',
          isOpen: true,
          busyness: 'moderate',
          busynessScore: 60,
          peakHours: ['20:00', '21:00', '22:00', '23:00', '00:00'],
          features: ['Premium Flavors', 'Private Rooms', 'Games', 'BYOB'],
          image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
          placeId: 'mock-dallas-3',
          userRatingsTotal: 95
        }
      ]
    };

    return venues[city || 'Dallas, TX'] || venues['Dallas, TX'];
  }

  private getMockBusynessData(venueIds: string[]): BusynessData[] {
    return venueIds.map(id => ({
      venueId: id,
      currentBusyness: Math.floor(Math.random() * 40) + 60, // 60-100%
      predictedBusyness: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        busyness: hour >= 22 || hour <= 8 
          ? Math.floor(Math.random() * 30) + 70 // High during nightlife hours
          : Math.floor(Math.random() * 50) + 20  // Lower during day
      })),
      isNightlifePeak: true,
      peakNightHours: [22, 23, 0, 1, 2]
    }));
  }
}

export const mapService = new MapService();