import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { mockProducts, featuredProducts, categories } from '../data/mockData';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const cart = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const itemCount = cart?.itemCount || 0;
  
  const featuredCount = featuredProducts ? featuredProducts.length : 0;
  const totalCount = mockProducts ? mockProducts.length : 0;

  // Kullanıcı adını düzgün formatla
  const formatUserName = (name: string | null) => {
    if (!name) return 'Kullanıcı';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleSearchPress = () => {
    Alert.alert('Arama', 'Arama özelliği yakında eklenecek! 🔍');
  };

  const handleAIAssistant = () => {
    Alert.alert('AI Asistan', 'AI alışveriş asistanı yakında aktif olacak! 🤖');
  };

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Products', { 
      category: category.name,
      title: category.name 
    });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        
        {/* User Info & Cart */}
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'K'}
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
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Ürün, kategori veya marka ara...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>AI Alışveriş Asistanı</Text>
            <Text style={styles.heroDescription}>
              Kişiselleştirilmiş önerilerle{'\n'}mükemmel alışveriş deneyimi
            </Text>
            <TouchableOpacity style={styles.heroButton} onPress={handleAIAssistant}>
              <Text style={styles.heroButtonText}>Keşfet</Text>
              <Text style={styles.heroButtonIcon}>✨</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroVisual}>
            <Text style={styles.heroVisualIcon}>🤖</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}+</Text>
            <Text style={styles.statLabel}>Toplam Ürün</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{featuredCount}</Text>
            <Text style={styles.statLabel}>Öne Çıkan</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{categories?.length || 0}</Text>
            <Text style={styles.statLabel}>Kategori</Text>
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Öne Çıkanlar</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Products', { title: 'Öne Çıkan Ürünler' })}
            >
              <Text style={styles.sectionLink}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {featuredProducts?.slice(0, 5).map((product) => (
              <TouchableOpacity 
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.productImage}>
                  <Text style={styles.productIcon}>📱</Text>
                </View>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <View style={styles.productRating}>
                  <Text style={styles.ratingIcon}>⭐</Text>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📁 Kategoriler</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Products', { title: 'Tüm Kategoriler' })}
            >
              <Text style={styles.sectionLink}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories?.slice(0, 6).map((category, index) => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[
                  styles.categoryIconContainer,
                  { backgroundColor: getCategoryColor(index) }
                ]}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
                <Text style={styles.categoryCount}>{category.count} ürün</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Assistant Card */}
        <TouchableOpacity style={styles.aiCard} onPress={handleAIAssistant}>
          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>🤖 SmartCommerce AI</Text>
            <Text style={styles.aiDescription}>
              Alışveriş alışkanlıklarını analiz edip{'\n'}sana özel öneriler sunar
            </Text>
            <View style={styles.aiFeatures}>
              <Text style={styles.aiFeature}>🎯 Kişiselleştirilmiş Öneriler</Text>
              <Text style={styles.aiFeature}>⚡ Akıllı Fiyat Takibi</Text>
              <Text style={styles.aiFeature}>📊 Alışveriş Analizi</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Bottom Spacer for Tab Bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

// Kategori renkleri için fonksiyon
const getCategoryColor = (index: number) => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
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
    fontWeight: 'bold',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
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
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100, // Tab bar için ekstra boşluk
  },
  heroCard: {
    flexDirection: 'row',
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
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  heroButtonIcon: {
    color: '#8b5cf6',
    fontSize: 14,
  },
  heroVisual: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroVisualIcon: {
    fontSize: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },
  productCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  productIcon: {
    fontSize: 24,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
    height: 32,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    textAlign: 'center',
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 60) / 3,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  aiCard: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  aiFeatures: {
    marginTop: 8,
  },
  aiFeature: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 30,
  },
});

export default HomeScreen;