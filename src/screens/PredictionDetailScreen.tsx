import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, ActivityIndicator, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';

type PredictionDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PredictionDetail'>;

interface PredictionData {
  title: string;
  icon: string;
  description: string;
  risk: number;
  lastUpdated: Date;
}

const predictionDetails: { [key: string]: PredictionData } = {
  'Obesity Risk': {
    title: 'Obesity Risk',
    icon: 'body-outline',
    description: 'Analysis based on your BMI trends, activity patterns, and dietary habits over time.',
    risk: 35,
    lastUpdated: new Date(2024, 3, 15, 14, 30),
  },
  'Diabetes Risk': {
    title: 'Diabetes Risk',
    icon: 'water-outline',
    description: 'Comprehensive analysis of blood sugar levels, dietary patterns, and metabolic indicators.',
    risk: 25,
    lastUpdated: new Date(2024, 3, 15, 15, 45),
  },
  'Heart Disease Risk': {
    title: 'Heart Disease Risk',
    icon: 'heart-outline',
    description: 'Assessment based on cardiovascular health markers, blood pressure trends, and lifestyle factors.',
    risk: 15,
    lastUpdated: new Date(2024, 3, 15, 16, 20),
  },
  'Sleep Disorder Risk': {
    title: 'Sleep Disorder Risk',
    icon: 'moon-outline',
    description: 'Analysis of sleep patterns, quality metrics, and related lifestyle factors.',
    risk: 45,
    lastUpdated: new Date(2024, 3, 15, 13, 15),
  },
  'Stress Level Prediction': {
    title: 'Stress Level Prediction',
    icon: 'warning-outline',
    description: 'Evaluation of stress indicators, heart rate variability, and daily activity patterns.',
    risk: 75,
    lastUpdated: new Date(2024, 3, 15, 16, 50),
  },
  'Hypertension Risk': {
    title: 'Hypertension Risk',
    icon: 'pulse-outline',
    description: 'Analysis of blood pressure trends, heart rate patterns, and lifestyle factors.',
    risk: 30,
    lastUpdated: new Date(2024, 3, 15, 15, 10),
  },
  'Metabolic Syndrome': {
    title: 'Metabolic Syndrome',
    icon: 'fitness-outline',
    description: 'Comprehensive analysis of multiple health markers including blood pressure, blood sugar, and body composition.',
    risk: 40,
    lastUpdated: new Date(2024, 3, 15, 14, 55),
  },
  'Depression Risk': {
    title: 'Depression Risk',
    icon: 'sad-outline',
    description: 'Analysis of mood patterns, sleep quality, activity levels, and social interactions.',
    risk: 20,
    lastUpdated: new Date(2024, 3, 15, 16, 30),
  },
};

const RiskGauge: React.FC<{ risk: number }> = ({ risk }) => {
  const getColor = (value: number) => {
    if (value > 70) return '#FF3B30';
    if (value > 30) return '#FF9500';
    return '#34C759';
  };

  return (
    <View style={styles.gaugeContainer}>
      <View style={styles.gauge}>
        <View style={[styles.gaugeFill, { 
          transform: [{ rotate: `${risk * 1.8}deg` }],
          backgroundColor: getColor(risk)
        }]} />
        <View style={styles.gaugeCenter}>
          <Text style={styles.gaugeText}>{risk}%</Text>
          <Text style={styles.gaugeLabel}>Risk Level</Text>
        </View>
      </View>
      <View style={styles.riskLabels}>
        <Text style={[styles.riskLabel, { color: '#34C759' }]}>Low</Text>
        <Text style={[styles.riskLabel, { color: '#FF9500' }]}>Medium</Text>
        <Text style={[styles.riskLabel, { color: '#FF3B30' }]}>High</Text>
      </View>
    </View>
  );
};

interface HistoryDataPoint {
  date: Date;
  value: number;
}

const generateHistoryData = (currentRisk: number, lastUpdated: Date): HistoryDataPoint[] => {
  const data: HistoryDataPoint[] = [];
  const trend = Math.random() > 0.6 ? 'increasing' : Math.random() > 0.3 ? 'decreasing' : 'stable';
  const volatility = 2; // 每日最大波动范围
  
  // 生成30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(lastUpdated);
    date.setDate(date.getDate() - i);
    
    let baseValue;
    if (trend === 'increasing') {
      baseValue = currentRisk - (i * 1.2); // 逐渐上升
    } else if (trend === 'decreasing') {
      baseValue = currentRisk + (i * 1.2); // 逐渐下降
    } else {
      baseValue = currentRisk; // 保持稳定
    }
    
    // 添加小幅随机波动
    const randomVariation = (Math.random() - 0.5) * volatility;
    const value = Math.max(0, Math.min(100, baseValue + randomVariation));
    
    data.push({ date, value });
  }
  
  return data;
};

const TrendChart: React.FC<{ data: HistoryDataPoint[], color: string }> = ({ data, color }) => {
  const screenWidth = Dimensions.get('window').width - 48; // 考虑padding
  const chartHeight = 200;
  const paddingTop = 20;
  const paddingBottom = 40;
  
  // 找到数值范围
  const minValue = Math.floor(Math.min(...data.map(d => d.value)));
  const maxValue = Math.ceil(Math.max(...data.map(d => d.value)));
  const valueRange = maxValue - minValue;
  
  // 计算坐标
  const points = data.map((point, index) => {
    const x = (index * (screenWidth - 40)) / (data.length - 1) + 20;
    const y = chartHeight - paddingBottom - 
      ((point.value - minValue) * (chartHeight - paddingTop - paddingBottom)) / valueRange;
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>30-Day Trend</Text>
      <Svg width={screenWidth} height={chartHeight}>
        {/* Y轴刻度 */}
        {[0, 1, 2, 3, 4].map((tick) => {
          const y = chartHeight - paddingBottom - (tick * (chartHeight - paddingTop - paddingBottom) / 4);
          const value = Math.round(minValue + (tick * valueRange / 4));
          return (
            <React.Fragment key={tick}>
              <Line
                x1="20"
                y1={y}
                x2={screenWidth - 20}
                y2={y}
                stroke="#EEEEEE"
                strokeWidth="1"
              />
              <SvgText
                x="10"
                y={y + 4}
                fontSize="10"
                fill="#666666"
                textAnchor="end"
              >
                {value}
              </SvgText>
            </React.Fragment>
          );
        })}
        
        {/* 折线 */}
        <Path
          d={`M ${points}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </Svg>
      
      {/* X轴日期标签 */}
      <View style={styles.dateLabels}>
        {[0, 14, 29].map((index) => (
          <Text key={index} style={styles.dateLabel}>
            {data[index].date.toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        ))}
      </View>
    </View>
  );
};

const PredictionDetailScreen: React.FC = () => {
  const navigation = useNavigation<PredictionDetailScreenNavigationProp>();
  const route = useRoute();
  const { title } = route.params as { title: string };
  const predictionData = predictionDetails[title];

  const formatLastUpdated = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getColor = (risk: number) => {
    if (risk > 70) return '#FF3B30';
    if (risk > 30) return '#FF9500';
    return '#34C759';
  };

  const historyData = generateHistoryData(predictionData.risk, predictionData.lastUpdated);

  const [isUpdating, setIsUpdating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const loadingFadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const startUpdateAnimation = () => {
    // 开始旋转动画
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    // 淡出当前内容
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 淡入加载动画
    Animated.timing(loadingFadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const endUpdateAnimation = () => {
    // 停止旋转动画
    spinAnim.stopAnimation();
    spinAnim.setValue(0);

    // 淡出加载动画
    Animated.timing(loadingFadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 淡入内容
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    startUpdateAnimation();

    // 模拟更新过程
    setTimeout(() => {
      setIsUpdating(false);
      endUpdateAnimation();
    }, 5000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{predictionData.title}</Text>
      </View>

      {/* 加载动画层 */}
      <Animated.View 
        style={[
          styles.loadingContainer,
          {
            opacity: loadingFadeAnim,
            transform: [{ scale: loadingFadeAnim }],
          }
        ]}
        pointerEvents={isUpdating ? 'auto' : 'none'}
      >
        <Animated.View style={[styles.loadingIconContainer, { transform: [{ rotate: spin }] }]}>
          <Icon name={predictionData.icon} size={40} color="#000000" />
        </Animated.View>
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingTitle}>Updating Prediction</Text>
          <View style={styles.loadingDotsContainer}>
            <View style={[styles.loadingDot, styles.loadingDot1]} />
            <View style={[styles.loadingDot, styles.loadingDot2]} />
            <View style={[styles.loadingDot, styles.loadingDot3]} />
          </View>
        </View>
      </Animated.View>

      {/* 主要内容 */}
      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pointerEvents={isUpdating ? 'none' : 'auto'}
      >
        <View style={styles.iconHeader}>
          <View style={styles.iconContainer}>
            <Icon name={predictionData.icon} size={32} color="#000000" />
          </View>
          <Text style={styles.description}>{predictionData.description}</Text>
        </View>

        <View style={styles.lastUpdateContainer}>
          <Icon name="time-outline" size={20} color="#666666" />
          <Text style={styles.lastUpdateText}>
            Last updated: {formatLastUpdated(predictionData.lastUpdated)}
          </Text>
        </View>

        <RiskGauge risk={predictionData.risk} />
        
        <TrendChart 
          data={historyData} 
          color={getColor(predictionData.risk)}
        />
      </Animated.ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.updateButton,
            isUpdating && styles.updateButtonDisabled
          ]}
          onPress={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <View style={styles.updatingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.updateButtonText}>Updating...</Text>
            </View>
          ) : (
            <>
              <Icon name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.updateButtonText}>Update Prediction</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gauge: {
    width: 180,
    height: 90,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  gaugeFill: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#34C759',
    bottom: 0,
    left: 0,
    transformOrigin: 'center bottom',
  },
  gaugeCenter: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gaugeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  gaugeLabel: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  riskLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 20,
  },
  riskLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  dateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666666',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  updateButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTextContainer: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  loadingDot1: {
    animationName: 'loading',
    animationDuration: '1s',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
  },
  loadingDot2: {
    animationName: 'loading',
    animationDuration: '1s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  loadingDot3: {
    animationName: 'loading',
    animationDuration: '1s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
  updateButtonDisabled: {
    opacity: 0.8,
  },
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// 添加加载动画的关键帧
const keyframes = `
@keyframes loading {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
`;

export default PredictionDetailScreen; 