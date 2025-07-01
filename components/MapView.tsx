import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Navigation, Zap, Siren as Fire, Users, Phone, ExternalLink } from 'lucide-react-native';
import { VenueLocation, BusynessData, mapService } from '@/services/mapService';

interface MapViewProps {
  center: { lat: number; lng: number };
  venues: VenueLocation[];
  onVenueSelect: (venue: VenueLocation) => void;
  selectedVenue?: VenueLocation | null;
  city: string;
}

const { width, height } = Dimensions.get('window');

export default function MapView({ center, venues, onVenueSelect, selectedVenue, city }: MapViewProps) {
  const [busynessData, setBusynessData] = useState<BusynessData[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    loadBusynessData();
  }, [venues]);

  const loadBusynessData = async () => {
    try {
      setLoading(true);
      const venueIds = venues.map(v => v.id);
      const data = await mapService.getBusynessData(venueIds);
      setBusynessData(data);
    } catch (error) {
      console.error('Error loading busyness data:', error);
    } finally {
      setLoading(false);
    }
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

  const getBusynessIcon = (busyness: string, size: number = 16) => {
    switch (busyness) {
      case 'low': return <Users size={size} color="#34C759" />;
      case 'moderate': return <Zap size={size} color="#FFCC00" />;
      case 'high': return <Fire size={size} color="#FF9500" />;
      case 'very-high': return <Fire size={size} color="#FF3B30" />;
      default: return <Users size={size} color="#8E8E93" />;
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

  const handleVenuePress = (venue: VenueLocation) => {
    onVenueSelect(venue);
  };

  const handleCallVenue = (phone: string) => {
    if (Platform.OS !== 'web') {
      // In a real app, use Linking.openURL(`tel:${phone}`)
      console.log(`Calling ${phone}`);
    } else {
      // For web, show phone number
      alert(`Call: ${phone}`);
    }
  };

  const handleDirections = (venue: VenueLocation) => {
    if (Platform.OS !== 'web') {
      // In a real app, use Linking.openURL with maps URL
      console.log(`Getting directions to ${venue.name}`);
    } else {
      // For web, open Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
      window.open(url, '_blank');
    }
  };

  // For web platform, we'll create an enhanced interactive map simulation
  const renderWebMap = () => (
    <View style={styles.webMapContainer}>
      <LinearGradient
        colors={['#2C2C2E', '#3C3C3E', '#2C2C2E']}
        style={styles.mapBackground}>
        
        {/* Map Grid */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }, (_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, { top: i * 20 }]} />
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineVertical, { left: i * 25 }]} />
          ))}
        </View>

        {/* Center Marker (User Location) */}
        <View style={[styles.userLocationMarker, { 
          top: height * 0.15, 
          left: width * 0.4 
        }]}>
          <LinearGradient
            colors={['#42E5E5', '#38C4C4']}
            style={styles.userMarkerGradient}>
            <Navigation size={16} color="#FFFFFF" />
          </LinearGradient>
        </View>

        {/* Venue Markers */}
        {venues.map((venue, index) => {
          const venueData = busynessData.find(data => data.venueId === venue.id);
          const isSelected = selectedVenue?.id === venue.id;
          
          return (
            <TouchableOpacity
              key={venue.id}
              style={[
                styles.venueMarker,
                {
                  top: height * 0.1 + (index * 40) + Math.sin(index) * 30,
                  left: width * 0.2 + (index * 60) + Math.cos(index) * 40,
                  backgroundColor: getBusynessColor(venue.busyness),
                  transform: [{ scale: isSelected ? 1.2 : 1 }],
                  zIndex: isSelected ? 1000 : 100,
                }
              ]}
              onPress={() => handleVenuePress(venue)}>
              
              {/* Pulse Animation for High Busyness */}
              {venue.busyness === 'very-high' && (
                <View style={[styles.pulseBorder, { 
                  backgroundColor: getBusynessColor(venue.busyness) + '30' 
                }]} />
              )}
              
              <Text style={styles.markerEmoji}>{getTypeIcon(venue.type)}</Text>
              
              {/* Busyness Indicator */}
              <View style={[styles.busynessIndicator, {
                backgroundColor: getBusynessColor(venue.busyness)
              }]}>
                <Text style={styles.busynessText}>
                  {venueData?.currentBusyness || venue.busynessScore}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Selected Venue Info Card */}
        {selectedVenue && (
          <View style={[styles.venueInfoCard, {
            bottom: 20,
            left: 20,
            right: 20,
          }]}>
            <LinearGradient
              colors={['#1C1C1E', '#2C2C2E']}
              style={styles.infoCardGradient}>
              
              <View style={styles.infoCardHeader}>
                <View style={styles.venueMainInfo}>
                  <Text style={styles.infoCardTitle}>{selectedVenue.name}</Text>
                  <Text style={styles.infoCardType}>
                    {getTypeIcon(selectedVenue.type)} {selectedVenue.type.toUpperCase()}
                  </Text>
                </View>
                
                <View style={styles.busynessStatus}>
                  {getBusynessIcon(selectedVenue.busyness, 20)}
                  <Text style={[styles.busynessLabel, { 
                    color: getBusynessColor(selectedVenue.busyness) 
                  }]}>
                    {selectedVenue.busyness === 'very-high' ? 'PACKED' : 
                     selectedVenue.busyness === 'high' ? 'POPPING' :
                     selectedVenue.busyness === 'moderate' ? 'BUSY' : 'CHILL'}
                  </Text>
                </View>
              </View>

              <Text style={styles.infoCardAddress}>{selectedVenue.address}</Text>
              
              <View style={styles.infoCardActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCallVenue(selectedVenue.phone)}>
                  <LinearGradient
                    colors={['#34C759', '#30D158']}
                    style={styles.actionButtonGradient}>
                    <Phone size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDirections(selectedVenue)}>
                  <LinearGradient
                    colors={['#42E5E5', '#38C4C4']}
                    style={styles.actionButtonGradient}>
                    <Navigation size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Directions</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Map Legend */}
        <View style={styles.mapLegend}>
          <Text style={styles.legendTitle}>Live Busyness</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
              <Text style={styles.legendText}>Packed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.legendText}>Popping</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FFCC00' }]} />
              <Text style={styles.legendText}>Busy</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Chill</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? renderWebMap() : (
        <View style={styles.nativeMapPlaceholder}>
          <Text style={styles.nativeMapText}>
            Native map integration available when exported to local development
          </Text>
          <Text style={styles.nativeMapSubtext}>
            Install react-native-maps for full map functionality
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webMapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#6464FF',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#6464FF',
  },
  userLocationMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 500,
  },
  userMarkerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#42E5E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  venueMarker: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pulseBorder: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    top: -12,
    left: -12,
    opacity: 0.6,
  },
  markerEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  busynessIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  busynessText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  venueInfoCard: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  infoCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  infoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  venueMainInfo: {
    flex: 1,
  },
  infoCardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoCardType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  busynessStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3C3C3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  busynessLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  infoCardAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
    marginBottom: 16,
  },
  infoCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  mapLegend: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  legendTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#C7C7CC',
  },
  nativeMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 40,
  },
  nativeMapText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  nativeMapSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});