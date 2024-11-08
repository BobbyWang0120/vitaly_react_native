import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// 预设的AI回复
const AI_RESPONSES = [
  "Based on your health data, I notice that your sleep pattern has been quite irregular lately. I'd recommend establishing a more consistent sleep schedule to improve your overall health.",
  "I've analyzed your recent activity levels, and they're looking good! However, you might want to consider incorporating more strength training exercises into your routine.",
  "Your vital signs are within normal ranges, but I notice a slight elevation in stress levels. Would you like some suggestions for stress management techniques?",
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

// 创建 TypingIndicator 组件
const TypingIndicator: React.FC = () => {
  const [dots] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ),
      ])
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.typingContainer}>
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.typingDot,
            {
              transform: [
                {
                  translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4],
                  }),
                },
              ],
              opacity: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Hello! I'm your AI health assistant. How can I help you today?",
    isUser: false,
  }]);
  const [inputText, setInputText] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const simulateTyping = (response: string) => {
    let currentText = '';
    const words = response.split(' ');
    
    return new Promise<void>((resolve) => {
      words.forEach((word, index) => {
        setTimeout(() => {
          currentText += (index === 0 ? '' : ' ') + word;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              text: currentText,
            };
            return newMessages;
          });
          
          if (index === words.length - 1) {
            resolve();
          }
        }, index * 100); // 每个词之间间隔100ms
      });
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100); // 添加小延迟确保内容已经渲染
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // 用户发送消息后立即滚动
    scrollToBottom();

    // 添加AI正在输入的消息
    setIsAITyping(true);
    const aiLoadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      isTyping: true,
    };
    setMessages(prev => [...prev, aiLoadingMessage]);
    
    // AI开始输入时也滚动
    scrollToBottom();

    // 等待2秒后开始显示回复
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 随机选择一个回复
    const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    
    // 更新消息，准备开始打字效果
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = {
        id: (Date.now() + 1).toString(),
        text: '',
        isUser: false,
      };
      return newMessages;
    });

    // 开始打字效果
    await simulateTyping(randomResponse);
    setIsAITyping(false);
  };

  // 监听消息变化时滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with Vitaly</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((message) => (
          <View 
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessageRow : styles.botMessageRow
            ]}
          >
            {!message.isUser && (
              <View style={styles.avatarContainer}>
                <Icon name="medical-outline" size={20} color="#000000" />
              </View>
            )}
            <View style={message.isUser ? styles.userMessageContainer : styles.botMessageContainer}>
              {message.isTyping ? (
                <View style={styles.botMessage}>
                  <TypingIndicator />
                </View>
              ) : (
                <Text style={message.isUser ? styles.userMessage : styles.botMessage}>
                  {message.text}
                </Text>
              )}
            </View>
            {message.isUser && (
              <View style={styles.avatarContainer}>
                <Icon name="person-circle-outline" size={20} color="#000000" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#666666"
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Icon 
            name="send" 
            size={24} 
            color={inputText.trim() ? "#000000" : "#CCCCCC"} 
          />
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 0,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  botMessageContainer: {
    flex: 1,
    marginRight: 40,
  },
  userMessageContainer: {
    flex: 1,
    marginLeft: 40,
    alignItems: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    fontSize: 16,
    color: '#000000',
    minWidth: 40,
    minHeight: 44,
    justifyContent: 'center',
  },
  userMessage: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: 24,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666666',
    marginHorizontal: 2,
  },
});

// 添加动画样式
const keyframes = `
@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
`;

// 注入动画样式到文档
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.append(style);
}

export default ChatScreen;