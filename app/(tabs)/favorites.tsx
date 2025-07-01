import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Star, MapPin, Users, Clock, Trash2, Share, Siren as Fire, Zap } from 'lucide-react-native';

interface FavoriteVenue {
  id: string;
  name: string;
  type: 'bar' | 'club' | 'hookah';
  city: string;
  state: string;
  rating: number;
  image: string;
  isOpen: boolean;
  busyness: 'low' | 'moderate' | 'high' | 'very-high';
  address: string;
  savedDate: string;
}

const SAMPLE_FAVORITES: FavoriteVenue[] = [
  {
    id: '1',
    name: 'Neon Nights',
    type: 'club',
    city: 'Dallas',
    state: 'TX',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg',
    isOpen: true,
    busyness: 'high',
    address: '123 Main St, Dallas, TX',
    savedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'The Velvet Lounge',
    type: 'bar',
    city: 'Austin',
    state: 'TX',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg',
    isOpen: false,
    busyness: 'moderate',
    address: '456 Elm St, Austin, TX',
    savedDate: '2024-01-12',
  },
  {
    id: '3',
    name: 'Cloud 9 Hookah',
    type: 'hookah',
    city: 'Houston',
    state: 'TX',
    rating: 4.0,
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    isOpen: true,
    busyness: 'low',
    address: '789 Oak Ave, Houston, TX',
    savedDate: '2024-01-10',
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteVenue[]>(SAMPLE_FAVORITES);

  const removeFavorite = (venueId: string) => {
    setFavorites(favorites.filter(venue => venue.id !== venueId));
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
      case 'low': return <Users size={14} color="#34C759" />;
      case 'moderate': return <Zap size={14} color="#FFCC00" />;
      case 'high': return <Fire size={14} color="#FF9500" />;
      case 'very-high': return <Fire size={14} color="#FF3B30" />;
      default: return <Users size={14} color="#8E8E93" />;
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

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1C1C1E', '#2C2C2E']}
          style={styles.header}>
          <Text style={styles.headerTitle}>Your Favorites</Text>
          <Text style={styles.headerSubtitle}>Saved venues appear here</Text>
        </LinearGradient>
        
        <View style={styles.emptyState}>
          <LinearGradient
            colors={['#6464FF', '#8383FF']}
            style={styles.emptyIconContainer}>
            <Heart size={48} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring and save your favorite venues to see them here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Your Favorites</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} saved venues</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Share size={20} color="#6464FF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favorites.map((venue) => (
          <View key={venue.id} style={styles.favoriteCard}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            
            <View style={styles.venueContent}>
              <View style={styles.venueHeader}>
                <View style={styles.venueTitle}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  <Text style={styles.venueType}>{getTypeIcon(venue.type)}</Text>
                </View>
                
                <View style={styles.venueActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => removeFavorite(venue.id)}>
                    <Trash2 size={18} color="#FF3B30" />
                  </TouchableOpacity>
                  <Heart size={18} color="#6464FF" fill="#6464FF" />
                </View>
              </View>

              <View style={styles.venueInfo}>
                <View style={styles.infoRow}>
                  <Star size={14} color="#FFCC00" fill="#FFCC00" />
                  <Text style={styles.rating}>{venue.rating}</Text>
                  <Text style={styles.separator}>•</Text>
                  <MapPin size={14} color="#8E8E93" />
                  <Text style={styles.location}>{venue.city}, {venue.state}</Text>
                </View>

                <View style={styles.infoRow}>
                  {getBusynessIcon(venue.busyness)}
                  <Text style={[styles.busyness, { color: getBusynessColor(venue.busyness) }]}>
                    {getBusynessLabel(venue.busyness)}
                  </Text>
                  <Text style={styles.separator}>•</Text>
                  <Clock size={14} color={venue.isOpen ? '#34C759' : '#FF3B30'} />
                  <Text style={[styles.status, { color: venue.isOpen ? '#34C759' : '#FF3B30' }]}>
                    {venue.isOpen ? 'Open Now' : 'Closed'}
                  </Text>
                </View>

                <Text style={styles.address}>{venue.address}</Text>
                <Text style={styles.savedDate}>
                  Saved on {new Date(venue.savedDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
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
  shareButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
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
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#C7C7CC',
    textAlign: 'center',
    lineHeight: 24,
  },
  favoriteCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3C3C3E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  venueImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#3C3C3E',
  },
  venueContent: {
    padding: 20,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  venueTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  venueType: {
    fontSize: 18,
  },
  venueActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#3C3C3E',
    borderRadius: 12,
  },
  venueInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFCC00',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
  },
  busyness: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  status: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  separator: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 4,
  },
  savedDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
});