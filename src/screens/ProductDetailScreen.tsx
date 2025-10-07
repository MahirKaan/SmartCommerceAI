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
  Alert,
  SafeAreaView,
  StatusBar
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

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // DÜZELTİLDİ: Artık doğru parametre yapısını kullanıyor
  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product,
      quantity: quantity
    }));
    
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

  // DÜZELTİLDİ: Artık doğru parametre yapısını kullanıyor
  const handleBuyNow = () => {
    dispatch(addToCart({
      product: product,
      quantity: quantity
    }));
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
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: productImages[selectedImage] }} 
            style={styles.mainImage} 
          />
          
          {/* Image Indicators */}
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

        {/* Product Info */}
        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={styles.badgesRow}>
              {product.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>%{product.discount} İndirim</Text>
                </View>
              )}
              <View style={styles.stockBadge}>
                <Text style={styles.stockBadgeText}>
                  {product.inStock !== false ? '✅ Stokta' : '❌ Tükendi'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
              <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Product Title */}
          <View style={styles.titleSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>#{product.category}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceMain}>
              <Text style={styles.currentPrice}>₺{product.price.toLocaleString('tr-TR')}</Text>
              {product.originalPrice && (
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString('tr-TR')}</Text>
                  {product.discount && (
                    <Text style={styles.discountPercent}>%{product.discount}</Text>
                  )}
                </View>
              )}
            </View>
            {product.discount && product.originalPrice && (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>
                  ₺{(product.originalPrice - product.price).toLocaleString('tr-TR')} tasarruf
                </Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingValue}>{product.rating || '4.5'}</Text>
              <Text style={styles.reviews}>({product.reviewCount || '124'} değerlendirme)</Text>
            </View>
          </View>

          {/* Quantity Selector - ŞİMDİ ÇALIŞACAK! */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Adet:</Text>
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

          {/* Quick Features */}
          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureText}>Ücretsiz Kargo</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>↩️</Text>
              <Text style={styles.featureText}>30 Gün İade</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureText}>2 Yıl Garanti</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.description}>
              {product.description || 'Bu ürün yüksek kalite standartlarında üretilmiştir. Müşteri memnuniyeti garantilidir.'}
            </Text>
          </View>

          {/* AI Recommendation */}
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiIcon}>🤖</Text>
              <View>
                <Text style={styles.aiTitle}>SmartCommerce AI Önerisi</Text>
                <Text style={styles.aiSubtitle}>Akıllı alışveriş asistanı</Text>
              </View>
            </View>
            <Text style={styles.aiText}>
              {product.rating >= 4.5 ? '🏆 ' : '⭐ '}
              {product.rating >= 4.5 
                ? 'Mükemmel puanlı ürün! Kullanıcıların %95\'i memnun.'
                : 'Kaliteli ürün! Güvenle alabilirsiniz.'
              }
            </Text>
          </View>

          {/* Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>Toplam:</Text>
          <Text style={styles.totalPrice}>₺{(product.price * quantity).toLocaleString('tr-TR')}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              product.inStock === false && styles.disabledButton
            ]} 
            onPress={handleAddToCart}
            disabled={product.inStock === false}
          >
            <Text style={styles.addToCartText}>
              {product.inStock !== false ? 'Sepete Ekle' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.buyNowButton,
              product.inStock === false && styles.disabledButton
            ]} 
            onPress={handleBuyNow}
            disabled={product.inStock === false}
          >
            <Text style={styles.buyNowText}>
              {product.inStock !== false ? 'Hemen Al' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles aynı kalıyor...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 380,
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
    width: 60,
    height: 60,
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
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
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
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  stockBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  favoriteActive: {
    color: '#ef4444',
  },
  titleSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 32,
  },
  productCategory: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceSection: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
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
    fontWeight: '800',
    color: '#6366f1',
    marginRight: 12,
  },
  originalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 16,
    color: '#64748b',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savingsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginRight: 6,
  },
  reviews: {
    fontSize: 14,
    color: '#64748b',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  quantityButtonTextDisabled: {
    color: '#94a3b8',
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
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
  aiIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  aiSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  aiText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6366f1',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
});

export default ProductDetailScreen;