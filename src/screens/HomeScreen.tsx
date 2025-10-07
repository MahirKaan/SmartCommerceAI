import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Animated,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const { width, height } = Dimensions.get('window');

// Gerçek ürün verileri
const featuredProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 55999,
    originalPrice: 59999,
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692846359318',
    rating: 4.9,
    discount: 7,
    category: 'Elektronik',
    features: ['5G', 'Face ID', '120Hz', 'USB-C'],
    description: 'Yeni A17 Pro çipi ile en gelişmiş iPhone'
  },
  {
    id: '2', 
    name: 'MacBook Air M3',
    price: 35999,
    originalPrice: 39999,
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-spacegray-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708362264035',
    rating: 4.8,
    discount: 10,
    category: 'Elektronik',
    features: ['M3 Çip', '18 Saat Pil', 'Retina Ekran'],
    description: 'M3 çipli inanılmaz derecede ince ve hızlı dizüstü bilgisayar'
  },
  {
    id: '3',
    name: 'AirPods Pro (2.Nesil)',
    price: 7999,
    originalPrice: 8999,
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=445&hei=370&fmt=jpeg&qlt=90&.v=1723572553984',
    rating: 4.7,
    discount: 11,
    category: 'Elektronik',
    features: ['Gürültü Önleme', '24 Saat Pil', 'USB-C'],
    description: 'Gelişmiş aktif gürültü engelleme özellikli kulaklık'
  },
  {
    id: '4',
    name: 'iPad Air M2',
    price: 27999,
    originalPrice: 29999,
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-finish-select-202405?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1713202736948',
    rating: 4.6,
    discount: 7,
    category: 'Elektronik',
    features: ['M2 Çip', 'Liquid Retina', 'Apple Pencil'],
    description: 'M2 çipli yeni nesil iPad'
  },
  {
    id: '5',
    name: 'Apple Watch Series 9',
    price: 14999,
    originalPrice: 15999,
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-case-45-aluminum-midnight-nc-s9_VW_PF+watch-face-45-aluminum-midnight-s9_VW_PF_WF_CO?wid=1400&hei=1400&fmt=p-jpg&qlt=90&.v=1693340635127',
    rating: 4.5,
    discount: 6,
    category: 'Elektronik',
    features: ['GPS', 'Kardiyo Takip', 'Su Geçirmez'],
    description: 'Akıllı saatin en gelişmiş modeli'
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra',
    price: 48999,
    originalPrice: 52999,
    image: 'https://images.samsung.com/tr/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra_highlights_kv.jpg',
    rating: 4.8,
    discount: 8,
    category: 'Elektronik',
    features: ['S Pen', '200MP Kamera', 'AI Özellikler'],
    description: 'Galaxy AI ile donatılmış premium telefon'
  }
];

const categories = [
  { id: '1', name: 'Elektronik', icon: '📱', count: 24, color: '#6366f1' },
  { id: '2', name: 'Giyim', icon: '👕', count: 18, color: '#8b5cf6' },
  { id: '3', name: 'Spor', icon: '⚽', count: 12, color: '#ec4899' },
  { id: '4', name: 'Ev & Yaşam', icon: '🏠', count: 15, color: '#f59e0b' }
];

// Gelişmiş AI Asistanı
class AdvancedAIAssistant {
  private conversationHistory: Array<{role: string, content: string}> = [];
  
  constructor() {
    this.conversationHistory.push({
      role: 'assistant',
      content: 'Merhaba! Ben SmartCommerce AI asistanınız. 🎯\n\nSize nasıl yardımcı olabilirim?\n• Ürün önerisi isteyin\n• Fiyat karşılaştırması yapın\n• Alışveriş tavsiyesi alın\n• Bütçe planlaması yapalım'
    });
  }

  // Akıllı ürün önerisi
  getPersonalizedRecommendations(userPreferences: string, budget?: number) {
    let filteredProducts = [...featuredProducts];
    const preferences = userPreferences.toLowerCase();
    
    // Bütçe filtresi
    if (budget) {
      filteredProducts = filteredProducts.filter(p => p.price <= budget);
    }
    
    // Tercih filtreleri
    if (preferences.includes('iphone') || preferences.includes('apple')) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes('iphone') || 
        p.name.toLowerCase().includes('macbook') ||
        p.name.toLowerCase().includes('airpods') ||
        p.name.toLowerCase().includes('ipad') ||
        p.name.toLowerCase().includes('watch')
      );
    }
    
    if (preferences.includes('samsung') || preferences.includes('galaxy')) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes('samsung') || 
        p.name.toLowerCase().includes('galaxy')
      );
    }
    
    if (preferences.includes('ucuz') || preferences.includes('ekonomik') || preferences.includes('bütçe')) {
      filteredProducts = filteredProducts.filter(p => p.discount || p.price < 20000);
    }
    
    if (preferences.includes('yüksek') || preferences.includes('premium') || preferences.includes('kaliteli')) {
      filteredProducts = filteredProducts.filter(p => p.rating >= 4.7 && p.price > 30000);
    }
    
    if (preferences.includes('indirim') || preferences.includes('fırsat')) {
      filteredProducts = filteredProducts.filter(p => p.discount).sort((a, b) => b.discount - a.discount);
    }

    // En iyi eşleşmeye göre sırala
    return filteredProducts.slice(0, 4);
  }

  // Fiyat karşılaştırması
  comparePrices(product: any) {
    const similarProducts = featuredProducts.filter(p => 
      p.category === product.category && p.id !== product.id
    );
    
    if (similarProducts.length === 0) return null;
    
    const avgPrice = similarProducts.reduce((sum, p) => sum + p.price, 0) / similarProducts.length;
    const savings = avgPrice - product.price;
    const priceDifference = Math.abs(savings);
    
    return {
      averagePrice: Math.round(avgPrice),
      savings: Math.round(savings),
      isCheaper: savings > 0,
      similarCount: similarProducts.length,
      priceDifference: Math.round(priceDifference)
    };
  }

  // Ürün değerlendirmesi
  analyzeProduct(product: any) {
    const priceAnalysis = this.comparePrices(product);
    const rating = product.rating;
    
    let analysis = '';
    let recommendation = '';
    let score = 0;

    // Puanlama sistemi
    if (rating >= 4.5) {
      analysis += '🏆 **Yüksek puanlı ürün** - Kullanıcılar çok memnun\n\n';
      score += 30;
    } else if (rating >= 4.0) {
      analysis += '⭐ **Kaliteli ürün** - İyi değerlendirmeler\n\n';
      score += 20;
    } else {
      analysis += '⚠️ **Orta puanlı** - Diğer seçeneklere bakın\n\n';
      score += 10;
    }
    
    if (priceAnalysis?.isCheaper) {
      analysis += `💰 **Fiyat avantajı** - Ortalamadan ₺${priceAnalysis.savings.toLocaleString('tr-TR')} daha ucuz\n\n`;
      recommendation = '✅ **İyi fırsat!** Bu ürünü almanızı öneririm.';
      score += 40;
    } else if (priceAnalysis && !priceAnalysis.isCheaper) {
      analysis += `💸 **Fiyat ortalamanın üzerinde** - ₺${priceAnalysis.priceDifference.toLocaleString('tr-TR')} daha pahalı\n\n`;
      recommendation = '🤔 **Benzer ürünlere** de bakabilirsiniz.';
      score += 15;
    }
    
    if (product.discount) {
      analysis += `🎯 **%${product.discount} indirim** - İyi fırsat!\n\n`;
      recommendation = '🔥 **İndirimden yararlanın!**';
      score += 20;
    }

    // Özellik değerlendirmesi
    if (product.features.length >= 3) {
      analysis += `🚀 **Zengin özellik seti** - ${product.features.slice(0, 3).join(', ')}\n\n`;
      score += 10;
    }

    // Toplam skor
    analysis += `📊 **AI Değerlendirme Skoru:** ${score}/100`;

    return { analysis, recommendation, score };
  }

  // Bütçe planlaması
  createBudgetPlan(budget: number, preferences: string) {
    const affordableProducts = this.getPersonalizedRecommendations(preferences, budget);
    
    if (affordableProducts.length === 0) {
      return {
        message: `💰 **Bütçe Analizi:** ₺${budget.toLocaleString('tr-TR')} bütçeniz için uygun ürün bulamadım.`,
        suggestions: ['Bütçenizi artırmayı düşünebilirsiniz', 'İkinci el ürünlere bakabilirsiniz', 'Daha küçük modelleri değerlendirebilirsiniz']
      };
    }

    const totalCost = affordableProducts.reduce((sum, product) => sum + product.price, 0);
    const remainingBudget = budget - totalCost;
    
    let message = `💰 **Bütçe Planı:** ₺${budget.toLocaleString('tr-TR')}\n\n`;
    message += `**Önerilen Ürünler:**\n`;
    
    affordableProducts.forEach((product, index) => {
      message += `${index + 1}. ${product.name} - ₺${product.price.toLocaleString('tr-TR')}\n`;
    });
    
    message += `\n**Toplam:** ₺${totalCost.toLocaleString('tr-TR')}\n`;
    message += `**Kalan Bütçe:** ₺${remainingBudget.toLocaleString('tr-TR')}\n\n`;
    
    if (remainingBudget > 0) {
      message += `✅ **Bütçeniz yeterli!** Kalan ₺${remainingBudget.toLocaleString('tr-TR')} ile aksesuar alabilirsiniz.`;
    } else {
      message += `⚠️ **Bütçeyi aşıyorsunuz.** Bazı ürünleri çıkarabilirsiniz.`;
    }

    return {
      message,
      products: affordableProducts,
      totalCost,
      remainingBudget
    };
  }

  // Gelişmiş sohbet işleme
  async processMessage(message: string): Promise<{response: string, products?: any[], action?: string}> {
    // Kullanıcı mesajını history'e ekle
    this.conversationHistory.push({ role: 'user', content: message });
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    let products: any[] = [];
    let action = '';

    // Bütçe tespiti - HATA DÜZELTİLDİ: null kontrolü eklendi
    const budgetMatch = message.match(/(\d+)\s*(tl|try|₺|lira)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : undefined;

    // Komut analizi
    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
      response = 'Merhaba! 👋 SmartCommerce AI asistanına hoş geldiniz!\n\nSize nasıl yardımcı olabilirim?\n• "Bana telefon öner" - Kişiselleştirilmiş öneriler\n• "5000 TL bütçem var" - Bütçe planlaması\n• "En iyi indirimler" - Fırsat ürünleri\n• "iPhone 15 analiz" - Ürün değerlendirmesi';
    }
    else if (lowerMessage.includes('bütçe') || budget) {
      // HATA DÜZELTİLDİ: budget undefined kontrolü
      const budgetPlan = this.createBudgetPlan(budget || 10000, message);
      response = budgetPlan.message;
      if (budgetPlan.products) {
        products = budgetPlan.products;
      }
      action = 'budget_plan';
    }
    else if (lowerMessage.includes('öner') || lowerMessage.includes('tavsiye') || lowerMessage.includes('ne al')) {
      // HATA DÜZELTİLDİ: budget undefined kontrolü
      products = this.getPersonalizedRecommendations(message, budget);
      response = `🎁 **Size Özel Önerilerim:**\n\n`;
      
      products.forEach((product, index) => {
        const analysis = this.analyzeProduct(product);
        response += `**${index + 1}. ${product.name}**\n`;
        response += `💰 **Fiyat:** ₺${product.price.toLocaleString('tr-TR')}`;
        if (product.originalPrice) {
          response += ` (⭑%${product.discount} indirim)\n`;
        } else {
          response += `\n`;
        }
        response += `⭐ **Puan:** ${product.rating}/5\n`;
        response += `📝 **Öneri:** ${analysis.recommendation}\n\n`;
      });
      
      response += `ℹ️ Ürünlere tıklayarak detaylı bilgi alabilirsiniz.`;
      action = 'recommendations';
    }
    else if (lowerMessage.includes('fiyat') || lowerMessage.includes('ucuz') || lowerMessage.includes('pahalı')) {
      const searchResults = this.smartSearch(message);
      products = searchResults.products;
      
      if (products.length > 0) {
        response = `💰 **Fiyat Analizlerim:**\n\n`;
        products.forEach(product => {
          const analysis = this.analyzeProduct(product);
          response += `📱 **${product.name}**\n`;
          response += `${analysis.analysis}\n\n`;
        });
      } else {
        response = `"${message}" için ürün bulamadım. 🧐\nBaşka bir arama yapmayı deneyin.`;
      }
      action = 'price_analysis';
    }
    else if (lowerMessage.includes('analiz') || lowerMessage.includes('değerlendir')) {
      const productName = this.extractProductName(message);
      const product = featuredProducts.find(p => 
        p.name.toLowerCase().includes(productName.toLowerCase())
      );
      
      if (product) {
        const analysis = this.analyzeProduct(product);
        response = `🔍 **${product.name} Analizi:**\n\n`;
        response += analysis.analysis;
        response += `\n\n${analysis.recommendation}`;
        products = [product];
      } else {
        response = `"${productName}" ürününü bulamadım. Lütfen ürün adını kontrol edin.`;
      }
      action = 'product_analysis';
    }
    else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağ ol')) {
      response = 'Rica ederim! 😊 Başka bir konuda yardıma ihtiyacınız varsa sormaktan çekinmeyin.';
    }
    else {
      const searchResults = this.smartSearch(message);
      products = searchResults.products;
      
      if (products.length > 0) {
        response = `🔍 **"${message}" için bulduklarım:**\n\n`;
        products.forEach(product => {
          response += `• **${product.name}** - ₺${product.price.toLocaleString('tr-TR')} (${product.rating}⭐)\n`;
        });
        response += `\nℹ️ Daha detaylı bilgi için ürünlere tıklayabilir veya "fiyat analizi" isteyebilirsiniz.`;
      } else {
        response = `"${message}" için ürün bulamadım. 🧐\nDaha spesifik arama yapabilir veya "öneri", "bütçe", "analiz" gibi anahtar kelimeler kullanabilir misiniz?`;
      }
      action = 'search_results';
    }

    // Asistan yanıtını history'e ekle
    this.conversationHistory.push({ role: 'assistant', content: response });

    return { response, products, action };
  }

  // Akıllı arama
  smartSearch(query: string) {
    const results = {
      products: featuredProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.features.some((f: string) => f.toLowerCase().includes(query.toLowerCase())) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ),
      categories: categories.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    };
    
    return results;
  }

  // Ürün adı çıkarımı
  private extractProductName(message: string): string {
    const productKeywords = ['iphone', 'macbook', 'airpods', 'ipad', 'watch', 'samsung', 'galaxy'];
    
    for (const keyword of productKeywords) {
      if (message.toLowerCase().includes(keyword)) {
        const product = featuredProducts.find(p => 
          p.name.toLowerCase().includes(keyword)
        );
        if (product) return product.name;
      }
    }
    
    // Eşleşme yoksa ilk 3 kelimeyi döndür
    return message.split(' ').slice(0, 3).join(' ');
  }

  // Sohbet geçmişini getir
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Sohbeti temizle
  clearConversation() {
    this.conversationHistory = [{
      role: 'assistant',
      content: 'Merhaba! Ben SmartCommerce AI asistanınız. 🎯\n\nSize nasıl yardımcı olabilirim?\n• Ürün önerisi isteyin\n• Fiyat karşılaştırması yapın\n• Alışveriş tavsiyesi alın\n• Bütçe planlaması yapalım'
    }];
  }
}

// AI Asistanı instance'ı
const aiAssistant = new AdvancedAIAssistant();

const HomeScreen = ({ navigation }: any) => {
  const cart = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const itemCount = cart?.itemCount || 0;
  
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([]);
  const [aiProducts, setAiProducts] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Modal açıldığında sohbet geçmişini yükle
    if (aiModalVisible) {
      setConversation(aiAssistant.getConversationHistory());
    }
  }, [aiModalVisible]);

  useEffect(() => {
    // Yeni mesaj eklendiğinde en alta kaydır
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation]);

  // HATA DÜZELTİLDİ: displayName null/undefined kontrolü
  const formatUserName = (name: string | null | undefined) => {
    if (!name) return 'Kullanıcı';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleAIAssistant = () => {
    setAiModalVisible(true);
    setAiQuery('');
    setAiProducts([]);
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    
    setIsTyping(true);
    const userMessage = aiQuery;
    setAiQuery('');
    
    try {
      const result = await aiAssistant.processMessage(userMessage);
      
      setConversation(aiAssistant.getConversationHistory());
      setAiProducts(result.products || []);
      
      // Animasyon
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('AI işleme hatası:', error);
      const errorMessage = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';
      aiAssistant.getConversationHistory().push({
        role: 'assistant',
        content: errorMessage
      });
      setConversation(aiAssistant.getConversationHistory());
    } finally {
      setIsTyping(false);
    }
  };

  const handleProductPress = (product: any) => {
    setAiModalVisible(false);
    navigation.navigate('ProductDetail', { product });
  };

  const clearConversation = () => {
    aiAssistant.clearConversation();
    setConversation(aiAssistant.getConversationHistory());
    setAiProducts([]);
  };

  const quickAIPrompts = [
    { text: 'Bana telefon öner', icon: '📱' },
    { text: '5000 TL bütçem var', icon: '💰' },
    { text: 'En iyi indirimler', icon: '🔥' },
    { text: 'iPhone 15 analizi', icon: '🔍' },
    { text: 'Bütçe planlaması', icon: '📊' }
  ];

  const renderMessage = (message: {role: string, content: string}, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={index} style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageSender}>
            {isUser ? '👤 Siz' : '🤖 AI Asistanı'}
          </Text>
        </View>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message.content}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {/* HATA DÜZELTİLDİ: displayName null/undefined kontrolü */}
                {user?.displayName?.charAt(0)?.toUpperCase() || '👤'}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Merhaba 👋</Text>
              <Text style={styles.userName}>
                {formatUserName(user?.displayName)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={handleAIAssistant}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>AI asistanına sor...</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Assistant Hero Card */}
        <TouchableOpacity style={styles.aiHeroCard} onPress={handleAIAssistant}>
          <View style={styles.aiHeroContent}>
            <View style={styles.aiHeroText}>
              <Text style={styles.aiHeroTitle}>🤖 SmartCommerce AI</Text>
              <Text style={styles.aiHeroDescription}>
                Akıllı alışveriş asistanı ile{'\n'}kişiselleştirilmiş deneyim
              </Text>
              <View style={styles.aiFeatures}>
                <Text style={styles.aiFeature}>🎯 Kişiselleştirilmiş Öneriler</Text>
                <Text style={styles.aiFeature}>💰 Akıllı Fiyat Analizi</Text>
                <Text style={styles.aiFeature}>⚡ Anında Yardım</Text>
              </View>
            </View>
            <View style={styles.aiHeroVisual}>
              <Text style={styles.aiHeroIcon}>✨</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📦</Text>
            <View>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Toplam Ürün</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🤖</Text>
            <View>
              <Text style={styles.statNumber}>AI</Text>
              <Text style={styles.statLabel}>Destekli</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <View>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Ortalama</Text>
            </View>
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 AI Önerileri</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.sectionLink}>Tümü</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.productsScroll}
            contentContainerStyle={styles.productsContent}
          >
            {featuredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.productImageContainer}>
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {product.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountBadgeText}>%{product.discount}</Text>
                    </View>
                  )}
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>₺{product.price.toLocaleString('tr-TR')}</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString('tr-TR')}</Text>
                    )}
                  </View>
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* AI Assistant Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aiModalVisible}
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>🤖 AI Alışveriş Asistanı</Text>
                <Text style={styles.modalSubtitle}>Size özel öneriler ve analizler</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={clearConversation}
                >
                  <Text style={styles.clearButtonText}>Temizle</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setAiModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Messages */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatContainer}
              showsVerticalScrollIndicator={false}
            >
              {conversation.map((message, index) => renderMessage(message, index))}
              
              {isTyping && (
                <View style={[styles.messageBubble, styles.aiMessage]}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>🤖 AI Asistanı</Text>
                  </View>
                  <Text style={styles.typingText}>AI yazıyor...</Text>
                </View>
              )}

              {/* AI Önerilen Ürünler */}
              {aiProducts.length > 0 && (
                <Animated.View style={[styles.productsSection, { opacity: fadeAnim }]}>
                  <Text style={styles.productsTitle}>🎯 Önerilen Ürünler</Text>
                  {aiProducts.map((product) => (
                    <TouchableOpacity 
                      key={product.id}
                      style={styles.recommendedProduct}
                      onPress={() => handleProductPress(product)}
                    >
                      <Image 
                        source={{ uri: product.image }} 
                        style={styles.recommendedProductImage}
                        resizeMode="cover"
                      />
                      <View style={styles.recommendedProductInfo}>
                        <Text style={styles.recommendedProductName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <Text style={styles.recommendedProductPrice}>
                          ₺{product.price.toLocaleString('tr-TR')}
                        </Text>
                        {product.originalPrice && (
                          <Text style={styles.recommendedProductOriginalPrice}>
                            ₺{product.originalPrice.toLocaleString('tr-TR')}
                          </Text>
                        )}
                        <Text style={styles.recommendedProductRating}>
                          ⭐ {product.rating} • {product.category}
                        </Text>
                      </View>
                      {product.discount && (
                        <View style={styles.recommendedProductDiscount}>
                          <Text style={styles.recommendedProductDiscountText}>
                            %{product.discount}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </ScrollView>

            {/* Quick Prompts */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.promptsContainer}
              contentContainerStyle={styles.promptsContent}
            >
              {quickAIPrompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptButton}
                  onPress={() => {
                    setAiQuery(prompt.text);
                    handleAISearch();
                  }}
                >
                  <Text style={styles.promptIcon}>{prompt.icon}</Text>
                  <Text style={styles.promptText}>{prompt.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="AI asistanına soru sorun..."
                value={aiQuery}
                onChangeText={setAiQuery}
                onSubmitEditing={handleAISearch}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  (!aiQuery.trim() || isTyping) && styles.sendButtonDisabled
                ]}
                onPress={handleAISearch}
                disabled={!aiQuery.trim() || isTyping}
              >
                <Text style={styles.sendButtonText}>
                  {isTyping ? '...' : 'Gönder'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cartButton: {
    position: 'relative',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  cartIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchText: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  aiBadge: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  aiHeroCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  aiHeroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiHeroText: {
    flex: 1,
  },
  aiHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiHeroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  aiFeatures: {
    marginTop: 8,
  },
  aiFeature: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
  aiHeroVisual: {
    marginLeft: 16,
  },
  aiHeroIcon: {
    fontSize: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '700',
  },
  productsScroll: {
    marginHorizontal: -20,
  },
  productsContent: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f8fafc',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e293b',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#6366f1',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 14,
  },
  bottomSpacer: {
    height: 30,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginRight: 12,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8fafc',
    borderBottomLeftRadius: 4,
  },
  messageHeader: {
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#1e293b',
  },
  typingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  productsSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  recommendedProduct: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    position: 'relative',
  },
  recommendedProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  recommendedProductInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recommendedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  recommendedProductPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 2,
  },
  recommendedProductOriginalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  recommendedProductRating: {
    fontSize: 12,
    color: '#64748b',
  },
  recommendedProductDiscount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  recommendedProductDiscountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  promptsContainer: {
    marginBottom: 12,
  },
  promptsContent: {
    paddingHorizontal: 20,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  promptIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  promptText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default HomeScreen;