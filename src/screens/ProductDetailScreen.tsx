import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Share,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { RootState } from '../store';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const productImages = [
    product.image,
    'https://picsum.photos/300/300?random=10',
    'https://picsum.photos/300/300?random=11',
    'https://picsum.photos/300/300?random=12'
  ];

  // Scroll handler'ı düzeltildi
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    
    Alert.alert(
      'Başarılı! 🛒',
      `${product.name} (${quantity} adet) sepete eklendi!`,
      [
        {
          text: 'Alışverişe Devam Et',
          style: 'cancel'
        },
        {
          text: 'Sepete Git',
          onPress: () => navigation.navigate('Cart')
        }
      ]
    );
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    navigation.navigate('Cart');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${product.name} - Sadece ₺${product.price.toLocaleString()}! ${product.description}`,
        url: product.image,
        title: product.name
      });
    } catch (error) {
      Alert.alert('Paylaşım hatası', 'Ürün paylaşılırken bir hata oluştu.');
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(isFavorite ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi', 
                `${product.name} ${isFavorite ? 'favorilerden çıkarıldı' : 'favorilere eklendi'}`);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll} // Düzeltildi
        scrollEventThrottle={16}
      >
        {/* Compact Image Gallery */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: productImages[selectedImage] }} 
            style={styles.mainImage} 
          />
          
          {/* Enhanced Image Indicators */}
          <View style={styles.imageIndicatorsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageIndicators}
              contentContainerStyle={styles.imageIndicatorsContent}
            >
              {productImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageIndicator,
                    selectedImage === index && styles.imageIndicatorActive
                  ]}
                  onPress={() => setSelectedImage(index)}
                >
                  <Image 
                    source={{ uri: image }} 
                    style={styles.thumbnailImage} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Enhanced Product Info */}
        <View style={styles.content}>
          {/* Premium Badges */}
          <View style={styles.badgesContainer}>
            <View style={styles.badgesRow}>
              {product.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>🔥 %{product.discount}</Text>
                </View>
              )}
              {product.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>🆕 Yeni</Text>
                </View>
              )}
              {product.isBestSeller && (
                <View style={styles.bestSellerBadge}>
                  <Text style={styles.bestSellerBadgeText}>🏆 Çok Satan</Text>
                </View>
              )}
            </View>
            <View style={[
              styles.stockBadge,
              product.inStock ? styles.inStockBadge : styles.outOfStockBadge
            ]}>
              <Text style={styles.stockBadgeText}>
                {product.inStock ? '✅ Stokta' : '❌ Tükendi'}
              </Text>
            </View>
          </View>

          {/* Enhanced Product Title */}
          <View style={styles.titleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>#{product.category}</Text>
          </View>

          {/* Premium Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceMain}>
              <Text style={styles.currentPrice}>₺{product.price.toLocaleString()}</Text>
              {product.originalPrice && (
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString()}</Text>
                  {product.discount && (
                    <Text style={styles.discountPercent}>%{product.discount}</Text>
                  )}
                </View>
              )}
            </View>
            {product.discount && product.originalPrice && (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsIcon}>💸</Text>
                <Text style={styles.savingsText}>
                  ₺{(product.originalPrice - product.price).toLocaleString()} tasarruf
                </Text>
              </View>
            )}
          </View>

          {/* Enhanced Rating & Actions */}
          <View style={styles.ratingActionsSection}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStars}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingValue}>{product.rating}</Text>
                <Text style={styles.reviews}>({product.reviewCount})</Text>
              </View>
              <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
                  {isFavorite ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Smart Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Adet Seçin:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>−</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityValue}>{quantity}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity >= 10 && styles.quantityButtonDisabled]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Text style={[styles.quantityButtonText, quantity >= 10 && styles.quantityButtonTextDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🚚</Text>
              <Text style={styles.quickActionText}>Ücretsiz Kargo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>↩️</Text>
              <Text style={styles.quickActionText}>30 Gün İade</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>🔒</Text>
              <Text style={styles.quickActionText}>Güvenli Alışveriş</Text>
            </TouchableOpacity>
          </View>

          {/* Enhanced Description */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={styles.sectionTitle}>Ürün Detayları</Text>
            </View>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Premium Features */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✨</Text>
              <Text style={styles.sectionTitle}>Öne Çıkan Özellikler</Text>
            </View>
            <View style={styles.featuresGrid}>
              {product.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Smart AI Section */}
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconContainer}>
                <Text style={styles.aiIcon}>🤖</Text>
              </View>
              <View>
                <Text style={styles.aiTitle}>SmartCommerce AI Analizi</Text>
                <Text style={styles.aiSubtitle}>Akıllı alışveriş asistanı öneriyor</Text>
              </View>
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiText}>
                {product.rating >= 4.5 ? '🏆 ' : '⭐ '}
                {product.rating >= 4.5 
                  ? 'Mükemmel puanlı ürün! Kullanıcıların %95\'i memnun.'
                  : 'Kaliteli ürün! Güvenle alabilirsiniz.'
                }
                {product.discount && ' 🎯 Şu an indirim fırsatını kaçırmayın!'}
                {'\n'}📊 Son {product.reviewCount} kişi değerlendirdi.
              </Text>
            </View>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Enhanced Fixed Action Buttons */}
      <View style={styles.actionBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>Toplam:</Text>
          <Text style={styles.totalPrice}>₺{(product.price * quantity).toLocaleString()}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              !product.inStock && styles.disabledButton
            ]} 
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <Text style={styles.addToCartIcon}>🛒</Text>
            <Text style={styles.addToCartText}>
              {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.buyNowButton,
              !product.inStock && styles.disabledButton
            ]} 
            onPress={handleBuyNow}
            disabled={!product.inStock}
          >
            <Text style={styles.buyNowText}>
              {product.inStock ? 'Hemen Al' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#F8FAFC',
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 280, // Küçültüldü
    resizeMode: 'cover',
  },
  imageIndicatorsContainer: {
    marginTop: 12,
  },
  imageIndicators: {
    marginHorizontal: -16,
  },
  imageIndicatorsContent: {
    paddingHorizontal: 16,
  },
  imageIndicator: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  imageIndicatorActive: {
    borderColor: '#6366f1',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  discountBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
  },
  newBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#166534',
  },
  bestSellerBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  bestSellerBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  stockBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  titleSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 28,
  },
  productCategory: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceSection: {
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  priceMain: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366f1',
    marginRight: 12,
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  savingsIcon: {
    marginRight: 6,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  ratingActionsSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 6,
  },
  reviews: {
    fontSize: 13,
    color: '#6B7280',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  favoriteActive: {
    color: '#EF4444',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quantityButtonTextDisabled: {
    color: '#9CA3AF',
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: 'bold',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  aiSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  aiSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  aiContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  aiText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 12,
  },
  addToCartIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#FFFFFF',
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
});

export default ProductDetailScreen;