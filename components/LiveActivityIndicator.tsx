import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Clock, TrendingUp, Zap } from 'lucide-react-native';

interface LiveActivityIndicatorProps {
  currentCapacity: number;
  maxCapacity: number;
  waitTime?: number;
  trending?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function LiveActivityIndicator({
  currentCapacity,
  maxCapacity,
  waitTime = 0,
  trending = false,
  size = 'medium'
}: LiveActivityIndicatorProps) {
  const percentage = (currentCapacity / maxCapacity) * 100;
  
  const getActivityColor = () => {
    if (percentage >= 90) return '#FF3B30';
    if (percentage >= 70) return '#FF9500';
    if (percentage >= 50) return '#FFCC00';
    return '#34C759';
  };

  const getActivityLabel = () => {
    if (percentage >= 90) return 'PACKED';
    if (percentage >= 70) return 'BUSY';
    if (percentage >= 50) return 'MODERATE';
    return 'CHILL';
  };

  const getGradientColors = () => {
    const color = getActivityColor();
    if (color === '#FF3B30') return ['#FF3B30', '#FF6B6B'];
    if (color === '#FF9500') return ['#FF9500', '#FFB347'];
    if (color === '#FFCC00') return ['#FFCC00', '#FFD700'];
    return ['#34C759', '#5AC777'];
  };

  const sizeStyles = {
    small: {
      container: styles.smallContainer,
      text: styles.smallText,
      icon: 12,
    },
    medium: {
      container: styles.mediumContainer,
      text: styles.mediumText,
      icon: 14,
    },
    large: {
      container: styles.largeContainer,
      text: styles.largeText,
      icon: 16,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        style={[styles.indicator, currentSize.container]}>
        
        <View style={styles.mainInfo}>
          <Users size={currentSize.icon} color="#FFFFFF" />
          <Text style={[styles.label, currentSize.text]}>
            {getActivityLabel()}
          </Text>
          {trending && (
            <TrendingUp size={currentSize.icon} color="#FFFFFF" />
          )}
        </View>
        
        <Text style={[styles.capacity, currentSize.text]}>
          {currentCapacity}/{maxCapacity}
        </Text>
        
        {waitTime > 0 && (
          <View style={styles.waitInfo}>
            <Clock size={currentSize.icon} color="#FFFFFF" />
            <Text style={[styles.waitText, currentSize.text]}>
              ~{waitTime}min
            </Text>
          </View>
        )}
      </LinearGradient>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getActivityColor()
              }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  indicator: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  smallContainer: {
    padding: 8,
    borderRadius: 8,
  },
  mediumContainer: {
    padding: 12,
    borderRadius: 12,
  },
  largeContainer: {
    padding: 16,
    borderRadius: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
  capacity: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  waitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  waitText: {
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#3C3C3E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  percentageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
    minWidth: 30,
    textAlign: 'right',
  },
});