// src/screens/FavoritesScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Animated,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

// ✅ GÜNCELLENMİŞ IMAGE LOADER COMPONENT
const ProductImage = ({ source, style, resizeMode = 'cover' }: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

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
              <Text style={styles.loadingText}>📷</Text>
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

const FavoritesScreen = ({ navigation, route }: any) => {
  // ✅ ROUTE PARAMETRELERİNDEN FAVORİLERİ AL
  const favoritesFromParams = route.params?.favorites || [];
  const [favorites, setFavorites] = useState<any[]>(favoritesFromParams);
  const [animation] = useState(new Animated.Value(0));

  // ✅ ROUTE PARAMETRELERİ DEĞİŞTİĞİNDE FAVORİLERİ GÜNCELLE
  useEffect(() => {
    if (route.params?.favorites) {
      setFavorites(route.params.favorites);
    }
  }, [route.params?.favorites]);

  // ✅ ANİMASYON BAŞLAT
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // ✅ FAVORİDEN KALDIRMA FONKSİYONU
  const removeFromFavorites = (product: any) => {
    Alert.alert(
      'Favoriden Kaldır',
      `${product.name} favorilerinizden kaldırılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive',
          onPress: () => {
            const updatedFavorites = favorites.filter(fav => fav.id !== product.id);
            setFavorites(updatedFavorites);
            Alert.alert('Başarılı', `${product.name} favorilerinizden kaldırıldı.`);
          }
        }
      ]
    );
  };

  // ✅ SEPETE EKLE FONKSİYONU
  const addToCartFromFavorites = (product: any) => {
    Alert.alert(
      'Sepete Ekle',
      `${product.name} sepete eklensin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Ekle', 
          onPress: () => {
            Alert.alert('Başarılı', `${product.name} sepete eklendi!`);
          }
        }
      ]
    );
  };

  // ✅ FAVORİ ÜRÜN KARTI
  const FavoriteProductCard = ({ product, index }: any) => {
    const cardAnimation = {
      opacity: animation,
      transform: [
        {
          translateY: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[styles.productCard, cardAnimation]}>
        <TouchableOpacity 
          style={styles.productContent}
          onPress={() => navigation.navigate('ProductDetail', { product })}
          activeOpacity={0.9}
        >
          <View style={styles.productImageContainer}>
            <ProductImage 
              source={product.image}
              style={styles.productImage}
              resizeMode="cover"
            />
            
            {/* ✅ FAVORİDEN KALDIR BUTONU */}
            <TouchableOpacity 
              style={styles.removeFavoriteButton}
              onPress={() => removeFromFavorites(product)}
            >
              <Text style={styles.removeFavoriteIcon}>❌</Text>
            </TouchableOpacity>
            
            {/* ✅ BADGELER */}
            <View style={styles.badgeContainer}>
              {product.discountRate && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>%{product.discountRate}</Text>
                </View>
              )}
              
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>⭐ {product.rating}</Text>
              </View>
            </View>

            {!product.inStock && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>❌ Stokta Yok</Text>
              </View>
            )}
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productBrand}>{product.tags?.[0] || product.category}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>₺{product.price.toLocaleString('tr-TR')}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString('tr-TR')}</Text>
              )}
            </View>

            {product.discountRate && product.originalPrice && (
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>
                  💰 ₺{(product.originalPrice - product.price).toLocaleString('tr-TR')} tasarruf
                </Text>
              </View>
            )}

            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>
            
            <View style={styles.productActions}>
              <TouchableOpacity 
                style={[
                  styles.addToCartButton,
                  !product.inStock && styles.disabledButton
                ]}
                onPress={() => addToCartFromFavorites(product)}
                disabled={!product.inStock}
              >
                <Text style={styles.addToCartText}>
                  {product.inStock ? '🛒 Sepete Ekle' : 'Stokta Yok'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Text style={styles.viewDetailsText}>👀 Detaylar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
      {/* ✅ GÜNCELLENMİŞ HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>❤️ Favorilerim</Text>
            <Text style={styles.headerSubtitle}>
              {favorites.length > 0 ? 
                `${favorites.length} ürün beğendiniz` : 
                'Beğendiğiniz ürünler burada görünecek'
              }
            </Text>
          </View>
          
          {/* ✅ FAVORİ SAYISI BADGE */}
          {favorites.length > 0 && (
            <View style={styles.favoriteCountBadge}>
              <Text style={styles.favoriteCountText}>{favorites.length}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ✅ FAVORİ LİSTESİ VEYA BOŞ DURUM */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          favorites.length === 0 && styles.emptyScrollContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length > 0 ? (
          <View style={styles.favoritesContainer}>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Toplam</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {favorites.filter(p => p.discountRate).length}
                </Text>
                <Text style={styles.statLabel}>İndirimli</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {favorites.filter(p => p.inStock).length}
                </Text>
                <Text style={styles.statLabel}>Stokta</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Favori Ürünleriniz</Text>
            
            {/* ✅ FAVORİ ÜRÜN LİSTESİ */}
            {favorites.map((product: any, index: number) => (
              <FavoriteProductCard 
                key={product.id || index} 
                product={product} 
                index={index}
              />
            ))}
            
            {/* ✅ BOTTOM SPACER */}
            <View style={styles.bottomSpacer} />
          </View>
        ) : (
          // ✅ GÜNCELLENMİŞ BOŞ DURUM
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>❤️</Text>
            </View>
            
            <Text style={styles.title}>Favorileriniz Boş</Text>
            <Text style={styles.subtitle}>
              Beğendiğiniz ürünleri favorilere ekleyin{'\n'}
              ve hızlıca ulaşın!
            </Text>

            {/* ✅ AI ÖNERİ BUTONU */}
            <TouchableOpacity 
              style={styles.aiSuggestionButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.aiSuggestionIcon}>🤖</Text>
              <View style={styles.aiSuggestionText}>
                <Text style={styles.aiSuggestionTitle}>AI Asistanı Önerisi</Text>
                <Text style={styles.aiSuggestionSubtitle}>Size özel ürünler için tıklayın</Text>
              </View>
              <Text style={styles.aiSuggestionArrow}>›</Text>
            </TouchableOpacity>

            {/* ✅ ALIŞVERİŞ BUTONU */}
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>🛍️ Alışverişe Başla</Text>
            </TouchableOpacity>

            {/* ✅ HIZLI KATEGORİLER */}
            <View style={styles.quickCategories}>
              <Text style={styles.quickCategoriesTitle}>Hızlı Erişim:</Text>
              <View style={styles.quickCategoriesRow}>
                <TouchableOpacity 
                  style={styles.quickCategory}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Text style={styles.quickCategoryIcon}>📱</Text>
                  <Text style={styles.quickCategoryText}>Elektronik</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickCategory}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Text style={styles.quickCategoryIcon}>👕</Text>
                  <Text style={styles.quickCategoryText}>Giyim</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickCategory}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Text style={styles.quickCategoryIcon}>🔥</Text>
                  <Text style={styles.quickCategoryText}>İndirim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ GÜNCELLENMİŞ STYLES
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  favoriteCountBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  favoriteCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  // ✅ FAVORİ LİSTESİ STİLLERİ
  favoritesContainer: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  productContent: {
    flexDirection: 'row',
  },
  productImageContainer: {
    position: 'relative',
    width: 120,
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  removeFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  removeFavoriteIcon: {
    fontSize: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
  },
  discountBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e293b',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productBrand: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 18,
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
  savingsContainer: {
    marginBottom: 6,
  },
  savingsText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 14,
    marginBottom: 8,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  imagePlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
  },
  bottomSpacer: {
    height: 30,
  },
  // ✅ GÜNCELLENMİŞ BOŞ DURUM STİLLERİ
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 500,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#fecdd3',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  aiSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiSuggestionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  aiSuggestionText: {
    flex: 1,
  },
  aiSuggestionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
  },
  aiSuggestionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  aiSuggestionArrow: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
  },
  shopButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
    marginBottom: 24,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  quickCategories: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  quickCategoriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickCategoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCategory: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  quickCategoryIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  quickCategoryText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FavoritesScreen;