import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, MapPin, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Music, Users, Star, ChevronRight } from 'lucide-react-native';

interface UserProfile {
  name: string;
  email: string;
  favoriteGenres: string[];
  preferredDistance: number;
  notificationsEnabled: boolean;
  locationEnabled: boolean;
}

const SAMPLE_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  favoriteGenres: ['Hip Hop', 'Electronic', 'Latin'],
  preferredDistance: 5,
  notificationsEnabled: true,
  locationEnabled: true,
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(SAMPLE_PROFILE);

  const toggleNotifications = () => {
    setProfile({ ...profile, notificationsEnabled: !profile.notificationsEnabled });
  };

  const toggleLocation = () => {
    setProfile({ ...profile, locationEnabled: !profile.locationEnabled });
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#3C3C3E', true: '#6464FF' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#3C3C3E"
        />
      ) : (
        <ChevronRight size={20} color="#8E8E93" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileInfo}>
            <LinearGradient
              colors={['#6464FF', '#8383FF']}
              style={styles.avatar}>
              <User size={32} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#6464FF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection title="Preferences">
          <View style={styles.preferenceCard}>
            <Text style={styles.preferenceTitle}>Favorite Music Genres</Text>
            <View style={styles.genreList}>
              {profile.favoriteGenres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Music size={12} color="#6464FF" />
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.addGenreTag}>
                <Text style={styles.addGenreText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.preferenceCard}>
            <Text style={styles.preferenceTitle}>Search Distance</Text>
            <View style={styles.distanceRow}>
              <MapPin size={16} color="#C7C7CC" />
              <Text style={styles.distanceText}>{profile.preferredDistance} miles radius</Text>
            </View>
          </View>
        </ProfileSection>

        <ProfileSection title="App Settings">
          <SettingItem
            icon={<Bell size={20} color="#6464FF" />}
            title="Push Notifications"
            subtitle="Get notified about new venues and events"
            showSwitch={true}
            switchValue={profile.notificationsEnabled}
            onSwitchChange={toggleNotifications}
          />
          
          <SettingItem
            icon={<MapPin size={20} color="#42E5E5" />}
            title="Location Services"
            subtitle="Allow location access for better recommendations"
            showSwitch={true}
            switchValue={profile.locationEnabled}
            onSwitchChange={toggleLocation}
          />
          
          <SettingItem
            icon={<Settings size={20} color="#8383FF" />}
            title="App Preferences"
            subtitle="Customize your app experience"
            onPress={() => {}}
          />
        </ProfileSection>

        <ProfileSection title="Account & Security">
          <SettingItem
            icon={<Shield size={20} color="#42E5E5" />}
            title="Privacy Settings"
            subtitle="Manage your privacy and data"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={<User size={20} color="#6464FF" />}
            title="Account Settings"
            subtitle="Update your account information"
            onPress={() => {}}
          />
        </ProfileSection>

        <ProfileSection title="Support">
          <SettingItem
            icon={<HelpCircle size={20} color="#8383FF" />}
            title="Help & Support"
            subtitle="Get help or contact support"
            onPress={() => {}}
          />
          
          <SettingItem
            icon={<Star size={20} color="#FFCC00" />}
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => {}}
          />
        </ProfileSection>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#6464FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#C7C7CC',
  },
  editButton: {
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  preferenceCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  preferenceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C3C3E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  genreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  addGenreTag: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#6464FF',
    borderStyle: 'dashed',
  },
  addGenreText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6464FF',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#C7C7CC',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 2,
  },
  logoutSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
  },
});