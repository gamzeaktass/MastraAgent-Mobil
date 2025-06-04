import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
  Dimensions,
  Animated,
  NetInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Message type definition
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben proje planlama asistanınızım. Size nasıl yardımcı olabilirim?',
      sender: 'bot',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const MAX_RETRIES = 2;

  // Change to your actual endpoint and add fallback
  const CHATBOT_ENDPOINT = 'https://2543-159-146-121-101.ngrok-free.app/';
  const FALLBACK_RESPONSES = [
    'Bu bir çevrimdışı yanıttır. İnternet bağlantınızı kontrol edip tekrar deneyebilirsiniz.',
    'Şu anda çevrimdışı modda çalışıyorum. İnternet bağlantısı sağlandığında daha iyi yanıtlar verebilirim.',
    'Çevrimdışı moddayız. Basit sorulara yanıt verebilirim, ancak detaylı proje planlaması için internet bağlantısı gerekli.',
  ];

  const loadingAnimation = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isLoading) {
        loadingAnimation();
      }
    });
  };

  useEffect(() => {
    if (isLoading) {
      loadingAnimation();
    }
  }, [isLoading]);

  // Check connectivity to the API
  const checkConnectivity = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(CHATBOT_ENDPOINT, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log("Connectivity check failed:", error);
      return false;
    }
  };

  useEffect(() => {
    // Check connectivity when component mounts
    const checkInitialConnectivity = async () => {
      const isConnected = await checkConnectivity();
      setIsOfflineMode(!isConnected);
    };
    
    checkInitialConnectivity();
  }, []);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };
    
    setInputText('');
    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Scroll after sending message
    setTimeout(() => scrollToBottom(), 100);
    
    // If we're in offline mode or had multiple failures, use fallback
    if (isOfflineMode || retryCount >= MAX_RETRIES) {
      // Simulate API delay
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: FALLBACK_RESPONSES[randomIndex],
          sender: 'bot',
          timestamp: Date.now(),
        };
        
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setIsLoading(false);
      }, 1000);
      
      return;
    }

    try {
      // Add timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      // Use a local variable to track if this request has been handled
      let isHandled = false;

      const response = await fetch(CHATBOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({
          message: inputText,
        }),
        signal: controller.signal,
        credentials: 'omit', // Avoid CORS issues with credentials
      });

      clearTimeout(timeoutId);
      
      // Mark as handled to prevent duplicate responses
      if (isHandled) return;
      isHandled = true;

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Reset retry count on successful response
      setRetryCount(0);
      setIsOfflineMode(false);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Üzgünüm, bir hata oluştu.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark the current attempt
      const currentRetryCount = retryCount + 1;
      setRetryCount(currentRetryCount);
      
      // Check if we should switch to offline mode
      if (currentRetryCount >= MAX_RETRIES) {
        setIsOfflineMode(true);
      }
      
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'İstek zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Ağ bağlantısı başarısız oldu. İnternet bağlantınızı kontrol edin.';
      } else if (error.message.includes('Server error')) {
        errorMessage = `Sunucu hatası: ${error.message}. Lütfen daha sonra tekrar deneyin.`;
      }
      
      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
      setTimeout(() => scrollToBottom(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    
    const statusMessage: Message = {
      id: Date.now().toString(),
      text: !isOfflineMode 
        ? 'Çevrimdışı moda geçildi. Sadece basit yanıtlar alabilirsiniz.'
        : 'Çevrimiçi moda geçildi. Tam işlevli yanıtlar alabilirsiniz.',
      sender: 'bot',
      timestamp: Date.now(),
    };
    
    setMessages((prevMessages) => [...prevMessages, statusMessage]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.botMessageContainer,
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=AI&aspect=1:1&seed=123' }}
              style={styles.avatar}
              defaultSource={require('../assets/adaptive-icon.png')}
            />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessage : styles.botMessage,
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#fff' : '#333' },
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' },
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5E72E4" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=PP&aspect=1:1&seed=456' }}
            style={styles.logo}
            defaultSource={require('../assets/adaptive-icon.png')}
          />
          <Text style={styles.headerTitle}>Proje Planlama</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleOfflineMode}
          >
            <Ionicons
              name={isOfflineMode ? "cloud-offline" : "cloud"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Info')}
          >
            <Ionicons name="information-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {isOfflineMode && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={16} color="#fff" />
          <Text style={styles.offlineText}>
            Çevrimdışı Mod - Sınırlı işlevsellik
          </Text>
        </View>
      )}
      
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        />
      </View>
      
      {isLoading && (
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <ActivityIndicator size="large" color="#5E72E4" />
          <Text style={styles.loadingText}>Yanıt bekleniyor...</Text>
        </Animated.View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor="#aaa"
          multiline
          autoCorrect={true}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={24}
            color={!inputText.trim() ? '#aaa' : 'white'}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    backgroundColor: '#5E72E4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  offlineBanner: {
    backgroundColor: '#f44336',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    paddingTop: 10,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
  },
  userMessage: {
    backgroundColor: '#5E72E4',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 10,
    color: '#5E72E4',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#5E72E4',
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#5E72E4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
});