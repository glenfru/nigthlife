import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  MapPin, 
  Users, 
  Store,
  ArrowRight,
} from 'lucide-react-native';

export default function AuthWelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}>
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MapPin size={48} color="#e94560" />
          </View>
          <Text style={styles.appName}>Nightlife Navigator</Text>
          <Text style={styles.tagline}>
            Discover the hottest spots in Texas & Oklahoma
          </Text>
        </View>

        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Find Your Perfect Night Out</Text>
            <Text style={styles.heroSubtitle}>
              Connect with the best bars, clubs, and hookah lounges
            </Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Join as:</Text>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/auth/user-signup')}>
            <View style={styles.optionIcon}>
              <Users size={32} color="#e94560" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Party-Goer</Text>
              <Text style={styles.optionDescription}>
                Discover venues, make reservations, and get exclusive deals
              </Text>
            </View>
            <ArrowRight size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/auth/owner-signup')}>
            <View style={styles.optionIcon}>
              <Store size={32} color="#e94560" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Venue Owner</Text>
              <Text style={styles.optionDescription}>
                Manage your venue, post updates, and connect with customers
              </Text>
            </View>
            <ArrowRight size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8b8b9a',
    textAlign: 'center',
    lineHeight: 24,
  },
  heroSection: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a3e',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
  },
  loginLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#e94560',
  },
});