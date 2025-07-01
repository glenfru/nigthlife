import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Search, MapPin, ChevronRight, Star } from 'lucide-react-native';

interface City {
  id: string;
  name: string;
  state: string;
  displayName: string;
  isPopular: boolean;
}

interface CitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: City) => void;
  selectedCity: string;
}

const CITIES: City[] = [
  // Texas - Popular Cities
  { id: 'dallas-tx', name: 'Dallas', state: 'TX', displayName: 'Dallas, TX', isPopular: true },
  { id: 'houston-tx', name: 'Houston', state: 'TX', displayName: 'Houston, TX', isPopular: true },
  { id: 'austin-tx', name: 'Austin', state: 'TX', displayName: 'Austin, TX', isPopular: true },
  { id: 'san-antonio-tx', name: 'San Antonio', state: 'TX', displayName: 'San Antonio, TX', isPopular: true },
  { id: 'fort-worth-tx', name: 'Fort Worth', state: 'TX', displayName: 'Fort Worth, TX', isPopular: true },
  
  // Oklahoma - Popular Cities
  { id: 'oklahoma-city-ok', name: 'Oklahoma City', state: 'OK', displayName: 'Oklahoma City, OK', isPopular: true },
  { id: 'tulsa-ok', name: 'Tulsa', state: 'OK', displayName: 'Tulsa, OK', isPopular: true },
  
  // Texas - Other Cities
  { id: 'el-paso-tx', name: 'El Paso', state: 'TX', displayName: 'El Paso, TX', isPopular: false },
  { id: 'arlington-tx', name: 'Arlington', state: 'TX', displayName: 'Arlington, TX', isPopular: false },
  { id: 'corpus-christi-tx', name: 'Corpus Christi', state: 'TX', displayName: 'Corpus Christi, TX', isPopular: false },
  { id: 'plano-tx', name: 'Plano', state: 'TX', displayName: 'Plano, TX', isPopular: false },
  { id: 'lubbock-tx', name: 'Lubbock', state: 'TX', displayName: 'Lubbock, TX', isPopular: false },
  { id: 'laredo-tx', name: 'Laredo', state: 'TX', displayName: 'Laredo, TX', isPopular: false },
  { id: 'garland-tx', name: 'Garland', state: 'TX', displayName: 'Garland, TX', isPopular: false },
  { id: 'irving-tx', name: 'Irving', state: 'TX', displayName: 'Irving, TX', isPopular: false },
  { id: 'amarillo-tx', name: 'Amarillo', state: 'TX', displayName: 'Amarillo, TX', isPopular: false },
  { id: 'grand-prairie-tx', name: 'Grand Prairie', state: 'TX', displayName: 'Grand Prairie, TX', isPopular: false },
  { id: 'brownsville-tx', name: 'Brownsville', state: 'TX', displayName: 'Brownsville, TX', isPopular: false },
  { id: 'mckinney-tx', name: 'McKinney', state: 'TX', displayName: 'McKinney, TX', isPopular: false },
  { id: 'frisco-tx', name: 'Frisco', state: 'TX', displayName: 'Frisco, TX', isPopular: false },
  { id: 'denton-tx', name: 'Denton', state: 'TX', displayName: 'Denton, TX', isPopular: false },
  { id: 'killeen-tx', name: 'Killeen', state: 'TX', displayName: 'Killeen, TX', isPopular: false },
  { id: 'beaumont-tx', name: 'Beaumont', state: 'TX', displayName: 'Beaumont, TX', isPopular: false },
  { id: 'abilene-tx', name: 'Abilene', state: 'TX', displayName: 'Abilene, TX', isPopular: false },
  { id: 'waco-tx', name: 'Waco', state: 'TX', displayName: 'Waco, TX', isPopular: false },
  { id: 'carrollton-tx', name: 'Carrollton', state: 'TX', displayName: 'Carrollton, TX', isPopular: false },
  { id: 'pearland-tx', name: 'Pearland', state: 'TX', displayName: 'Pearland, TX', isPopular: false },
  { id: 'college-station-tx', name: 'College Station', state: 'TX', displayName: 'College Station, TX', isPopular: false },
  
  // Oklahoma - Other Cities
  { id: 'norman-ok', name: 'Norman', state: 'OK', displayName: 'Norman, OK', isPopular: false },
  { id: 'broken-arrow-ok', name: 'Broken Arrow', state: 'OK', displayName: 'Broken Arrow, OK', isPopular: false },
  { id: 'lawton-ok', name: 'Lawton', state: 'OK', displayName: 'Lawton, OK', isPopular: false },
  { id: 'edmond-ok', name: 'Edmond', state: 'OK', displayName: 'Edmond, OK', isPopular: false },
  { id: 'moore-ok', name: 'Moore', state: 'OK', displayName: 'Moore, OK', isPopular: false },
  { id: 'midwest-city-ok', name: 'Midwest City', state: 'OK', displayName: 'Midwest City, OK', isPopular: false },
  { id: 'enid-ok', name: 'Enid', state: 'OK', displayName: 'Enid, OK', isPopular: false },
  { id: 'stillwater-ok', name: 'Stillwater', state: 'OK', displayName: 'Stillwater, OK', isPopular: false },
  { id: 'muskogee-ok', name: 'Muskogee', state: 'OK', displayName: 'Muskogee, OK', isPopular: false },
  { id: 'bartlesville-ok', name: 'Bartlesville', state: 'OK', displayName: 'Bartlesville, OK', isPopular: false },
];

export default function CitySelectionModal({ visible, onClose, onSelectCity, selectedCity }: CitySelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCities = filteredCities.filter(city => city.isPopular);
  const otherCities = filteredCities.filter(city => !city.isPopular);

  const handleSelectCity = (city: City) => {
    onSelectCity(city);
    onClose();
  };

  const CityItem = ({ city }: { city: City }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        selectedCity === city.displayName && styles.selectedCityItem
      ]}
      onPress={() => handleSelectCity(city)}
      activeOpacity={0.8}>
      <View style={styles.cityInfo}>
        <View style={[
          styles.cityIcon,
          { backgroundColor: selectedCity === city.displayName ? '#3B82F6' : '#F3F4F6' }
        ]}>
          <MapPin size={16} color={selectedCity === city.displayName ? '#FFFFFF' : '#6B7280'} />
        </View>
        <View style={styles.cityDetails}>
          <Text style={[
            styles.cityName,
            selectedCity === city.displayName && styles.selectedCityName
          ]}>
            {city.name}
          </Text>
          <Text style={styles.cityState}>{city.state}</Text>
        </View>
        {city.isPopular && (
          <View style={styles.popularBadge}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
          </View>
        )}
      </View>
      {selectedCity === city.displayName && (
        <View style={styles.selectedIndicator}>
          <View style={styles.selectedDot} />
        </View>
      )}
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#111827', '#1F2937']}
          style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Select Your City</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {popularCities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Cities</Text>
              {popularCities.map((city) => (
                <CityItem key={city.id} city={city} />
              ))}
            </View>
          )}

          {otherCities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Cities</Text>
              {otherCities.map((city) => (
                <CityItem key={city.id} city={city} />
              ))}
            </View>
          )}

          {filteredCities.length === 0 && (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No cities found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for a different city name
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCityItem: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cityDetails: {
    flex: 1,
  },
  cityName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  selectedCityName: {
    color: '#3B82F6',
  },
  cityState: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  popularBadge: {
    marginLeft: 8,
    marginRight: 12,
  },
  selectedIndicator: {
    marginRight: 12,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});