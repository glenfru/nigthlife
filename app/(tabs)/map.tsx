import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Navigation, Filter, Star, Users, Clock, Siren as Fire, Zap, RefreshCw, ChevronDown } from 'lucide-react-native';
import * as Location from 'expo-location';
import { VenueLocation, BusynessData, mapService } from '@/services/mapService';
import MapView from '@/components/MapView';
import CitySelectionModal from '@/components/CitySelectionModal';

interface City {
  id: string;
  name: string;
  state: string;
  displayName: string;
  isPopular: boolean;
}

export default function MapScreen() {
  const [venues, setVenues] = useState<VenueLocation[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCity, setSelectedCity] = useState('Dallas, TX');
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filterActive, setFilterActive] = useState(false);

  // Default center coordinates for cities
  const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
    'Houston, TX': { lat: 29.7604, lng: -95.3698 },
    'Austin, TX': { lat: 30.2672, lng: -97.7431 },
    'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
    'Oklahoma City, OK': { lat: 35.4676, lng: -97.5164 },
    'Tulsa, OK': { lat: 36.1540, lng: -95.9928 },
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getLocationAsync();
    }
    loadVenues();
  }, [selectedCity]);

  useEffect(() => {
    // Auto-refresh every 5 minutes for real-time data
    const interval = setInterval(() => {
      loadVenues();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedCity]);

  const getLocationAsync = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location access is needed to show nearby venues and provide accurate directions.',
          [{ text: 'OK' }]
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadVenues = async () => {
    try {
      setLoading(true);
      const center = userLocation?.coords || cityCoordinates[selectedCity] || cityCoordinates['Dallas, TX'];
      
      const allVenues = await mapService.getNightlifeVenues(
        { lat: center.latitude || center.lat, lng: center.longitude || center.lng },
        15, // 15km radius
        selectedCity
      );

      // Get busyness data
      const busynessData = await mapService.getBusynessData(allVenues.map(v => v.id));
      
      // Filter for venues that are busy during nightlife hours (10pm-8am)
      const nightlifeBusyVenues = mapService.filterNightlifeBusyVenues(allVenues, busynessData);
      
      // Sort by busyness score (highest first)
      const sortedVenues = nightlifeBusyVenues.sort((a, b) => b.busynessScore - a.busynessScore);
      
      setVenues(sortedVenues);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading venues:', error);
      Alert.alert(
        'Error',
        'Failed to load venue data. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadVenues();
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.displayName);
    setSelectedVenue(null);
  };

  const getBusynessColor = (busyness: string) => {
    switch (busyness) {
      case 'low': return '#34C759';
      case 'moderate': return '#FFCC00';
      case 'high': return '#FF9500';
      case 'very-high': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getBusynessIcon = (busyness: string) => {
    switch (busyness) {
      case 'low': return <Users size={12} color="#34C759" />;
      case 'moderate': return <Zap size={12} color="#FFCC00" />;
      case 'high': return <Fire size={12} color="#FF9500" />;
      case 'very-high': return <Fire size={12} color="#FF3B30" />;
      default: return <Users size={12} color="#8E8E93" />;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'club': return '🎵';
      case 'bar': return '🍸';
      case 'hookah': return '💨';
      default: return '📍';
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  const currentHour = new Date().getHours();
  const isNightlifeTime = currentHour >= 22 || currentHour <= 8;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Live Nightlife Map</Text>
            <TouchableOpacity 
              style={styles.locationContainer}
              onPress={() => setCityModalVisible(true)}>
              <MapPin size={14} color="#42E5E5" />
              <Text style={styles.headerSubtitle}>{selectedCity}</Text>
              <ChevronDown size={14} color="#42E5E5" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={loading}>
              <RefreshCw 
                size={20} 
                color={loading ? "#8E8E93" : "#42E5E5"} 
                style={loading ? { opacity: 0.5 } : {}}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filterActive && styles.filterButtonActive]}
              onPress={() => setFilterActive(!filterActive)}>
              <Filter size={20} color={filterActive ? "#FFFFFF" : "#6464FF"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { 
              backgroundColor: isNightlifeTime ? '#34C759' : '#FFCC00' 
            }]} />
            <Text style={styles.statusText}>
              {isNightlifeTime ? 'Prime Time' : 'Day Time'} • {venues.length} venues
            </Text>
          </View>
          <Text style={styles.lastUpdated}>Updated {formatLastUpdated()}</Text>
        </View>
      </LinearGradient>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          center={userLocation?.coords || cityCoordinates[selectedCity] || cityCoordinates['Dallas, TX']}
          venues={venues}
          onVenueSelect={setSelectedVenue}
          selectedVenue={selectedVenue}
          city={selectedCity}
        />
      </View>

      {/* Venue List */}
      <View style={styles.venueList}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {isNightlifeTime ? 'Hottest Spots Right Now' : 'Tonight\'s Top Picks'}
          </Text>
          <Text style={styles.listSubtitle}>
            {isNightlifeTime 
              ? 'Live busyness data • Tap for details'
              : 'Predicted to be busy 10PM-8AM'
            }
          </Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.venueScrollView}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading live data...</Text>
            </View>
          ) : venues.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Fire size={48} color="#8E8E93" />
              <Text style={styles.emptyTitle}>No Hot Spots Found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different city or check back later
              </Text>
            </View>
          ) : (
            venues.map((venue) => (
              <TouchableOpacity
                key={venue.id}
                style={[
                  styles.venueItem,
                  selectedVenue?.id === venue.id && styles.selectedVenueItem
                ]}
                onPress={() => setSelectedVenue(venue)}>
                <View style={styles.venueInfo}>
                  <View style={styles.venueHeader}>
                    <View style={styles.venueTitleRow}>
                      <Text style={styles.venueName}>{venue.name}</Text>
                      <Text style={styles.venueType}>{getTypeIcon(venue.type)}</Text>
                    </View>
                    <View style={styles.venueMetrics}>
                      <View style={styles.venueRating}>
                        <Star size={12} color="#FFCC00" fill="#FFCC00" />
                        <Text style={styles.ratingText}>{venue.rating}</Text>
                      </View>
                      <View style={styles.busynessScore}>
                        <Text style={[styles.scoreText, { 
                          color: getBusynessColor(venue.busyness) 
                        }]}>
                          {venue.busynessScore}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.venueDetails}>
                    <View style={styles.venueDetailItem}>
                      {getBusynessIcon(venue.busyness)}
                      <Text style={[styles.detailText, { color: getBusynessColor(venue.busyness) }]}>
                        {getBusynessLabel(venue.busyness)}
                      </Text>
                    </View>
                    
                    <View style={styles.venueDetailItem}>
                      <MapPin size={12} color="#8E8E93" />
                      <Text style={styles.detailText}>
                        {userLocation 
                          ? `${mapService.calculateDistance(
                              { lat: userLocation.coords.latitude, lng: userLocation.coords.longitude },
                              { lat: venue.latitude, lng: venue.longitude }
                            ).toFixed(1)}km away`
                          : venue.address.split(',')[1]?.trim()
                        }
                      </Text>
                    </View>
                    
                    {venue.isOpen && (
                      <View style={styles.venueDetailItem}>
                        <Clock size={12} color="#34C759" />
                        <Text style={[styles.detailText, { color: '#34C759' }]}>Open Now</Text>
                      </View>
                    )}
                  </View>

                  {venue.peakHours && venue.peakHours.length > 0 && (
                    <View style={styles.peakHours}>
                      <Text style={styles.peakHoursLabel}>Peak: </Text>
                      <Text style={styles.peakHoursText}>
                        {venue.peakHours.slice(0, 3).join(', ')}
                        {venue.peakHours.length > 3 && '...'}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={[styles.typeIndicator, { backgroundColor: getBusynessColor(venue.busyness) }]}>
                  <Text style={styles.typeEmoji}>{getTypeIcon(venue.type)}</Text>
                  {venue.busyness === 'very-high' && (
                    <View style={styles.hotIndicator}>
                      <Fire size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

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
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  headerSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#42E5E5',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  filterButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  filterButtonActive: {
    backgroundColor: '#6464FF',
    borderColor: '#6464FF',
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
    color: '#C7C7CC',
  },
  lastUpdated: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  venueList: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  listHeader: {
    marginBottom: 20,
  },
  listTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  listSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  venueScrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  selectedVenueItem: {
    backgroundColor: '#3C3C3E',
    borderColor: '#6464FF',
    shadowColor: '#6464FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  venueInfo: {
    flex: 1,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  venueType: {
    fontSize: 16,
  },
  venueMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3C3C3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFCC00',
  },
  busynessScore: {
    backgroundColor: '#3C3C3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  venueDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  venueDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
  },
  peakHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peakHoursLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
  },
  peakHoursText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#C7C7CC',
  },
  typeIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'relative',
  },
  typeEmoji: {
    fontSize: 20,
  },
  hotIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});