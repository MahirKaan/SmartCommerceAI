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
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  const items = cart?.items || [];
  const total = cart?.total || 0;
  const itemCount = cart?.itemCount || 0;

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
      'Ödemeye Geç',
      'Güvenli ödeme sayfasına yönlendiriliyorsunuz.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Devam Et', 
          onPress: () => {
            Alert.alert('Başarılı', 'Ödeme işleminiz tamamlandı!');
            dispatch(clearCart());
          }
        },
      ]
    );
  };

  const handleContinueShopping = () => {
    navigation.navigate('MainTabs', { screen: 'Products' });
  };

  const calculateSavings = () => {
    return items.reduce((savings, item) => {
      if (item.product.originalPrice) {
        return savings + ((item.product.originalPrice - item.product.price) * item.quantity);
      }
      return savings;
    }, 0);
  };

  const savings = calculateSavings();

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.product.image }} 
        style={styles.productImage}
      />
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
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
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
            onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
            disabled={item.quantity === 1}
          >
            <Text style={[styles.quantityButtonText, item.quantity === 1 && styles.quantityButtonTextDisabled]}>
              ➖
            </Text>
          </TouchableOpacity>
          
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantity}>{item.quantity}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>➕</Text>
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
              {savings > 0 ? `₺${savings.toLocaleString('tr-TR')}` : 'Yok'}
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
    height: 90,
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
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 18,
    flex: 1,
    marginRight: 8,
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
    marginBottom: 4,
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
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 2,
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
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
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
    paddingVertical: 10,
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
    paddingVertical: 10,
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 18,
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