import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  Animated,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width } = Dimensions.get('window');

// GEÇİCİ MOCK DATA - MANUEL OLARAK EKLEDİM
const tempProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 55999,
    originalPrice: 59999,
    category: 'Elektronik',
    image: 'https://picsum.photos/300/300?random=1',
    description: 'En yeni iPhone modeli, Titanium kasa, A17 Pro çip, 48MP kamera',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    features: ['5G', 'Face ID', '120Hz', 'USB-C'],
    tags: ['apple', 'iphone', 'premium'],
    discount: 7
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 42999,
    originalPrice: 45999,
    category: 'Elektronik',
    image: 'https://picsum.photos/300/300?random=2',
    description: 'S Pen desteği, 200MP kamera, Snapdragon 8 Gen 3',
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
    features: ['S Pen', '200MP Kamera', '5G', '120Hz'],
    tags: ['samsung', 'android', 'spen'],
    discount: 6
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    price: 35999,
    category: 'Elektronik',
    image: 'https://picsum.photos/300/300?random=3',
    description: 'M3 çip, 13.6 inç Liquid Retina, 18 saat pil ömrü',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    features: ['M3 Çip', '18 Saat Pil', 'Retina Ekran', 'MacOS'],
    tags: ['apple', 'macbook', 'laptop'],
    isNew: true
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 8999,
    originalPrice: 10999,
    category: 'Elektronik',
    image: 'https://picsum.photos/300/300?random=4',
    description: 'Gürültü önleyici kulaklık, 30 saat pil, dokunmatik kontrol',
    rating: 4.6,
    reviewCount: 421,
    inStock: true,
    features: ['Gürültü Önleme', '30 Saat Pil', 'Dokunmatik', 'Bluetooth 5.2'],
    tags: ['sony', 'kulaklık', 'wireless'],
    discount: 18
  },
  {
    id: '5',
    name: 'Nike Air Force 1',
    price: 1299,
    category: 'Giyim',
    image: 'https://picsum.photos/300/300?random=5',
    description: 'Klasik beyaz spor ayakkabı, deri malzeme',
    rating: 4.5,
    reviewCount: 892,
    inStock: true,
    features: ['Deri Malzeme', 'Air Teknolojisi', 'Beyaz Renk'],
    tags: ['nike', 'spor', 'ayakkabı'],
    isBestSeller: true
  },
  {
    id: '6',
    name: 'PlayStation 5',
    price: 14999,
    category: 'Elektronik',
    image: 'https://picsum.photos/300/300?random=6',
    description: '4K gaming, SSD, DualSense kontrolcü',
    rating: 4.9,
    reviewCount: 567,
    inStock: false,
    features: ['4K Gaming', 'SSD', 'DualSense', '8K Çıkış'],
    tags: ['sony', 'playstation', 'oyun'],
    isPopular: true
  }
];

const categories = [
  { id: 'all', name: 'Tümü', count: tempProducts.length, icon: '📦' },
  { id: 'elektronik', name: 'Elektronik', count: tempProducts.filter(p => p.category === 'Elektronik').length, icon: '📱' },
  { id: 'giyim', name: 'Giyim', count: tempProducts.filter(p => p.category === 'Giyim').length, icon: '👕' },
  { id: 'spor', name: 'Spor', count: tempProducts.filter(p => p.tags?.includes('spor')).length, icon: '⚽' },
  { id: 'apple', name: 'Apple', count: tempProducts.filter(p => p.tags?.includes('apple')).length, icon: '🍎' },
  { id: 'indirim', name: 'İndirim', count: tempProducts.filter(p => p.discount).length, icon: '🔥' },
];

const ProductListScreen = ({ navigation, route }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header opacity animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Header scale animation
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  // Filtreleme fonksiyonu
  const filteredProducts = tempProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.category?.toLowerCase() === selectedCategory ||
      product.tags?.includes(selectedCategory) ||
      (selectedCategory === 'indirim' && product.discount);
    
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Sıralama fonksiyonu
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      default:
        return 0;
    }
  });

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        
        {/* Badge Container */}
        <View style={styles.badgeContainer}>
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>%{item.discount}</Text>
            </View>
          )}
          {item.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>🆕 Yeni</Text>
            </View>
          )}
          {item.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerBadgeText}>🏆 Çok Satan</Text>
            </View>
          )}
        </View>

        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>❌ Stokta Yok</Text>
          </View>
        )}
        
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>⭐ {item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>#{item.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>₺{item.price.toLocaleString('tr-TR')}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₺{item.originalPrice.toLocaleString('tr-TR')}</Text>
          )}
        </View>

        {item.discount && item.originalPrice && (
          <View style={styles.savingsContainer}>
            <Text style={styles.savingsText}>
              💰 ₺{(item.originalPrice - item.price).toLocaleString('tr-TR')} tasarruf
            </Text>
          </View>
        )}

        <View style={styles.featuresContainer}>
          {item.features?.slice(0, 2).map((feature: string, index: number) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>✓ {feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerContainer}>
          <View style={[
            styles.stockContainer,
            item.inStock ? styles.inStock : styles.outOfStock
          ]}>
            <Text style={styles.stockText}>
              {item.inStock ? '✅ Stokta' : '❌ Tükendi'}
            </Text>
          </View>
          <Text style={styles.reviewCount}>👥 {item.reviewCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { 
        opacity: headerOpacity,
        transform: [{ scale: headerScale }]
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>🛍️ Ürünler</Text>
              <Text style={styles.subtitle}>SmartCommerce AI ile akıllı alışveriş</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{tempProducts.length}</Text>
                <Text style={styles.statLabel}>Ürün</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {(tempProducts.reduce((acc, p) => acc + p.rating, 0) / tempProducts.length).toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Puan</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Bar */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>✅</Text>
              <Text style={styles.quickStatText}>{tempProducts.filter(p => p.inStock).length} Stokta</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>🔥</Text>
              <Text style={styles.quickStatText}>{tempProducts.filter(p => p.discount).length} İndirim</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>⭐</Text>
              <Text style={styles.quickStatText}>4.5+ Ortalama</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Search Bar with AI Assistant */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="SmartCommerce AI ile ara..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.aiAssistantButton}>
            <Text style={styles.aiAssistantIcon}>🤖</Text>
            <Text style={styles.aiAssistantText}>AI</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Categories Filter */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>🏷️ Kategoriler</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryFilter,
                  selectedCategory === category.id && styles.categoryFilterActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryTextContainer}>
                  <Text style={[
                    styles.categoryFilterText,
                    selectedCategory === category.id && styles.categoryFilterTextActive
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[
                    styles.categoryCount,
                    selectedCategory === category.id && styles.categoryCountActive
                  ]}>
                    {category.count} ürün
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>📊 Sırala:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
            <View style={styles.sortOptions}>
              {[
                { id: 'default', label: 'Önerilen', icon: '🎯' },
                { id: 'price-low', label: 'Fiyat ↑', icon: '📈' },
                { id: 'price-high', label: 'Fiyat ↓', icon: '📉' },
                { id: 'rating', label: 'Puan', icon: '⭐' },
                { id: 'discount', label: 'İndirim', icon: '🔥' }
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.id}
                  style={[
                    styles.sortOption,
                    sortBy === sort.id && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(sort.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sortIcon}>{sort.icon}</Text>
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === sort.id && styles.sortOptionTextActive
                  ]}>
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results Info */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            🔍 <Text style={styles.resultsCount}>{sortedProducts.length}</Text> ürün bulundu
          </Text>
          {selectedCategory !== 'all' && (
            <TouchableOpacity 
              style={styles.activeFilter}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={styles.activeFilterText}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </Text>
              <Text style={styles.clearFilter}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <FlatList
            data={sortedProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Ürün bulunamadı</Text>
            <Text style={styles.emptyStateText}>
              Arama kriterlerinize uygun ürün bulunamadı.
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.emptyStateButtonText}>🔄 Tüm Ürünleri Göster</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  quickStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  quickStatText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 16,
    color: '#64748b',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  aiAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  aiAssistantIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#FFFFFF',
  },
  aiAssistantText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  categoriesScroll: {
    marginHorizontal: -16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 120,
  },
  categoryFilterActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  categoryCount: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 2,
  },
  categoryCountActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginRight: 12,
  },
  sortScroll: {
    flex: 1,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sortOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  sortIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  resultsCount: {
    fontWeight: '700',
    color: '#6366f1',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 6,
  },
  clearFilter: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  productsGrid: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8fafc',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
  },
  discountBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  newBadge: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bestSellerBadge: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bestSellerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1e293b',
  },
  productInfo: {
    padding: 16,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inStock: {
    backgroundColor: '#dcfce7',
  },
  outOfStock: {
    backgroundColor: '#fef2f2',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  reviewCount: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default ProductListScreen;