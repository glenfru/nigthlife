import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { 
  Star, 
  MapPin, 
  Users,
  Clock,
  Heart,
} from 'lucide-react-native';

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    type: 'bar' | 'club' | 'hookah';
    city: string;
    state: string;
    rating: number;
    priceRange: '$' | '$$' | '$$$';
    distance?: number;
    image: string;
    isOpen: boolean;
    busyness: 'low' | 'moderate' | 'high' | 'very-high';
    features: string[];
  };
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function VenueCard({ venue, onPress, onFavorite, isFavorite = false }: VenueCardProps) {
  const getBusynessColor = (busyness: string) => {
    switch (busyness) {
      case 'low': return '#22c55e';
      case 'moderate': return '#eab308';
      case 'high': return '#f97316';
      case 'very-high': return '#ef4444';
      default: return '#6b7280';
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: venue.image }} style={styles.image} />
      
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={onFavorite}>
        <Heart 
          size={20} 
          color={isFavorite ? "#e94560" : "#ffffff"}
          fill={isFavorite ? "#e94560" : "none"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{venue.name}</Text>
          <View style={styles.rating}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.ratingText}>{venue.rating}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MapPin size={12} color="#6b7280" />
            <Text style={styles.detailText}>{venue.city}, {venue.state}</Text>
            {venue.distance && (
              <Text style={styles.distanceText}>• {venue.distance}mi</Text>
            )}
          </View>

          <View style={styles.detailRow}>
            <Users size={12} color={getBusynessColor(venue.busyness)} />
            <Text style={[styles.detailText, { color: getBusynessColor(venue.busyness) }]}>
              {getBusynessLabel(venue.busyness)}
            </Text>
            <Text style={styles.priceText}>{venue.priceRange}</Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={12} color={venue.isOpen ? '#22c55e' : '#ef4444'} />
            <Text style={[styles.detailText, { color: venue.isOpen ? '#22c55e' : '#ef4444' }]}>
              {venue.isOpen ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        </View>

        <View style={styles.features}>
          {venue.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#2a2a3e',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fbbf24',
  },
  details: {
    gap: 4,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
  },
  distanceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  priceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#22c55e',
    marginLeft: 'auto',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8b8b9a',
  },
});