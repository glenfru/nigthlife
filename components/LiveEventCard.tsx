import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Music, 
  Radio, 
  Clock, 
  Star, 
  Users, 
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react-native';

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
  venueAddress?: string;
}

interface LiveEventCardProps {
  event: LiveEvent;
  onPress?: () => void;
  onVenuePress?: () => void;
  size?: 'compact' | 'full';
}

export default function LiveEventCard({ 
  event, 
  onPress, 
  onVenuePress,
  size = 'full' 
}: LiveEventCardProps) {
  
  const getEventIcon = (type: string, iconSize: number = 20) => {
    switch (type) {
      case 'dj_set': return <Music size={iconSize} color="#FFFFFF" />;
      case 'live_music': return <Radio size={iconSize} color="#FFFFFF" />;
      case 'happy_hour': return <Clock size={iconSize} color="#FFFFFF" />;
      case 'special_event': return <Star size={iconSize} color="#FFFFFF" />;
      default: return <Calendar size={iconSize} color="#FFFFFF" />;
    }
  };

  const getEventGradient = (type: string) => {
    switch (type) {
      case 'dj_set': return ['#6464FF', '#8383FF'];
      case 'live_music': return ['#FF9500', '#FFB347'];
      case 'happy_hour': return ['#34C759', '#5AC777'];
      case 'special_event': return ['#FFCC00', '#FFD700'];
      default: return ['#8E8E93', '#A8A8A8'];
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'dj_set': return 'DJ SET';
      case 'live_music': return 'LIVE MUSIC';
      case 'happy_hour': return 'HAPPY HOUR';
      case 'special_event': return 'SPECIAL EVENT';
      default: return 'EVENT';
    }
  };

  if (size === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <LinearGradient
          colors={getEventGradient(event.type)}
          style={styles.compactGradient}>
          
          <View style={styles.compactHeader}>
            {event.isLive && (
              <View style={styles.compactLiveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.compactLiveText}>LIVE</Text>
              </View>
            )}
            {getEventIcon(event.type, 16)}
          </View>
          
          <Text style={styles.compactTitle} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={styles.compactVenue} numberOfLines={1}>
            {event.venueName}
          </Text>
          
          <Text style={styles.compactTime}>
            {event.startTime} - {event.endTime}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.fullCard} onPress={onPress}>
      <LinearGradient
        colors={getEventGradient(event.type)}
        style={styles.fullGradient}>
        
        <View style={styles.fullHeader}>
          <View style={styles.eventTypeContainer}>
            {getEventIcon(event.type, 18)}
            <Text style={styles.eventTypeText}>
              {getEventTypeLabel(event.type)}
            </Text>
          </View>
          
          {event.isLive && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {event.description}
          </Text>
          
          <TouchableOpacity 
            style={styles.venueInfo}
            onPress={onVenuePress}>
            <MapPin size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.venueName}>{event.venueName}</Text>
            <ExternalLink size={14} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          
          {event.venueAddress && (
            <Text style={styles.venueAddress} numberOfLines={1}>
              {event.venueAddress}
            </Text>
          )}
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.timeInfo}>
            <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.timeText}>
              {event.startTime} - {event.endTime}
            </Text>
          </View>
          
          {event.attendeeCount && (
            <View style={styles.attendeeInfo}>
              <Users size={14} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.attendeeText}>
                {event.attendeeCount} people
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Compact Card Styles
  compactCard: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  compactGradient: {
    padding: 16,
    minHeight: 120,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compactLiveText: {
    fontFamily: 'Inter-Bold',
    fontSize: 8,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  compactTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  compactVenue: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  compactTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Full Card Styles
  fullCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  fullGradient: {
    padding: 20,
  },
  fullHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eventTypeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  eventContent: {
    marginBottom: 16,
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  venueName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  venueAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 22,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  attendeeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
});