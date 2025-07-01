import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Radio, 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Star,
  Zap,
  Siren as Fire,
  Music,
  Calendar,
  TrendingUp,
  RefreshCw,
  ChevronRight
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { mapService, VenueLocation } from '@/services/mapService';
import BookingModal from '@/components/BookingModal';

interface LiveEvent {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'dj_set' | 'live_music' | 'happy_hour' | 'special_event';
  isLive: boolean;
  attendeeCount?: number;
}

interface VenueActivity {
  venueId: string;
  currentCapacity: number;
  maxCapacity: number;
  waitTime: number; // minutes
  lastUpdate: string;
  trending: boolean;
  peakTime: boolean;
}

export default function LiveScreen() {
  const [venues, setVenues] = useState<VenueLocation[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [venueActivities, setVenueActivities] = useState<VenueActivity[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (Platform.OS !== 'web') {
      getLocationAsync();
    }
    loadLiveData();
  }, []);

  // Auto-refresh every 2 minutes for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      loadLiveData();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getLocationAsync = async () => {
    if (Platform.OS === 'web') return;
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location access helps us show you the hottest spots nearby.',
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

  const loadLiveData = async () => {
    try {
      setLoading(true);
      
      // Get current location or default to Dallas
      const center = location?.coords || { latitude: 32.7767, longitude: -96.7970 };
      
      // Load venues
      const allVenues = await mapService.getNightlifeVenues(
        { lat: center.latitude, lng: center.longitude },
        10, // 10km radius for live data
        'Dallas, TX'
      );

      // Filter for venues that are currently open and busy
      const currentHour = new Date().getHours();
      const isNightlifeTime = currentHour >= 18 || currentHour <= 6; // 6PM to 6AM
      
      const activeVenues = allVenues.filter(venue => 
        venue.isOpen && (isNightlifeTime ? venue.busynessScore >= 40 : venue.busynessScore >= 60)
      );

      // Sort by busyness and rating
      const sortedVenues = activeVenues.sort((a, b) => {
        if (b.busynessScore !== a.busynessScore) {
          return b.busynessScore - a.busynessScore;
        }
        return b.rating - a.rating;
      });

      setVenues(sortedVenues.slice(0, 10)); // Top 10 venues

      // Generate mock live events and activities
      generateLiveEvents(sortedVenues);
      generateVenueActivities(sortedVenues);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading live data:', error);
      Alert.alert(
        'Error',
        'Unable to load live venue data. Please check your connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateLiveEvents = (venues: VenueLocation[]) => {
    const eventTypes = ['dj_set', 'live_music', 'happy_hour', 'special_event'] as const;
    const eventTitles = {
      dj_set: ['DJ Night', 'Electronic Vibes', 'House Music Set', 'Dance Party'],
      live_music: ['Live Band', 'Acoustic Night', 'Jazz Session', 'Rock Concert'],
      happy_hour: ['Happy Hour', '2-for-1 Drinks', 'Cocktail Special', 'Wine Night'],
      special_event: ['Ladies Night', 'Karaoke Night', 'Trivia Night', 'Theme Party']
    };

    const events: LiveEvent[] = [];
    const currentHour = new Date().getHours();

    venues.slice(0, 6).forEach((venue, index) => {
      if (Math.random() > 0.3) { // 70% chance of having an event
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const titles = eventTitles[type];
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        const isLive = currentHour >= 19 && currentHour <= 2 && Math.random() > 0.4;
        
        events.push({
          id: `event-${venue.id}-${index}`,
          venueId: venue.id,
          venueName: venue.name,
          title,
          description: `Live ${type.replace('_', ' ')} happening now!`,
          startTime: '21:00',
          endTime: '02:00',
          type,
          isLive,
          attendeeCount: isLive ? Math.floor(Math.random() * 150) + 50 : undefined
        });
      }
    });

    setLiveEvents(events);
  };

  const generateVenueActivities = (venues: VenueLocation[]) => {
    const activities: VenueActivity[] = venues.map(venue => {
      const maxCapacity = Math.floor(Math.random() * 200) + 100;
      const currentCapacity = Math.floor((venue.busynessScore / 100) * maxCapacity);
      const waitTime = venue.busynessScore > 80 ? Math.floor(Math.random() * 30) + 10 : 0;
      const trending = venue.busynessScore > 75 && Math.random() > 0.5;
      const peakTime = venue.busynessScore > 85;

      return {
        venueId: venue.id,
        currentCapacity,
        maxCapacity,
        waitTime,
        lastUpdate: new Date().toISOString(),
        trending,
        peakTime
      };
    });

    setVenueActivities(activities);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLiveData();
  };

  const handleBookVenue = (venue: VenueLocation) => {
    setSelectedVenue(venue);
    setBookingModalVisible(true);
  };

  const getActivityColor = (activity: VenueActivity) => {
    const percentage = (activity.currentCapacity / activity.maxCapacity) * 100;
    if (percentage >= 90) return '#FF3B30';
    if (percentage >= 70) return '#FF9500';
    if (percentage >= 50) return '#FFCC00';
    return '#34C759';
  };

  const getActivityLabel = (activity: VenueActivity) => {
    const percentage = (activity.currentCapacity / activity.maxCapacity) * 100;
    if (percentage >= 90) return 'PACKED';
    if (percentage >= 70) return 'BUSY';
    if (percentage >= 50) return 'MODERATE';
    return 'CHILL';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'dj_set': return <Music size={16} color="#6464FF" />;
      case 'live_music': return <Radio size={16} color="#FF9500" />;
      case 'happy_hour': return <Clock size={16} color="#34C759" />;
      case 'special_event': return <Star size={16} color="#FFCC00" />;
      default: return <Calendar size={16} color="#8E8E93" />;
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const currentHour = new Date().getHours();
  const isNightlifeTime = currentHour >= 18 || currentHour <= 6;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.headerTitle}>Right Now</Text>
          <Text style={styles.headerSubtitle}>
            {isNightlifeTime ? 'Prime nightlife hours' : 'Early evening vibes'}
          </Text>
        </View>
        
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {venues.length} venues • Updated {formatLastUpdated()}
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={loading}>
            <RefreshCw 
              size={16} 
              color={loading ? "#8E8E93" : "#42E5E5"} 
              style={loading ? { opacity: 0.5 } : {}}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Live Events Section */}
        {liveEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Radio size={20} color="#FF3B30" />
              <Text style={styles.sectionTitle}>Live Events</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalScrollContent}>
              {liveEvents.filter(event => event.isLive).map(event => (
                <View key={event.id} style={styles.eventCard}>
                  <LinearGradient
                    colors={['#FF3B30', '#FF6B6B']}
                    style={styles.eventGradient}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventLiveIndicator}>
                        <View style={styles.eventLiveDot} />
                        <Text style={styles.eventLiveText}>LIVE</Text>
                      </View>
                      {getEventIcon(event.type)}
                    </View>
                    
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventVenue}>{event.venueName}</Text>
                    
                    {event.attendeeCount && (
                      <View style={styles.eventAttendees}>
                        <Users size={14} color="#FFFFFF" />
                        <Text style={styles.eventAttendeesText}>
                          {event.attendeeCount} people
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trending Venues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#6464FF" />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          
          {venues.filter((_, index) => {
            const activity = venueActivities.find(a => a.venueId === venues[index]?.id);
            return activity?.trending;
          }).slice(0, 3).map(venue => {
            const activity = venueActivities.find(a => a.venueId === venue.id);
            if (!activity) return null;

            return (
              <TouchableOpacity 
                key={venue.id} 
                style={styles.trendingCard}
                onPress={() => handleBookVenue(venue)}>
                <View style={styles.trendingContent}>
                  <View style={styles.trendingHeader}>
                    <Text style={styles.trendingName}>{venue.name}</Text>
                    <View style={styles.trendingBadge}>
                      <Fire size={12} color="#FFFFFF" />
                      <Text style={styles.trendingBadgeText}>TRENDING</Text>
                    </View>
                  </View>
                  
                  <View style={styles.trendingDetails}>
                    <View style={styles.trendingDetail}>
                      <MapPin size={12} color="#8E8E93" />
                      <Text style={styles.trendingDetailText}>
                        {venue.address.split(',')[0]}
                      </Text>
                    </View>
                    
                    <View style={styles.trendingDetail}>
                      <Users size={12} color={getActivityColor(activity)} />
                      <Text style={[styles.trendingDetailText, { color: getActivityColor(activity) }]}>
                        {getActivityLabel(activity)} • {activity.currentCapacity}/{activity.maxCapacity}
                      </Text>
                    </View>
                    
                    {activity.waitTime > 0 && (
                      <View style={styles.trendingDetail}>
                        <Clock size={12} color="#FF9500" />
                        <Text style={[styles.trendingDetailText, { color: '#FF9500' }]}>
                          ~{activity.waitTime}min wait
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <ChevronRight size={20} color="#8E8E93" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* All Active Venues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#42E5E5" />
            <Text style={styles.sectionTitle}>Active Venues</Text>
          </View>
          
          {venues.map(venue => {
            const activity = venueActivities.find(a => a.venueId === venue.id);
            const event = liveEvents.find(e => e.venueId === venue.id);

            return (
              <TouchableOpacity 
                key={venue.id} 
                style={styles.venueCard}
                onPress={() => handleBookVenue(venue)}>
                <View style={styles.venueContent}>
                  <View style={styles.venueHeader}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <View style={styles.venueRating}>
                      <Star size={12} color="#FFCC00" fill="#FFCC00" />
                      <Text style={styles.venueRatingText}>{venue.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.venueDetails}>
                    <View style={styles.venueDetail}>
                      <MapPin size={12} color="#8E8E93" />
                      <Text style={styles.venueDetailText} numberOfLines={1}>
                        {venue.address.split(',')[0]}
                      </Text>
                    </View>
                    
                    {activity && (
                      <View style={styles.venueDetail}>
                        <Users size={12} color={getActivityColor(activity)} />
                        <Text style={[styles.venueDetailText, { color: getActivityColor(activity) }]}>
                          {getActivityLabel(activity)} ({venue.busynessScore}%)
                        </Text>
                        {activity.peakTime && (
                          <View style={styles.peakBadge}>
                            <Text style={styles.peakBadgeText}>PEAK</Text>
                          </View>
                        )}
                      </View>
                    )}
                    
                    {event && (
                      <View style={styles.venueDetail}>
                        {getEventIcon(event.type)}
                        <Text style={styles.venueDetailText}>
                          {event.title} {event.isLive ? '• LIVE' : '• Later'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleBookVenue(venue)}>
                  <Phone size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Events */}
        {liveEvents.filter(event => !event.isLive).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#8383FF" />
              <Text style={styles.sectionTitle}>Coming Up</Text>
            </View>
            
            {liveEvents.filter(event => !event.isLive).map(event => (
              <View key={event.id} style={styles.upcomingCard}>
                <View style={styles.upcomingContent}>
                  <View style={styles.upcomingHeader}>
                    {getEventIcon(event.type)}
                    <Text style={styles.upcomingTitle}>{event.title}</Text>
                  </View>
                  <Text style={styles.upcomingVenue}>{event.venueName}</Text>
                  <Text style={styles.upcomingTime}>
                    {event.startTime} - {event.endTime}
                  </Text>
                </View>
              </View>
            ))}
          </View>
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
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  liveText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FF3B30',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#C7C7CC',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  refreshButton: {
    padding: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  horizontalScroll: {
    paddingLeft: 24,
  },
  horizontalScrollContent: {
    paddingRight: 24,
    gap: 16,
  },
  eventCard: {
    width: 280,
    borderRadius: 20,
    overflow: 'hidden',
  },
  eventGradient: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  eventLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  eventLiveText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventVenue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventAttendeesText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  trendingContent: {
    flex: 1,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  trendingDetails: {
    gap: 6,
  },
  trendingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendingDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  venueContent: {
    flex: 1,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
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
  venueRatingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFCC00',
  },
  venueDetails: {
    gap: 6,
  },
  venueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
    flex: 1,
  },
  peakBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  peakBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  callButton: {
    backgroundColor: '#6464FF',
    borderRadius: 12,
    padding: 12,
    marginLeft: 12,
  },
  upcomingCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  upcomingContent: {
    gap: 6,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  upcomingTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  upcomingVenue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
  },
  upcomingTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
  },
});