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
  Alert,
  ActivityIndicator
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// ✅ MOCK DATAYI IMPORT ET
import { mockProducts, featuredProducts as mockFeaturedProducts } from '../data/mockData';

const { width } = Dimensions.get('window');

// ✅ MOCK DATADAN FEATURED PRODUCTS'İ AL
const featuredProducts = mockFeaturedProducts;

// ✅ KATEGORİLER
const categories = [
  { id: '1', name: 'Elektronik', icon: '📱', count: mockProducts.filter(p => p.category === 'Elektronik').length, color: '#6366f1' },
  { id: '2', name: 'Giyim', icon: '👕', count: mockProducts.filter(p => p.category === 'Giyim').length, color: '#8b5cf6' },
  { id: '3', name: 'Spor', icon: '⚽', count: 12, color: '#ec4899' },
  { id: '4', name: 'Ev & Yaşam', icon: '🏠', count: 15, color: '#f59e0b' }
];

// ✅ IMAGE LOADER COMPONENT
const ProductImage = ({ source, style, resizeMode = 'cover' }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isLocalImage = typeof source === 'number' || (source && source.uri === undefined);
  const imageSource = isLocalImage ? source : { uri: String(source) };

  return (
    <View style={style}>
      {!hasError ? (
        <>
          <Image
            source={imageSource}
            style={[style, { position: 'absolute' }]}
            resizeMode={resizeMode}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          {!isLocalImage && isLoading && (
            <View style={[style, styles.imagePlaceholder]}>
              <ActivityIndicator size="small" color="#6366f1" />
            </View>
          )}
        </>
      ) : (
        <View style={[style, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>📷</Text>
        </View>
      )}
    </View>
  );
};

// ✅ MODERN AI ASİSTANI
class ModernAIAssistant {
  private conversationHistory: Array<{role: string, content: string}> = [];
  
  constructor() {
    this.conversationHistory.push({
      role: 'assistant',
      content: '🌟 **SmartCommerce AI**\n\nPremium alışveriş deneyimi için buradayım! Size nasıl yardımcı olabilirim?'
    });
  }

  getPersonalizedRecommendations(userPreferences: string) {
    let filteredProducts = [...featuredProducts];
    const preferences = userPreferences.toLowerCase();
    
    if (preferences.includes('iphone') || preferences.includes('apple')) {
      return filteredProducts.filter(p => 
        p.name.toLowerCase().includes('iphone') || 
        p.name.toLowerCase().includes('macbook')
      ).slice(0, 3);
    }
    
    if (preferences.includes('indirim')) {
      return filteredProducts.filter(p => p.discountRate)
        .sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0))
        .slice(0, 3);
    }

    if (preferences.includes('spor') || preferences.includes('nike')) {
      return filteredProducts.filter(p => 
        p.name.toLowerCase().includes('nike') || 
        p.category === 'Spor'
      ).slice(0, 3);
    }

    return filteredProducts.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }

  async processMessage(message: string): Promise<{response: string, products?: any[]}> {
    this.conversationHistory.push({ role: 'user', content: message });
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    let products: any[] = [];

    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
      response = '🎉 **Hoş geldiniz!**\n\nSize nasıl yardımcı olabilirim?\n\n• 📱 **Telefon önerisi**\n• 🎯 **İndirimli ürünler**\n• ⭐ **En iyi değerlendirmeler**\n• 🏃 **Spor ürünleri**';
    }
    else if (lowerMessage.includes('telefon') || lowerMessage.includes('iphone')) {
      products = this.getPersonalizedRecommendations('iphone');
      response = '📱 **Premium Telefon Önerilerim**\n\nEn iyi teknoloji ürünleri:';
    }
    else if (lowerMessage.includes('indirim')) {
      products = this.getPersonalizedRecommendations('indirim');
      response = '🎯 **Özel İndirimler**\n\nKaçırmamanız gereken fırsatlar:';
    }
    else if (lowerMessage.includes('spor') || lowerMessage.includes('nike')) {
      products = this.getPersonalizedRecommendations('spor');
      response = '🏃 **Spor & Aktivite**\n\nEn kaliteli spor ürünleri:';
    }
    else {
      products = featuredProducts.sort((a, b) => b.rating - a.rating).slice(0, 3);
      response = '✨ **Size Özel Öneriler**\n\nBeğenebileceğiniz ürünler:';
    }

    this.conversationHistory.push({ role: 'assistant', content: response });

    return { response, products };
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearConversation() {
    this.conversationHistory = [{
      role: 'assistant',
      content: '🌟 **SmartCommerce AI**\n\nPremium alışveriş deneyimi için buradayım! Size nasıl yardımcı olabilirim?'
    }];
  }
}

const aiAssistant = new ModernAIAssistant();

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

  const [selectedCategory, setSelectedCategory] = useState('1');
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (aiModalVisible) {
      setConversation(aiAssistant.getConversationHistory());
    }
  }, [aiModalVisible]);

  // ✅ FAVORİ EKLE/ÇIKAR
  const toggleFavorite = (product: any) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === product.id);
      
      if (isAlreadyFavorite) {
        Alert.alert('Favorilerden Kaldırıldı', `${product.name} favorilerinizden kaldırıldı.`);
        return prev.filter(fav => fav.id !== product.id);
      } else {
        const updatedFavorites = [...prev, product];
        Alert.alert('Favorilere Eklendi', `${product.name} favorilerinize eklendi.`);
        return updatedFavorites;
      }
    });
  };

  const handleFavoritesPress = () => {
    navigation.navigate('Favorites', { favorites });
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
    } catch (error) {
      console.error('AI hatası:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // ✅ KATEGORİ SEÇİMİ
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const selectedCategoryData = categories.find(cat => cat.id === categoryId);
    
    if (selectedCategoryData) {
      navigation.navigate('ProductList', {
        category: selectedCategoryData.name,
        categoryId: categoryId
      });
    }
  };

  // ✅ ÜRÜN DETAY
  const handleProductPress = (product: any) => {
    setAiModalVisible(false);
    navigation.navigate('ProductDetail', { product });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const clearConversation = () => {
    aiAssistant.clearConversation();
    setConversation(aiAssistant.getConversationHistory());
    setAiProducts([]);
  };

  const quickAIPrompts = [
    { text: 'Premium telefonlar', icon: '📱' },
    { text: 'Özel indirimler', icon: '🎯' },
    { text: 'En iyi ürünler', icon: '⭐' },
    { text: 'Spor ürünleri', icon: '🏃' }
  ];

  const renderMessage = (message: {role: string, content: string}, index: number) => {
    const isUser = message.role === 'user';
    
    return (
      <View key={index} style={[
        styles.messageBubble,
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
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
      
      {/* ✅ MODERN HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Hoş Geldiniz</Text>
              <Text style={styles.userName}>
                {user?.displayName || 'Değerli Müşteri'}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleFavoritesPress}
            >
              <Text style={styles.actionIcon}>❤️</Text>
              {favorites.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favorites.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleCartPress}
            >
              <Text style={styles.actionIcon}>🛒</Text>
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ PREMIUM AI HERO CARD */}
        <TouchableOpacity style={styles.aiHeroCard} onPress={handleAIAssistant}>
          <View style={styles.aiHeroContent}>
            <View style={styles.aiHeroText}>
              <Text style={styles.aiHeroTitle}>🤖 AI Alışveriş Asistanı</Text>
              <Text style={styles.aiHeroDescription}>
                Kişiselleştirilmiş öneriler ve akıllı alışveriş rehberi
              </Text>
              <View style={styles.aiCta}>
                <Text style={styles.aiCtaText}>Hemen Keşfet</Text>
                <Text style={styles.aiCtaArrow}>→</Text>
              </View>
            </View>
            <View style={styles.aiHeroVisual}>
              <Text style={styles.aiHeroIcon}>✨</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ✅ FEATURED PRODUCTS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Öne Çıkan Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList', { categoryId: 'all' })}>
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Tümünü Gör</Text>
                <Text style={styles.viewAllArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.productsScroll}
          >
            {featuredProducts.map((product) => {
              const isFavorite = favorites.some(fav => fav.id === product.id);
              
              return (
                <TouchableOpacity 
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.productImageContainer}>
                    <ProductImage 
                      source={product.image}
                      style={styles.productImage}
                    />
                    
                    <TouchableOpacity 
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(product)}
                    >
                      <Text style={[
                        styles.favoriteIcon,
                        isFavorite && styles.favoriteIconActive
                      ]}>
                        {isFavorite ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                    
                    {product.discountRate && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>%{product.discountRate}</Text>
                      </View>
                    )}

                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.productPrice}>₺{product.price.toLocaleString('tr-TR')}</Text>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString('tr-TR')}</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ✅ MODERN CATEGORIES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📂 Kategoriler</Text>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => handleCategorySelect(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryIconText}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} ürün</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* ✅ PREMIUM AI MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aiModalVisible}
        onRequestClose={() => setAiModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleSection}>
                <Text style={styles.modalTitle}>🤖 AI Asistan</Text>
                <Text style={styles.modalSubtitle}>Premium Alışveriş Deneyimi</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalActionButton} onPress={clearConversation}>
                  <Text style={styles.modalActionText}>Temizle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAiModalVisible(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CHAT */}
            <ScrollView 
              ref={scrollViewRef}
              style={styles.chatContainer}
            >
              {conversation.map((message, index) => renderMessage(message, index))}
              
              {isTyping && (
                <View style={[styles.messageBubble, styles.aiMessage]}>
                  <Text style={styles.typingText}>AI düşünüyor...</Text>
                </View>
              )}

              {/* AI PRODUCTS */}
              {aiProducts.length > 0 && (
                <View style={styles.aiProductsSection}>
                  <Text style={styles.aiProductsTitle}>🎯 Önerilen Ürünler</Text>
                  {aiProducts.map((product) => (
                    <TouchableOpacity 
                      key={product.id}
                      style={styles.aiProductCard}
                      onPress={() => handleProductPress(product)}
                    >
                      <ProductImage 
                        source={product.image}
                        style={styles.aiProductImage}
                      />
                      <View style={styles.aiProductInfo}>
                        <Text style={styles.aiProductCategory}>{product.category}</Text>
                        <Text style={styles.aiProductName} numberOfLines={2}>
                          {product.name}
                        </Text>
                        <Text style={styles.aiProductPrice}>₺{product.price.toLocaleString('tr-TR')}</Text>
                        <Text style={styles.aiProductRating}>⭐ {product.rating}</Text>
                      </View>
                      {product.discountRate && (
                        <View style={styles.aiProductDiscount}>
                          <Text style={styles.aiProductDiscountText}>%{product.discountRate}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* QUICK PROMPTS */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.promptsContainer}
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

            {/* INPUT */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="AI asistanına soru sorun..."
                value={aiQuery}
                onChangeText={setAiQuery}
                onSubmitEditing={handleAISearch}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity 
                style={[styles.sendButton, !aiQuery.trim() && styles.sendButtonDisabled]}
                onPress={handleAISearch}
                disabled={!aiQuery.trim()}
              >
                <Text style={styles.sendButtonText}>Gönder</Text>
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
    backgroundColor: '#ffffff',
  },
  // ✅ MODERN HEADER
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    position: 'relative',
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // ✅ PREMIUM AI HERO CARD
  aiHeroCard: {
    backgroundColor: '#6366f1',
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiHeroDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiCta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  aiCtaArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiHeroVisual: {
    marginLeft: 16,
  },
  aiHeroIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
    marginRight: 4,
  },
  viewAllArrow: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  productsScroll: {
    paddingLeft: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f4f6',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 14,
  },
  favoriteIconActive: {
    color: '#ef4444',
  },
  imagePlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  productInfo: {
    padding: 16,
  },
  productCategory: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategory: {
    borderColor: '#6366f1',
    borderWidth: 2,
    backgroundColor: '#eef2ff',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#64748b',
  },
  bottomSpace: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitleSection: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalActionButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalActionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  aiProductsSection: {
    marginTop: 15,
  },
  aiProductsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  aiProductCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aiProductImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  aiProductInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  aiProductCategory: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  aiProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  aiProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 2,
  },
  aiProductRating: {
    fontSize: 12,
    color: '#64748b',
  },
  aiProductDiscount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  aiProductDiscountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  promptsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  promptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  promptIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  promptText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;