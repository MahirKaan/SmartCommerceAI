import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

// ✅ DÜZELTİLMİŞ Image Loader Component - LOCAL ve ONLINE RESİM DESTEKLİ
const ProductImage = ({ source, style, resizeMode = 'cover' }: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

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

// AI Sepet Analizi Fonksiyonu
const analyzeCart = (items: any[]) => {
  if (items.length === 0) {
    return {
      message: '🛒 Sepetiniz boş',
      suggestion: 'Hemen alışverişe başlayın!',
      color: '#64748b'
    };
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalSavings = items.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + ((item.product.originalPrice - item.product.price) * item.quantity);
    }
    return sum;
  }, 0);

  let message = '';
  let suggestion = '';
  let color = '#6366f1';

  if (totalValue > 10000) {
    message = '💰 Premium Alışveriş!';
    suggestion = 'Yüksek bütçeli bir sepetiniz var.';
    color = '#8b5cf6';
  } else if (totalValue > 5000) {
    message = '⭐ Kaliteli Sepet!';
    suggestion = 'Orta bütçeli kaliteli ürünler.';
    color = '#10b981';
  } else {
    message = '🎯 Akıllı Alışveriş!';
    suggestion = 'Bütçe dostu harika seçimler.';
    color = '#6366f1';
  }

  if (totalSavings > 1000) {
    suggestion += ` 🎉 ${totalSavings.toLocaleString('tr-TR')} TL tasarruf!`;
  }

  return {
    message,
    suggestion,
    color,
    totalItems,
    totalValue,
    totalSavings
  };
};

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  const items = cart?.items || [];
  const total = cart?.total || 0;
  const itemCount = cart?.itemCount || 0;

  const cartAnalysis = analyzeCart(items);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Ürünü Sil',
      'Bu ürünü sepetinizden çıkarmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet, Sil', 
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId))
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      'Sepeti Temizle',
      'Tüm ürünleri sepetinizden çıkarmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet, Temizle', 
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      '🤖 SmartCommerce AI Önerisi',
      `Toplam ${itemCount} ürün için ${total.toLocaleString('tr-TR')} TL ödeme yapacaksınız.\n\nAI Asistanı: Bu harika bir alışveriş! 🎉`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Ödemeye Geç', 
          onPress: () => {
            Alert.alert(
              '✅ Ödeme Başarılı!',
              `Siparişiniz alındı! ${total.toLocaleString('tr-TR')} TL tutarındaki alışverişiniz için teşekkür ederiz.`,
              [
                {
                  text: 'Tamam',
                  onPress: () => {
                    dispatch(clearCart());
                    // ✅ NAVIGATION DÜZELTMESİ
                    try {
                      navigation.navigate('MainTabs', { screen: 'Home' });
                    } catch (error) {
                      console.log('Navigation hatası:', error);
                      navigation.goBack();
                    }
                  }
                }
              ]
            );
          }
        },
      ]
    );
  };

  const handleContinueShopping = () => {
    // ✅ NAVIGATION DÜZELTMESİ
    try {
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      console.log('Navigation hatası:', error);
      navigation.navigate('Home');
    }
  };

  const handleAIAssistant = () => {
    Alert.alert(
      '🤖 Sepet Analizi',
      `AI Asistanı raporu:\n\n• ${itemCount} ürün\n• ${total.toLocaleString('tr-TR')} TL toplam\n• ${cartAnalysis.totalSavings.toLocaleString('tr-TR')} TL tasarruf\n\n${cartAnalysis.suggestion}`,
      [{ text: 'Harika!', style: 'default' }]
    );
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      {/* ✅ DÜZELTİLMİŞ RESİM KULLANIMI */}
      <ProductImage 
        source={item.product.image} 
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <View style={styles.productTitleContainer}>
            <Text style={styles.productBrand}>{item.product.tags?.[0] || item.product.category || 'Marka'}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product.name}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.product.id)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.productCategory}>#{item.product.category}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}</Text>
          {item.product.originalPrice && (
            <Text style={styles.originalPrice}>
              ₺{(item.product.originalPrice * item.quantity).toLocaleString('tr-TR')}
            </Text>
          )}
          {item.product.discountRate && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>%{item.product.discountRate}</Text>
            </View>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
            disabled={item.quantity === 1}
          >
            <Text style={[styles.quantityButtonText, item.quantity === 1 && styles.quantityButtonTextDisabled]}>
              −
            </Text>
          </TouchableOpacity>
          
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Text style={styles.quantityUnit}>adet</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>🛒</Text>
          </View>
          
          <Text style={styles.emptyTitle}>Sepetiniz Boş</Text>
          <Text style={styles.emptyText}>
            Henüz sepetinize ürün eklemediniz.{'\n'}
            Hemen alışverişe başlayın!
          </Text>

          {/* AI Öneri Butonu */}
          <TouchableOpacity 
            style={styles.aiSuggestionButton}
            onPress={handleAIAssistant}
          >
            <Text style={styles.aiSuggestionIcon}>🤖</Text>
            <View style={styles.aiSuggestionText}>
              <Text style={styles.aiSuggestionTitle}>AI Asistanı Önerisi</Text>
              <Text style={styles.aiSuggestionSubtitle}>Size özel ürünler için tıklayın</Text>
            </View>
            <Text style={styles.aiSuggestionArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.shopButtonText}>🛍️ Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
      {/* Compact & Rich Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>🛒 Sepetim</Text>
            <Text style={styles.headerSubtitle}>{itemCount} ürün</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        {/* AI Sepet Analizi */}
        <TouchableOpacity 
          style={[styles.aiAnalysisCard, { backgroundColor: cartAnalysis.color }]}
          onPress={handleAIAssistant}
        >
          <View style={styles.aiAnalysisContent}>
            <Text style={styles.aiAnalysisIcon}>🤖</Text>
            <View style={styles.aiAnalysisText}>
              <Text style={styles.aiAnalysisTitle}>{cartAnalysis.message}</Text>
              <Text style={styles.aiAnalysisSubtitle}>{cartAnalysis.suggestion}</Text>
            </View>
            <Text style={styles.aiAnalysisArrow}>›</Text>
          </View>
        </TouchableOpacity>
        
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Toplam</Text>
            <Text style={styles.statValue}>₺{total.toLocaleString('tr-TR')}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tasarruf</Text>
            <Text style={[styles.statValue, styles.savingsValue]}>
              {cartAnalysis.totalSavings > 0 ? `₺${cartAnalysis.totalSavings.toLocaleString('tr-TR')}` : 'Yok'}
            </Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Kargo</Text>
            <Text style={[styles.statValue, styles.shippingValue]}>Ücretsiz</Text>
          </View>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.footerSpacer} />
        }
      />

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ara Toplam:</Text>
            <Text style={styles.summaryValue}>₺{total.toLocaleString('tr-TR')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kargo:</Text>
            <Text style={[styles.summaryValue, styles.freeShipping]}>ÜCRETSİZ</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>GENEL TOPLAM:</Text>
            <Text style={styles.totalValue}>₺{total.toLocaleString('tr-TR')}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueButtonText}>📦 Alışverişe Devam</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <View style={styles.checkoutContent}>
              <Text style={styles.checkoutButtonText}>💳 Ödemeye Geç</Text>
              <View style={styles.checkoutBadge}>
                <Text style={styles.checkoutBadgeText}>₺{total.toLocaleString('tr-TR')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles aynı kalacak
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  clearButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  aiAnalysisCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  aiAnalysisContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAnalysisIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiAnalysisText: {
    flex: 1,
  },
  aiAnalysisTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  aiAnalysisSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  aiAnalysisArrow: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  savingsValue: {
    color: '#10b981',
  },
  shippingValue: {
    color: '#10b981',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
  },
  footerSpacer: {
    height: 160,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  imagePlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 18,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 8,
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
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  productBrand: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 18,
  },
  removeButton: {
    width: 24,
    height: 24,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  productCategory: {
    fontSize: 11,
    color: '#6366f1',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#64748b',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  quantityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  quantityButtonTextDisabled: {
    color: '#94a3b8',
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  quantityUnit: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  footerSummary: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#10b981',
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366f1',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  continueButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checkoutBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  checkoutBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8fafc',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e7ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  aiSuggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  aiSuggestionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aiSuggestionText: {
    flex: 1,
  },
  aiSuggestionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 2,
  },
  aiSuggestionSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  aiSuggestionArrow: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  shopButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CartScreen;