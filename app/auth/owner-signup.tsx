import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  Building,
  MapPin,
  ArrowLeft,
  FileText,
} from 'lucide-react-native';

export default function OwnerSignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    businessType: '',
    businessLicense: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = () => {
    // In a real app, handle owner signup here
    router.replace('/owner-dashboard');
  };

  const InputField = ({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false,
    keyboardType = 'default',
    showEyeIcon = false,
    onEyePress,
    multiline = false
  }: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    showEyeIcon?: boolean;
    onEyePress?: () => void;
    multiline?: boolean;
  }) => (
    <View style={[styles.inputContainer, multiline && styles.multilineContainer]}>
      <View style={styles.inputIcon}>
        {icon}
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {showEyeIcon && (
        <TouchableOpacity style={styles.eyeIcon} onPress={onEyePress}>
          {secureTextEntry ? (
            <Eye size={20} color="#6b7280" />
          ) : (
            <EyeOff size={20} color="#6b7280" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.gradient}>
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Venue Owner Signup</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Grow Your Business</Text>
              <Text style={styles.welcomeSubtitle}>
                Connect with party-goers and manage your venue like a pro
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <View style={styles.inputIcon}>
                    <User size={20} color="#6b7280" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#6b7280"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <View style={styles.inputIcon}>
                    <User size={20} color="#6b7280" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#6b7280"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                  />
                </View>
              </View>

              <InputField
                icon={<Mail size={20} color="#6b7280" />}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
              />

              <InputField
                icon={<Phone size={20} color="#6b7280" />}
                placeholder="Phone Number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />

              <Text style={styles.sectionTitle}>Business Information</Text>

              <InputField
                icon={<Building size={20} color="#6b7280" />}
                placeholder="Business Name"
                value={formData.businessName}
                onChangeText={(value) => handleInputChange('businessName', value)}
              />

              <InputField
                icon={<MapPin size={20} color="#6b7280" />}
                placeholder="Business Address"
                value={formData.businessAddress}
                onChangeText={(value) => handleInputChange('businessAddress', value)}
                multiline={true}
              />

              <View style={styles.businessTypeContainer}>
                <Text style={styles.businessTypeLabel}>Business Type</Text>
                <View style={styles.businessTypeOptions}>
                  {['Bar', 'Club', 'Hookah Lounge', 'Restaurant & Bar'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.businessTypeOption,
                        formData.businessType === type && styles.selectedBusinessType
                      ]}
                      onPress={() => handleInputChange('businessType', type)}>
                      <Text style={[
                        styles.businessTypeText,
                        formData.businessType === type && styles.selectedBusinessTypeText
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <InputField
                icon={<FileText size={20} color="#6b7280" />}
                placeholder="Business License Number"
                value={formData.businessLicense}
                onChangeText={(value) => handleInputChange('businessLicense', value)}
              />

              <Text style={styles.sectionTitle}>Account Security</Text>

              <InputField
                icon={<Lock size={20} color="#6b7280" />}
                placeholder="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={showPassword}
                showEyeIcon={true}
                onEyePress={() => setShowPassword(!showPassword)}
              />

              <InputField
                icon={<Lock size={20} color="#6b7280" />}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={showConfirmPassword}
                showEyeIcon={true}
                onEyePress={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <View style={styles.verificationNotice}>
                <Text style={styles.verificationText}>
                  📋 Your account will be reviewed and verified within 24-48 hours. 
                  You'll receive an email confirmation once approved.
                </Text>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.termsLink}>Business Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <LinearGradient
                  colors={['#e94560', '#f27121']}
                  style={styles.signupButtonGradient}>
                  <Text style={styles.signupButtonText}>Submit Application</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8b8b9a',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#ffffff',
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  eyeIcon: {
    padding: 4,
  },
  businessTypeContainer: {
    marginVertical: 8,
  },
  businessTypeLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 12,
  },
  businessTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  businessTypeOption: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  selectedBusinessType: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  businessTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8b8b9a',
  },
  selectedBusinessTypeText: {
    color: '#ffffff',
  },
  verificationNotice: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  verificationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
    lineHeight: 20,
  },
  termsContainer: {
    marginTop: 8,
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b8b9a',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#e94560',
    fontFamily: 'Inter-Medium',
  },
  signupButton: {
    marginTop: 8,
  },
  signupButtonGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  loginPromptText: {
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