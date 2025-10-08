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
  StatusBar,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { RootState } from '../store';

const { width } = Dimensions.get('window');

// ✅ DÜZELTİLMİŞ Image Loader Component - LOCAL ve ONLINE RESİM DESTEKLİ
const ProductImage = ({ source, style, resizeMode = 'cover' }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ✅ LOCAL MI ONLINE MI KONTROL ET
  const isLocalImage = typeof source === 'number';
  
  // ✅ GÜVENLİ RESİM KAYNAĞI
  const getSafeImageSource = () => {
    if (!source) return null;
    
    // ✅ LOCAL RESİM (require ile) - doğrudan kullan
    if (isLocalImage) {
      return source;
    }
    
    // ✅ ONLINE RESİM (URL) - string'e çevir
    if (typeof source === 'string') {
      return { uri: source };
    }
    
    // ✅ OBJECT İSE (uri property'si varsa)
    if (source && typeof source === 'object' && source.uri) {
      return { uri: String(source.uri) };
    }
    
    return null;
  };

  const imageSource = getSafeImageSource();

  const handleLoadStart = () => {
    // ✅ SADECE ONLINE RESİMLER İÇİN LOADING
    if (!isLocalImage) {
      setIsLoading(true);
      setHasError(false);
    }
  };

  const handleLoadEnd = () => {
    // ✅ SADECE ONLINE RESİMLER İÇİN LOADING
    if (!isLocalImage) {
      setIsLoading(false);
    } else {
      // ✅ LOCAL RESİMLER HEMEN YÜKLENİR
      setIsLoading(false);
    }
  };

  const handleError = () => {
    if (!isLocalImage) {
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <View style={style}>
      {!hasError && imageSource ? (
        <>
          <Image
            source={imageSource}
            style={[style, { position: 'absolute' }]}
            resizeMode={resizeMode}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          {/* ✅ SADECE ONLINE RESİMLER İÇİN LOADING INDICATOR */}
          {!isLocalImage && isLoading && (
            <View style={[style, styles.imagePlaceholder]}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.loadingText}>Resim Yükleniyor...</Text>
            </View>
          )}
        </>
      ) : (
        <View style={[style, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>📷</Text>
          <Text style={styles.placeholderSubtext}>Resim Yüklenemedi</Text>
          {!isLocalImage && (
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setHasError(false);
                setIsLoading(true);
              }}
            >
              <Text style={styles.retryText}>🔄 Tekrar Dene</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// AI Asistanı için ürün analizi fonksiyonu
const analyzeProduct = (product: any) => {
  const rating = product.rating || 4.0;
  let analysis = '';
  let recommendation = '';
  let score = 0;

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
  
  if (product.discountRate) {
    analysis += `🎯 **%${product.discountRate} indirim** - İyi fırsat!\n\n`;
    recommendation = '🔥 **İndirimden yararlanın!**';
    score += 20;
  }

  if (product.features && product.features.length >= 3) {
    analysis += `🚀 **Zengin özellik seti** - ${product.features.slice(0, 3).join(', ')}\n\n`;
    score += 10;
  }

  if (product.tags?.includes('apple') || product.tags?.includes('samsung')) {
    analysis += `🏅 **Premium marka** - Kalite garantisi\n\n`;
    score += 20;
  }

  if (product.isFastDelivery) {
    analysis += `🚚 **Hızlı teslimat** - 1-2 gün içinde teslim\n\n`;
    score += 10;
  }

  analysis += `📊 **AI Değerlendirme Skoru:** ${score}/100`;

  if (score >= 80) {
    recommendation = '✅ **Mükemmel seçim!** Bu ürünü güvenle alabilirsiniz.';
  } else if (score >= 60) {
    recommendation = '👍 **İyi tercih!** Bu ürün size uygun.';
  } else {
    recommendation = '🤔 **Dikkatli olun!** Benzer ürünleri de değerlendirin.';
  }

  return { analysis, recommendation, score };
};

// Sepete Eklendi Modal Component
const AddedToCartModal = ({ visible, onClose, onGoToCart, product, quantity }: any) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎉 Sepete Eklendi!</Text>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Product Info */}
            <View style={styles.modalProductInfo}>
              {/* ✅ MODAL'DA DA PRODUCTIMAGE KULLAN */}
              <ProductImage 
                source={product.image} 
                style={styles.modalProductImage}
                resizeMode="cover"
              />
              <View style={styles.modalProductDetails}>
                <Text style={styles.modalProductName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.modalProductQuantity}>
                  {quantity} adet × ₺{product.price.toLocaleString('tr-TR')}
                </Text>
                <Text style={styles.modalProductTotal}>
                  Toplam: ₺{(product.price * quantity).toLocaleString('tr-TR')}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.continueShoppingButton}
                onPress={onClose}
              >
                <Text style={styles.continueShoppingText}>🛒 Alışverişe Devam Et</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.goToCartButton}
                onPress={onGoToCart}
              >
                <Text style={styles.goToCartText}>📦 Sepete Git</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Hızlı İşlemler:</Text>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Text style={styles.quickActionIcon}>💳</Text>
                  <Text style={styles.quickActionText}>Hemen Al</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickActionButton}>
                  <Text style={styles.quickActionIcon}>❤️</Text>
                  <Text style={styles.quickActionText}>Favorilere Ekle</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickActionButton}>
                  <Text style={styles.quickActionIcon}>📤</Text>
                  <Text style={styles.quickActionText}>Paylaş</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProductDetailScreen = ({ route, navigation }: any) => {
  // DEBUG: Route params kontrolü
  console.log('🔍 ProductDetailScreen - route.params:', route.params);
  
  if (!route.params || !route.params.product) {
    console.log('❌ HATA: Product bilgisi gelmedi!');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 16 }}>
          ❌ Ürün Bulunamadı
        </Text>
        <Text style={{ color: '#64748b', marginBottom: 24, textAlign: 'center' }}>
          Ürün bilgisi yüklenirken bir hata oluştu.{'\n'}Lütfen geri dönüp tekrar deneyin.
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#6366f1', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { product } = route.params;
  console.log('✅ Product bilgisi alındı:', product.name);
  console.log('🖼️ Product image:', product.image);
  console.log('📊 Image type:', typeof product.image);
  
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // DÜZELTME: Gerçek çalışan alternatif resimler
  const getProductImages = (product: any) => {
    const baseImage = product.image;
    
    // ✅ LOCAL RESİMLER İÇİN SADECE ANA RESMİ KULLAN
    // (require() number döndürdüğü için alternatif ekleyemiyoruz)
    if (typeof baseImage === 'number') {
      return [baseImage];
    }
    
    // Apple ürünleri için alternatif resimler
    if (product.tags?.includes('apple')) {
      if (product.name.includes('iPhone')) {
        return [
          baseImage,
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692846357708',
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-whitetitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692846357852',
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692846357734'
        ];
      }
      if (product.name.includes('MacBook')) {
        return [
          baseImage,
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708362281266',
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-starlight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708362281146'
        ];
      }
      if (product.name.includes('AirPods')) {
        return [
          baseImage,
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-pro-2-hero-select-202409_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=90&.v=1721193088796'
        ];
      }
      if (product.name.includes('iPad')) {
        return [
          baseImage,
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-purple-select-202405?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1713202736578',
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-starlight-select-202405?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1713202736578'
        ];
      }
      if (product.name.includes('Watch')) {
        return [
          baseImage,
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-case-45-aluminum-silver-nc-s9_VW_PF+watch-face-45-aluminum-silver-s9_VW_PF_WF_CO?wid=1400&hei=1400&fmt=p-jpg&qlt=90&.v=1693340636667',
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-case-45-aluminum-starlight-nc-s9_VW_PF+watch-face-45-aluminum-starlight-s9_VW_PF_WF_CO?wid=1400&hei=1400&fmt=p-jpg&qlt=90&.v=1693340636667'
        ];
      }
    }
    
    // Samsung ürünleri için alternatif renkler
    if (product.tags?.includes('samsung')) {
      if (product.name.includes('Galaxy S24')) {
        return [
          baseImage,
          'https://images.samsung.com/is/image/samsung/assets/tr/2401/pcd/gallery/S24-Ultra-Green-1.jpg',
          'https://images.samsung.com/is/image/samsung/assets/tr/2401/pcd/gallery/S24-Ultra-Violet-1.jpg',
          'https://images.samsung.com/is/image/samsung/assets/tr/2401/pcd/gallery/S24-Ultra-Gray-1.jpg'
        ];
      }
    }
    
    // Diğer ürünler için sadece ana resmi kullan
    return [baseImage];
  };

  const productImages = getProductImages(product);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // DÜZELTME: Sepete ekle fonksiyonu
  const handleAddToCart = () => {
    console.log('🛒 Sepete ekle butonuna basıldı');
    
    try {
      dispatch(addToCart({
        product: product,
        quantity: quantity
      }));
      
      console.log('✅ Sepete başarıyla eklendi');
      
      // Alert yerine custom modal göster
      setShowCartModal(true);
    } catch (error) {
      console.log('❌ Sepete ekleme hatası:', error);
      Alert.alert('Hata', 'Ürün sepete eklenirken bir hata oluştu.');
    }
  };

  // DÜZELTME: Navigation fonksiyonu - Tüm olasılıkları deniyoruz
  const navigateToCart = () => {
    console.log('🚀 Navigate to cart called');
    
    // Önce modal'ı kapat
    setShowCartModal(false);
    
    // Tüm navigation yöntemlerini dene
    setTimeout(() => {
      try {
        // Yöntem 1: Direct navigate
        console.log('🔄 Trying direct navigation...');
        navigation.navigate('Cart');
      } catch (error1) {
        console.log('❌ Direct navigation failed:', error1);
        
        try {
          // Yöntem 2: getParent ile
          console.log('🔄 Trying getParent navigation...');
          if (navigation.getParent) {
            navigation.getParent()?.navigate('Cart');
          } else {
            navigation.navigate('Cart');
          }
        } catch (error2) {
          console.log('❌ GetParent navigation failed:', error2);
          
          try {
            // Yöntem 3: Tab navigator
            console.log('🔄 Trying tab navigation...');
            navigation.navigate('Tabs', { screen: 'Cart' });
          } catch (error3) {
            console.log('❌ Tab navigation failed:', error3);
            
            try {
              // Yöntem 4: MainTabs
              console.log('🔄 Trying MainTabs navigation...');
              navigation.navigate('MainTabs', { screen: 'Cart' });
            } catch (error4) {
              console.log('❌ MainTabs navigation failed:', error4);
              
              // Yöntem 5: Reset navigation
              console.log('🔄 Trying reset navigation...');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Cart' }],
              });
            }
          }
        }
      }
    }, 300);
  };

  // DÜZELTME: Hemen al fonksiyonu
  const handleBuyNow = () => {
    console.log('⚡ Hemen al butonuna basıldı');
    
    try {
      dispatch(addToCart({
        product: product,
        quantity: quantity
      }));
      
      console.log('✅ Sepete eklendi, sepete yönlendiriliyor...');
      navigateToCart();
      
    } catch (error) {
      console.log('❌ Hemen al hatası:', error);
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  // DÜZELTME: Sepete git fonksiyonu
  const handleGoToCart = () => {
    console.log('📦 Sepete git butonuna basıldı');
    navigateToCart();
  };

  // DÜZELTME: Alışverişe devam et
  const handleContinueShopping = () => {
    console.log('🛒 Alışverişe devam et butonuna basıldı');
    setShowCartModal(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🤖 SmartCommerce AI Önerisi: ${product.name} - Sadece ₺${product.price.toLocaleString()}! ${product.description}\n\n${product.features?.slice(0, 3).join(' • ')}`,
        url: typeof product.image === 'string' ? product.image : '',
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
    Alert.alert(
      isFavorite ? 'Favorilerden Kaldırıldı' : 'Favorilere Eklendi',
      isFavorite 
        ? `${product.name} favorilerinizden kaldırıldı.`
        : `${product.name} favorilerinize eklendi!`
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const productAnalysis = analyzeProduct(product);

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
          {/* ✅ DÜZELTİLMİŞ RESİM KULLANIMI */}
          <ProductImage 
            source={productImages[selectedImage]} 
            style={styles.mainImage}
            resizeMode="contain"
          />
          
          {/* Image Indicators - Sadece birden fazla resim varsa göster */}
          {productImages.length > 1 && (
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
                    {/* ✅ THUMBNAIL'LERDE DE PRODUCTIMAGE KULLAN */}
                    <ProductImage 
                      source={image} 
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgesContainer}>
            <View style={styles.badgesRow}>
              {product.discountRate && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>%{product.discountRate} İndirim</Text>
                </View>
              )}
              <View style={styles.stockBadge}>
                <Text style={styles.stockBadgeText}>
                  {product.inStock !== false ? '✅ Stokta' : '❌ Tükendi'}
                </Text>
              </View>
              {product.tags?.[0] && (
                <View style={styles.brandBadge}>
                  <Text style={styles.brandBadgeText}>{product.tags[0]}</Text>
                </View>
              )}
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
                  {product.discountRate && (
                    <Text style={styles.discountPercent}>%{product.discountRate}</Text>
                  )}
                </View>
              )}
            </View>
            {product.discountRate && product.originalPrice && (
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

          {/* Quantity Selector */}
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

          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <View style={styles.featuresListSection}>
              <Text style={styles.sectionTitle}>Özellikler</Text>
              <View style={styles.featuresList}>
                {product.features.map((feature: string, index: number) => (
                  <View key={index} style={styles.featureListItem}>
                    <Text style={styles.featureListIcon}>✓</Text>
                    <Text style={styles.featureListText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

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
                <Text style={styles.aiTitle}>SmartCommerce AI Analizi</Text>
                <Text style={styles.aiSubtitle}>Akıllı alışveriş asistanı</Text>
              </View>
            </View>
            <Text style={styles.aiScore}>
              AI Değerlendirme Skoru: <Text style={styles.aiScoreValue}>{productAnalysis.score}/100</Text>
            </Text>
            <Text style={styles.aiText}>
              {productAnalysis.recommendation}
            </Text>
            <Text style={styles.aiAnalysis}>
              {productAnalysis.analysis}
            </Text>
          </View>

          {/* Similar Products Suggestion */}
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Benzer Ürünler</Text>
            <Text style={styles.similarText}>
              Bu ürünü beğendiyseniz, aynı kategorideki diğer ürünlere de göz atabilirsiniz.
            </Text>
            <TouchableOpacity style={styles.similarButton}>
              <Text style={styles.similarButtonText}>Benzer Ürünleri Gör</Text>
            </TouchableOpacity>
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
              {product.inStock !== false ? '🛒 Sepete Ekle' : 'Stokta Yok'}
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
              {product.inStock !== false ? '⚡ Hemen Al' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sepete Eklendi Modal */}
      <AddedToCartModal
        visible={showCartModal}
        onClose={handleContinueShopping}
        onGoToCart={handleGoToCart}
        product={product}
        quantity={quantity}
      />
    </SafeAreaView>
  );
};

// Styles aynı kalacak, değişiklik yok
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
    backgroundColor: '#f8fafc',
  },
  imagePlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  retryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
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
  brandBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  brandBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3730a3',
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
  featuresListSection: {
    marginBottom: 24,
  },
  featuresList: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  featureListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureListIcon: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
    marginRight: 12,
    width: 20,
  },
  featureListText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
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
    marginBottom: 12,
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
  aiScore: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '600',
  },
  aiScoreValue: {
    color: '#6366f1',
    fontWeight: '800',
  },
  aiText: {
    fontSize: 15,
    color: '#1e293b',
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  aiAnalysis: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  similarSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  similarText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  similarButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  similarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  modalProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  modalProductImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  modalProductDetails: {
    flex: 1,
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  modalProductQuantity: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  modalProductTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  continueShoppingButton: {
    flex: 2,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  goToCartButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;