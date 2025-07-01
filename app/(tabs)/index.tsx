import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, MapPin, Star, Clock, TrendingUp, Music, Users, Phone, Zap, Siren as Fire, ChevronDown, RefreshCw, ExternalLink, Heart } from 'lucide-react-native';
import * as Location from 'expo-location';
import BookingModal from '@/components/BookingModal';
import CitySelectionModal from '@/components/CitySelectionModal';
import { mapService, VenueLocation } from '@/services/mapService';

const { width } = Dimensions.get('window');

interface City {
  id: string;
  name: string;
  state: string;
  displayName: string;
  isPopular: boolean;
}

// Default center coordinates for cities
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
  'Houston, TX': { lat: 29.7604, lng: -95.3698 },
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
  'Oklahoma City, OK': { lat: 35.4676, lng: -97.5164 },
  'Tulsa, OK': { lat: 36.1540, lng: -95.9928 },
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Dallas, TX');
  const [venues, setVenues] = useState<VenueLocation[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<'google' | 'mock'>('mock');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getLocationAsync();
    }
    loadVenues();
  }, [selectedCity]);

  // Auto-refresh every 10 minutes for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      loadVenues();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCity]);

  const getLocationAsync = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location access helps us find the best nightlife spots near you.',
          [{ text: 'OK' }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadVenues = async () => {
    try {
      setLoading(true);
      const center = location?.coords || cityCoordinates[selectedCity] || cityCoordinates['Dallas, TX'];
      
      console.log('🔍 Loading venues for:', selectedCity, center);
      
      const allVenues = await mapService.getNightlifeVenues(
        { lat: center.latitude || center.lat, lng: center.longitude || center.lng },
        15, // 15km radius
        selectedCity
      );

      console.log(`✅ Loaded ${allVenues.length} venues`);

      // Determine data source based on venue IDs
      const isGoogleData = allVenues.some(venue => !venue.id.startsWith('mock-'));
      setDataSource(isGoogleData ? 'google' : 'mock');

      // Calculate distances if we have user location
      if (location?.coords) {
        allVenues.forEach(venue => {
          venue.distance = mapService.calculateDistance(
            { lat: location.coords.latitude, lng: location.coords.longitude },
            { lat: venue.latitude, lng: venue.longitude }
          );
        });
      }

      // Sort by busyness score (highest first) and then by rating
      const sortedVenues = allVenues.sort((a, b) => {
        if (b.busynessScore !== a.busynessScore) {
          return b.busynessScore - a.busynessScore;
        }
        return b.rating - a.rating;
      });
      
      setVenues(sortedVenues);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading venues:', error);
      Alert.alert(
        'Error Loading Venues',
        'Unable to load real-time venue data. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadVenues();
  };

  const toggleFavorite = (venueId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(venueId)) {
      newFavorites.delete(venueId);
    } else {
      newFavorites.add(venueId);
    }
    setFavorites(newFavorites);
  };

  const getBusynessColor = (busyness: string) => {
    switch (busyness) {
      case 'low': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'very-high': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getBusynessLabel = (busyness: string) => {
    switch (busyness) {
      case 'low': return 'Chill';
      case 'moderate': return 'Getting Busy';
      case 'high': return 'Popping';
      case 'very-high': return 'Packed';
      default: return 'Unknown';
    }
  };

  const getBusynessIcon = (busyness: string) => {
    switch (busyness) {
      case 'low': return <Users size={12} color="#10B981" />;
      case 'moderate': return <Zap size={12} color="#F59E0B" />;
      case 'high': return <Fire size={12} color="#EF4444" />;
      case 'very-high': return <Fire size={12} color="#DC2626" />;
      default: return <Users size={12} color="#6B7280" />;
    }
  };

  const handleBookVenue = (venue: VenueLocation) => {
    setSelectedVenue(venue);
    setBookingModalVisible(true);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.displayName);
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderVenueCard = (venue: VenueLocation, isHorizontal = false) => (
    <TouchableOpacity 
      key={venue.id} 
      style={[
        styles.venueCard,
        isHorizontal && styles.horizontalVenueCard
      ]}
      activeOpacity={0.8}>
      <View style={styles.venueImageContainer}>
        <Image source={{ uri: venue.image }} style={styles.venueImage} />
        
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(venue.id)}
          activeOpacity={0.8}>
          <Heart 
            size={16} 
            color={favorites.has(venue.id) ? "#EF4444" : "#FFFFFF"}
            fill={favorites.has(venue.id) ? "#EF4444" : "none"}
          />
        </TouchableOpacity>

        {/* Data Source Badge */}
        {dataSource === 'google' && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}

        {/* Busyness Indicator */}
        <View style={[styles.busynessIndicator, { backgroundColor: getBusynessColor(venue.busyness) }]}>
          <Text style={styles.busynessText}>{venue.busynessScore}%</Text>
        </View>
      </View>
      
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <Text style={styles.venueName} numberOfLines={1}>{venue.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{venue.rating}</Text>
            {venue.userRatingsTotal && (
              <Text style={styles.reviewCount}>({venue.userRatingsTotal})</Text>
            )}
          </View>
        </View>
        
        <View style={styles.venueDetails}>
          <View style={styles.detailRow}>
            <MapPin size={10} color="#6B7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              {venue.address.split(',')[0]}
            </Text>
            {venue.distance && (
              <Text style={styles.distanceText}>• {venue.distance.toFixed(1)}km</Text>
            )}
          </View>
          
          <View style={styles.detailRow}>
            {getBusynessIcon(venue.busyness)}
            <Text style={[styles.detailText, { color: getBusynessColor(venue.busyness) }]}>
              {getBusynessLabel(venue.busyness)}
            </Text>
            <Text style={styles.priceText}>{venue.priceRange}</Text>
            <View style={[styles.statusDot, { backgroundColor: venue.isOpen ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.statusText, { color: venue.isOpen ? '#10B981' : '#EF4444' }]}>
              {venue.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          {venue.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleBookVenue(venue)}
          activeOpacity={0.8}>
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const currentHour = new Date().getHours();
  const isNightlifeTime = currentHour >= 18 || currentHour <= 6;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>
                {isNightlifeTime ? 'Tonight\'s' : 'Discover'}
              </Text>
              <Text style={styles.titleText}>Hottest Spots</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={loading}
              activeOpacity={0.8}>
              <RefreshCw 
                size={20} 
                color={loading ? "#6B7280" : "#3B82F6"} 
                style={loading ? { opacity: 0.5 } : {}}
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setCityModalVisible(true)}
            activeOpacity={0.8}>
            <MapPin size={16} color="#3B82F6" />
            <Text style={styles.locationText}>{selectedCity}</Text>
            <ChevronDown size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { 
              backgroundColor: dataSource === 'google' ? '#10B981' : '#F59E0B' 
            }]} />
            <Text style={styles.statusText}>
              {dataSource === 'google' ? 'Live Data' : 'Demo Mode'} • {venues.length} venues
            </Text>
          </View>
          <Text style={styles.lastUpdatedText}>
            Updated {formatLastUpdated()}
          </Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues, events, or vibes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
          <Filter size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {loading && venues.length === 0 ? (
          <View style={styles.loadingState}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.loadingIconContainer}>
              <RefreshCw size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.loadingTitle}>Finding Live Venues</Text>
            <Text style={styles.loadingSubtitle}>
              {dataSource === 'google' 
                ? 'Searching Google Places API for real nightlife venues...'
                : 'Loading demo venues for your area...'
              }
            </Text>
          </View>
        ) : filteredVenues.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#6B7280', '#4B5563']}
              style={styles.emptyIconContainer}>
              <Search size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No venues found' : `No venues in ${selectedCity}`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try different keywords or browse all venues'
                : 'Try selecting a different city'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.changeCityButton}
                onPress={() => setCityModalVisible(true)}
                activeOpacity={0.8}>
                <Text style={styles.changeCityText}>Change City</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {/* Data Source Info */}
            <View style={styles.dataSourceInfo}>
              <View style={styles.dataSourceCard}>
                <View style={styles.dataSourceHeader}>
                  <ExternalLink size={16} color={dataSource === 'google' ? '#10B981' : '#F59E0B'} />
                  <Text style={styles.dataSourceTitle}>
                    {dataSource === 'google' ? 'Live Google Places Data' : 'Demo Mode'}
                  </Text>
                </View>
                <Text style={styles.dataSourceDescription}>
                  {dataSource === 'google' 
                    ? 'Real venues with live ratings, reviews, and photos from Google Places API'
                    : 'Sample venues for demonstration. Configure Google Places API for real data.'
                  }
                </Text>
              </View>
            </View>

            {/* Trending Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color="#EF4444" />
                <Text style={styles.sectionTitle}>
                  {isNightlifeTime ? 'Trending Now' : 'Tonight\'s Picks'}
                </Text>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}>
                {filteredVenues
                  .filter(v => v.busyness === 'high' || v.busyness === 'very-high')
                  .slice(0, 5)
                  .map(venue => renderVenueCard(venue, true))}
              </ScrollView>
            </View>

            {/* Open Now Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Open Now</Text>
              </View>
              
              {filteredVenues
                .filter(v => v.isOpen)
                .slice(0, 6)
                .map(venue => renderVenueCard(venue))}
            </View>

            {/* Categories */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <View style={styles.categoryGrid}>
                <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.categoryIconContainer}>
                    <Music size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.categoryText}>Clubs</Text>
                  <Text style={styles.categorySubtext}>Dance & DJ</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.categoryIconContainer}>
                    <Users size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.categoryText}>Bars</Text>
                  <Text style={styles.categorySubtext}>Drinks & Vibes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.categoryIconContainer}>
                    <Star size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.categoryText}>Hookah</Text>
                  <Text style={styles.categorySubtext}>Relax & Chill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {selectedVenue && (
        <BookingModal
          visible={bookingModalVisible}
          onClose={() => setBookingModalVisible(false)}
          venueName={selectedVenue.name}
          venuePhone={selectedVenue.phone}
        />
      )}

      <CitySelectionModal
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelectCity={handleCitySelect}
        selectedCity={selectedCity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  titleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
  },
  refreshButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
  },
  locationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#D1D5DB',
  },
  lastUpdatedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  dataSourceInfo: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dataSourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dataSourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dataSourceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#111827',
  },
  dataSourceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },
  loadingIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  changeCityButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  changeCityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
    gap: 16,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  horizontalVenueCard: {
    width: width * 0.8,
    marginHorizontal: 0,
  },
  venueImageContainer: {
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  liveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  busynessIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  busynessText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  venueContent: {
    padding: 20,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#D97706',
  },
  reviewCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#92400E',
  },
  venueDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  distanceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  priceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#10B981',
    marginLeft: 'auto',
    marginRight: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  categorySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});