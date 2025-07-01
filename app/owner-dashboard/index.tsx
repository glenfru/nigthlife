import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Store,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Settings,
  Bell,
  Plus,
  Eye,
  Phone,
  MapPin,
  Clock,
  Star,
  DollarSign,
} from 'lucide-react-native';

interface VenueStats {
  totalViews: number;
  reservationsToday: number;
  avgRating: number;
  monthlyRevenue: number;
}

const SAMPLE_STATS: VenueStats = {
  totalViews: 1247,
  reservationsToday: 8,
  avgRating: 4.5,
  monthlyRevenue: 15420,
};

export default function OwnerDashboardScreen() {
  const [stats] = useState<VenueStats>(SAMPLE_STATS);

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    change, 
    color = '#e94560' 
  }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statChange, { color }]}>{change}</Text>
      </View>
    </View>
  );

  const QuickAction = ({ 
    icon, 
    title, 
    subtitle, 
    onPress,
    color = '#e94560' 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>Neon Nights</Text>
            <Text style={styles.venueType}>Nightclub • Dallas, TX</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={20} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Eye size={20} color="#e94560" />}
              title="Profile Views"
              value={stats.totalViews.toLocaleString()}
              change="+12% from yesterday"
            />
            <StatCard
              icon={<Calendar size={20} color="#22c55e" />}
              title="Reservations"
              value={stats.reservationsToday.toString()}
              change="+3 from yesterday"
              color="#22c55e"
            />
            <StatCard
              icon={<Star size={20} color="#fbbf24" />}
              title="Avg Rating"
              value={stats.avgRating.toString()}
              change="↑ 0.2 this week"
              color="#fbbf24"
            />
            <StatCard
              icon={<DollarSign size={20} color="#8b5cf6" />}
              title="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              change="+8% from last month"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon={<Plus size={24} color="#e94560" />}
              title="Post Update"
              subtitle="Share live updates"
              onPress={() => router.push('/owner-dashboard/promotions')}
            />
            <QuickAction
              icon={<Calendar size={24} color="#22c55e" />}
              title="Reservations"
              subtitle="Manage bookings"
              onPress={() => router.push('/owner-dashboard/reservations')}
              color="#22c55e"
            />
            <QuickAction
              icon={<Store size={24} color="#8b5cf6" />}
              title="Venue Details"
              subtitle="Update info"
              onPress={() => router.push('/owner-dashboard/venue-management')}
              color="#8b5cf6"
            />
            <QuickAction
              icon={<TrendingUp size={24} color="#f97316" />}
              title="Analytics"
              subtitle="View insights"
              onPress={() => router.push('/owner-dashboard/analytics')}
              color="#f97316"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Calendar size={16} color="#22c55e" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New reservation from Sarah M.</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Star size={16} color="#fbbf24" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New 5-star review received</Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MessageSquare size={16} color="#e94560" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Customer inquiry about tonight's event</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Current Venue Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue Status</Text>
          <View style={styles.venueStatusCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg' }}
              style={styles.venueImage}
            />
            <View style={styles.venueStatusContent}>
              <View style={styles.venueStatusHeader}>
                <Text style={styles.venueStatusTitle}>Currently Open</Text>
                <View style={styles.statusIndicator}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Live</Text>
                </View>
              </View>
              
              <View style={styles.venueStatusDetails}>
                <View style={styles.statusDetail}>
                  <Clock size={14} color="#8b8b9a" />
                  <Text style={styles.statusDetailText}>Open until 2:00 AM</Text>
                </View>
                <View style={styles.statusDetail}>
                  <Users size={14} color="#e94560" />
                  <Text style={styles.statusDetailText}>High activity</Text>
                </View>
                <View style={styles.statusDetail}>
                  <MapPin size={14} color="#8b8b9a" />
                  <Text style={styles.statusDetailText}>123 Main St, Dallas</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 4,
  },
  venueType: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 2,
  },
  statTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8b8b9a',
    marginBottom: 2,
  },
  statChange: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionContent: {
    alignItems: 'center',
  },
  quickActionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8b8b9a',
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8b8b9a',
  },
  venueStatusCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#2a2a3e',
  },
  venueStatusContent: {
    padding: 16,
  },
  venueStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueStatusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#22c55e',
  },
  venueStatusDetails: {
    gap: 8,
  },
  statusDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
  },
});