import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface HealthMetricProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
}

interface MetricSectionProps {
  title: string;
  metrics: Array<{
    icon: string;
    label: string;
    value: string;
    unit: string;
  }>;
}

const HealthMetric: React.FC<HealthMetricProps> = ({ icon, label, value, unit }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <Icon name={icon} size={20} color="#000000" />
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
    <View style={styles.metricValue}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  </View>
);

const MetricSection: React.FC<MetricSectionProps> = ({ title, metrics }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.metricsGrid}>
      {metrics.map((metric, index) => (
        <HealthMetric
          key={index}
          icon={metric.icon}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
        />
      ))}
    </View>
  </View>
);

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const bodyMetrics = [
    { icon: 'scale-outline', label: 'Weight', value: '70.5', unit: 'kg' },
    { icon: 'body-outline', label: 'Body Fat', value: '18.2', unit: '%' },
    { icon: 'fitness-outline', label: 'Muscle Mass', value: '35.8', unit: 'kg' },
    { icon: 'water-outline', label: 'Hydration', value: '65.3', unit: '%' },
    { icon: 'resize-outline', label: 'Height', value: '175', unit: 'cm' },
    { icon: 'cellular-outline', label: 'BMI', value: '23.1', unit: '' },
  ];

  const activityMetrics = [
    { icon: 'flame-outline', label: 'Active Calories', value: '450', unit: 'kcal' },
    { icon: 'flame', label: 'Total Calories', value: '2,450', unit: 'kcal' },
    { icon: 'walk-outline', label: 'Steps', value: '8,234', unit: 'steps' },
    { icon: 'walk', label: 'Distance', value: '5.8', unit: 'km' },
    { icon: 'stopwatch-outline', label: 'Exercise Time', value: '45', unit: 'min' },
    { icon: 'trending-up', label: 'Floors Climbed', value: '12', unit: 'floors' },
  ];

  const vitalMetrics = [
    { icon: 'heart-outline', label: 'Heart Rate', value: '72', unit: 'bpm' },
    { icon: 'pulse-outline', label: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
    { icon: 'thermometer-outline', label: 'Temperature', value: '36.6', unit: '°C' },
    { icon: 'fitness', label: 'VO2 Max', value: '42', unit: 'ml/kg/min' },
    { icon: 'pulse', label: 'HRV', value: '65', unit: 'ms' },
    { icon: 'heart', label: 'Resting HR', value: '62', unit: 'bpm' },
  ];

  const wellnessMetrics = [
    { icon: 'moon-outline', label: 'Sleep', value: '7.5', unit: 'hours' },
    { icon: 'bed-outline', label: 'Deep Sleep', value: '2.3', unit: 'hours' },
    { icon: 'happy-outline', label: 'Mood', value: '8.5', unit: '/ 10' },
    { icon: 'warning-outline', label: 'Stress', value: '32', unit: '/ 100' },
    { icon: 'battery-charging', label: 'Energy', value: '85', unit: '%' },
    { icon: 'medkit-outline', label: 'Recovery', value: '92', unit: '%' },
  ];

  const nutritionMetrics = [
    { icon: 'restaurant-outline', label: 'Protein', value: '120', unit: 'g' },
    { icon: 'pizza-outline', label: 'Carbs', value: '250', unit: 'g' },
    { icon: 'nutrition-outline', label: 'Fat', value: '65', unit: 'g' },
    { icon: 'water', label: 'Water', value: '2.4', unit: 'L' },
    { icon: 'cafe-outline', label: 'Caffeine', value: '180', unit: 'mg' },
    { icon: 'ribbon-outline', label: 'Fiber', value: '28', unit: 'g' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#666666" />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <MetricSection title="Body Composition" metrics={bodyMetrics} />
        <MetricSection title="Activity" metrics={activityMetrics} />
        <MetricSection title="Vital Signs" metrics={vitalMetrics} />
        <MetricSection title="Wellness" metrics={wellnessMetrics} />
        <MetricSection title="Nutrition" metrics={nutritionMetrics} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginRight: 4,
  },
  unitText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default ProfileScreen; 