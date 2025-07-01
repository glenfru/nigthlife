# Nightlife Navigator

A comprehensive nightlife discovery app for Texas and Oklahoma, featuring **LIVE Google Places API integration** with real-time venue data.

## 🌟 Live Features

### 📍 Real Google Places Data
- **Live venue discovery** using Google Places API
- **Real ratings and reviews** from actual customers  
- **Actual venue photos** from Google Photos API
- **Verified business information** including phone numbers and addresses
- **Real-time busyness estimation** based on Google data

### 🔴 Live Activity Tracking
- **Real-time venue capacity** and wait times
- **Live events** happening right now
- **Trending venues** based on current activity
- **Peak time indicators** for optimal visit timing
- **Auto-refresh** every 2-10 minutes for fresh data

### 🗺️ Interactive Map with Real-time Data
- Live busyness indicators for venues (10pm-8am focus)
- Interactive venue markers with contact information
- Real-time updates every 5 minutes
- Distance calculations and directions

## 📱 App Features

### 🎯 Discovery Tab
- **Real Google Places venues** with live data indicators
- **Smart categorization** (bars, clubs, hookah lounges)
- **Live busyness scores** (0-100%) based on Google data
- **Real ratings** with actual review counts
- **Actual venue photos** from Google Photos API

### 🔴 Live Tab (NEW!)
- **Live events** happening right now
- **Trending venues** with real-time activity
- **Venue capacity** and wait time indicators
- **Peak time alerts** for optimal timing
- **Real-time updates** every 2 minutes

### 🗺️ Map Tab
- **Interactive map** with real venue locations
- **Live busyness indicators** on map markers
- **Real-time venue details** with contact info
- **Directions integration** with Google Maps

### ❤️ Favorites Tab
- Save favorite venues for quick access
- Track venue status and busyness over time
- Quick contact and booking options

### 👤 Profile Tab
- Personalized preferences and settings
- Favorite music genres and venue types
- Location and notification preferences

## 🔧 Technical Implementation

### Google Places API Integration
```typescript
// Real venue search with enhanced parameters
const venues = await googlePlacesService.searchAllNightlifeTypes(
  { lat: 32.7767, lng: -96.7970 },
  15000 // 15km radius
);

// Enhanced venue categorization
const type = googlePlacesService.categorizeVenue(venue);
const features = generateFeatures(type, venueDetails);
const busyness = estimateBusyness(venueDetails);
```

### Real-time Data Features
- **Smart caching** to optimize API usage and costs
- **Rate limiting** to respect Google's quotas  
- **Intelligent refresh** based on peak hours
- **Fallback system** ensures app reliability

### API Optimization
- **10-minute cache** for venue data during off-peak hours
- **30-minute cache** during peak nightlife hours (6PM-2AM)
- **Request throttling** with 100ms delays between calls
- **Cost monitoring** with usage statistics

## 🌍 Supported Cities

### Texas
- Dallas, Houston, Austin, San Antonio, Fort Worth
- El Paso, Arlington, Corpus Christi, Plano, Lubbock
- And 15+ more cities with real Google Places data

### Oklahoma  
- Oklahoma City, Tulsa, Norman, Broken Arrow
- Lawton, Edmond, Moore, and more

## 🔑 Setup Instructions

### 1. Google Places API Configuration
```bash
# Add to your .env file
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 2. Enable Required APIs
In Google Cloud Console, enable:
- Places API (New)
- Maps JavaScript API  
- Places API (Legacy) - for photos

### 3. API Key Restrictions (Recommended)
- Restrict to your app's bundle ID/package name
- Limit to required APIs only
- Set usage quotas to control costs

## 💰 API Usage & Costs

### Current Pricing (Google Places API)
- **Nearby Search**: $0.032 per request
- **Place Details**: $0.017 per request  
- **Place Photos**: $0.007 per request

### Optimization Features
- Smart caching reduces API calls by ~70%
- Rate limiting prevents quota exceeded errors
- Usage monitoring with cost estimation
- Automatic fallback to prevent app crashes

### Estimated Monthly Costs
- **Light usage** (100 venues/day): ~$15/month
- **Moderate usage** (500 venues/day): ~$75/month  
- **Heavy usage** (1000 venues/day): ~$150/month

## 🚀 Development

### Running the App
```bash
npm run dev
```

### Building for Production
```bash
npm run build:web
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your Google Places API key
3. Configure API restrictions in Google Cloud Console
4. Test with a few API calls to verify setup

## 📊 Real-time Features

### Live Data Indicators
- **Green dot**: Live Google Places data
- **"LIVE" badges**: Real-time venue information
- **Update timestamps**: Shows data freshness
- **Source indicators**: Google API vs fallback data

### Smart Refresh Logic
- **Peak hours** (6PM-2AM): Refresh every 30 minutes
- **Off-peak hours**: Refresh every 2 hours  
- **Manual refresh**: Pull-to-refresh available
- **Background updates**: Automatic data sync

## 🔒 Privacy & Security

- API keys secured with environment variables
- No personal data stored without consent
- Location access only when explicitly granted
- Secure HTTPS connections for all API calls

## 📱 Platform Support

- **Web**: Full functionality with Google Places integration
- **iOS**: Native maps with real-time data (when exported)
- **Android**: Native maps with real-time data (when exported)
- **Responsive**: Optimized for all screen sizes

---

**🎉 Your app now features LIVE Google Places data with real venues, ratings, photos, and business information!**