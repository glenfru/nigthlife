import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  X,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  Clock,
  User,
  Mail,
} from 'lucide-react-native';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  venueName: string;
  venuePhone: string;
}

export default function BookingModal({ visible, onClose, venueName, venuePhone }: BookingModalProps) {
  const [bookingMethod, setBookingMethod] = useState<'call' | 'text' | 'form'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partySize: '',
    date: '',
    time: '',
    specialRequests: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCall = () => {
    if (Platform.OS !== 'web') {
      // In a real app, use Linking.openURL(`tel:${venuePhone}`)
      console.log(`Calling ${venuePhone}`);
    }
  };

  const handleText = () => {
    if (Platform.OS !== 'web') {
      // In a real app, use Linking.openURL(`sms:${venuePhone}`)
      console.log(`Texting ${venuePhone}`);
    }
  };

  const handleSubmitReservation = () => {
    // In a real app, submit the reservation
    console.log('Submitting reservation:', formData);
    onClose();
  };

  const InputField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText,
    keyboardType = 'default',
    multiline = false
  }: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    multiline?: boolean;
  }) => (
    <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
      <View style={styles.inputIcon}>
        {icon}
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
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
            <Text style={styles.headerTitle}>Contact {venueName}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Booking Method Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How would you like to connect?</Text>
            <View style={styles.methodSelector}>
              <TouchableOpacity
                style={[styles.methodOption, bookingMethod === 'call' && styles.activeMethod]}
                onPress={() => setBookingMethod('call')}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={bookingMethod === 'call' ? ['#10B981', '#059669'] : ['#F9FAFB', '#F9FAFB']}
                  style={styles.methodGradient}>
                  <Phone size={20} color={bookingMethod === 'call' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[styles.methodText, bookingMethod === 'call' && styles.activeMethodText]}>
                    Call Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodOption, bookingMethod === 'text' && styles.activeMethod]}
                onPress={() => setBookingMethod('text')}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={bookingMethod === 'text' ? ['#3B82F6', '#1D4ED8'] : ['#F9FAFB', '#F9FAFB']}
                  style={styles.methodGradient}>
                  <MessageSquare size={20} color={bookingMethod === 'text' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[styles.methodText, bookingMethod === 'text' && styles.activeMethodText]}>
                    Text
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodOption, bookingMethod === 'form' && styles.activeMethod]}
                onPress={() => setBookingMethod('form')}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={bookingMethod === 'form' ? ['#8B5CF6', '#7C3AED'] : ['#F9FAFB', '#F9FAFB']}
                  style={styles.methodGradient}>
                  <Calendar size={20} color={bookingMethod === 'form' ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[styles.methodText, bookingMethod === 'form' && styles.activeMethodText]}>
                    Reservation
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          {bookingMethod === 'call' && (
            <View style={styles.section}>
              <View style={styles.quickActionCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.quickActionIcon}>
                  <Phone size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.quickActionTitle}>Call {venueName}</Text>
                <Text style={styles.quickActionSubtitle}>
                  Speak directly with the venue to make your reservation
                </Text>
                <Text style={styles.phoneNumber}>{venuePhone}</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.actionButtonGradient}>
                    <Text style={styles.actionButtonText}>Call Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {bookingMethod === 'text' && (
            <View style={styles.section}>
              <View style={styles.quickActionCard}>
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.quickActionIcon}>
                  <MessageSquare size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.quickActionTitle}>Text {venueName}</Text>
                <Text style={styles.quickActionSubtitle}>
                  Send a text message with your reservation details
                </Text>
                <Text style={styles.phoneNumber}>{venuePhone}</Text>
                <TouchableOpacity style={styles.actionButton} onPress={handleText} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#3B82F6', '#1D4ED8']}
                    style={styles.actionButtonGradient}>
                    <Text style={styles.actionButtonText}>Send Text</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Online Form */}
          {bookingMethod === 'form' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reservation Details</Text>
              <View style={styles.form}>
                <InputField
                  icon={<User size={20} color="#6B7280" />}
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />

                <InputField
                  icon={<Mail size={20} color="#6B7280" />}
                  placeholder="Email Address"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                />

                <InputField
                  icon={<Phone size={20} color="#6B7280" />}
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />

                <View style={styles.formRow}>
                  <View style={styles.halfWidth}>
                    <InputField
                      icon={<Users size={20} color="#6B7280" />}
                      placeholder="Party Size"
                      value={formData.partySize}
                      onChangeText={(value) => handleInputChange('partySize', value)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <InputField
                      icon={<Calendar size={20} color="#6B7280" />}
                      placeholder="Date (MM/DD)"
                      value={formData.date}
                      onChangeText={(value) => handleInputChange('date', value)}
                    />
                  </View>
                </View>

                <InputField
                  icon={<Clock size={20} color="#6B7280" />}
                  placeholder="Preferred Time"
                  value={formData.time}
                  onChangeText={(value) => handleInputChange('time', value)}
                />

                <InputField
                  icon={<MessageSquare size={20} color="#6B7280" />}
                  placeholder="Special Requests (Optional)"
                  value={formData.specialRequests}
                  onChangeText={(value) => handleInputChange('specialRequests', value)}
                  multiline={true}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReservation} activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.submitButtonGradient}>
                    <Text style={styles.submitButtonText}>Submit Reservation</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Tips</Text>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipText}>
                💡 Call during business hours for fastest response
              </Text>
              <Text style={styles.tipText}>
                📱 Text for quick questions or last-minute bookings
              </Text>
              <Text style={styles.tipText}>
                📋 Use the form for detailed special event planning
              </Text>
              <Text style={styles.tipText}>
                ⏰ Book in advance for weekend reservations
              </Text>
            </View>
          </View>
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
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  methodOption: {
    flex: 1,
  },
  methodGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeMethod: {},
  methodText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  activeMethodText: {
    color: '#FFFFFF',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 8,
  },
  quickActionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  phoneNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#3B82F6',
    marginBottom: 24,
  },
  actionButton: {
    width: '100%',
  },
  actionButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  form: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});