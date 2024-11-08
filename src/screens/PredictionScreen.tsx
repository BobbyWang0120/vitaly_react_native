import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type PredictionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PredictionDetail'>;

interface PredictionItemProps {
  title: string;
  description: string;
  icon: string;
  risk: number;
  lastUpdated: Date;
  onPress: () => void;
}

const formatLastUpdated = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const PredictionItem: React.FC<PredictionItemProps> = ({ 
  title, 
  description, 
  icon, 
  risk,
  lastUpdated,
  onPress 
}) => (
  <TouchableOpacity style={styles.predictionCard} onPress={onPress}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color="#000000" />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <View style={styles.riskContainer}>
        <Text style={styles.riskLabel}>Risk Level</Text>
        <Text style={[
          styles.riskValue,
          { color: risk > 70 ? '#FF3B30' : risk > 30 ? '#FF9500' : '#34C759' }
        ]}>{risk}%</Text>
      </View>
      <View style={styles.updateInfo}>
        <Icon name="time-outline" size={14} color="#666666" />
        <Text style={styles.updateText}>{formatLastUpdated(lastUpdated)}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#666666" />
    </View>
  </TouchableOpacity>
);

const PredictionScreen: React.FC = () => {
  const navigation = useNavigation<PredictionScreenNavigationProp>();

  const predictions = [
    {
      title: 'Obesity Risk',
      description: 'Based on BMI trends and lifestyle patterns',
      icon: 'body-outline',
      risk: 35,
      lastUpdated: new Date(2024, 3, 15, 14, 30),
    },
    {
      title: 'Diabetes Risk',
      description: 'Analysis of blood sugar and activity levels',
      icon: 'water-outline',
      risk: 25,
      lastUpdated: new Date(2024, 3, 15, 15, 45),
    },
    {
      title: 'Heart Disease Risk',
      description: 'Cardiovascular health assessment',
      icon: 'heart-outline',
      risk: 15,
      lastUpdated: new Date(2024, 3, 15, 16, 20),
    },
    {
      title: 'Sleep Disorder Risk',
      description: 'Sleep pattern and quality analysis',
      icon: 'moon-outline',
      risk: 45,
      lastUpdated: new Date(2024, 3, 15, 13, 15),
    },
    {
      title: 'Stress Level Prediction',
      description: 'Mental health and lifestyle indicators',
      icon: 'warning-outline',
      risk: 75,
      lastUpdated: new Date(2024, 3, 15, 16, 50),
    },
    {
      title: 'Hypertension Risk',
      description: 'Blood pressure trend analysis',
      icon: 'pulse-outline',
      risk: 30,
      lastUpdated: new Date(2024, 3, 15, 15, 10),
    },
    {
      title: 'Metabolic Syndrome',
      description: 'Combined health factors analysis',
      icon: 'fitness-outline',
      risk: 40,
      lastUpdated: new Date(2024, 3, 15, 14, 55),
    },
    {
      title: 'Depression Risk',
      description: 'Mental wellness pattern analysis',
      icon: 'sad-outline',
      risk: 20,
      lastUpdated: new Date(2024, 3, 15, 16, 30),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Predictions</Text>
      </View>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionDescription}>
          AI-powered analysis of your health metrics to predict potential risks
        </Text>
        {predictions.map((prediction, index) => (
          <PredictionItem
            key={index}
            {...prediction}
            onPress={() => navigation.navigate('PredictionDetail', { title: prediction.title })}
          />
        ))}
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
  },
  predictionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});

export default PredictionScreen; 