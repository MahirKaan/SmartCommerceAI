import React, { useState } from 'react';
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
  Animated
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

const stats = {
  totalProducts: tempProducts.length,
  inStock: tempProducts.filter(p => p.inStock).length,
  averageRating: (tempProducts.reduce((acc, p) => acc + p.rating, 0) / tempProducts.length).toFixed(1),
  discountedProducts: tempProducts.filter(p => p.discount).length
};

const ProductListScreen = ({ navigation, route }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Route params'tan gelen kategoriyi al
  const routeCategory = route.params?.category;
  
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
              <Text style={styles.newBadgeText}>Yeni</Text>
            </View>
          )}
          {item.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerBadgeText}>Çok Satan</Text>
            </View>
          )}
        </View>

        {!item.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Stokta Yok</Text>
          </View>
        )}
        
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>⭐ {item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>₺{item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>₺{item.originalPrice.toLocaleString()}</Text>
          )}
        </View>

        <View style={styles.featuresContainer}>
          {item.features?.slice(0, 2).map((feature: string, index: number) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.stockContainer}>
            <View style={[
              styles.stockIndicator,
              item.inStock ? styles.inStock : styles.outOfStock
            ]}>
              <Text style={styles.stockText}>
                {item.inStock ? '✓ Stokta' : '✗ Tükendi'}
              </Text>
            </View>
          </View>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Ürün Kataloğu</Text>
              <Text style={styles.subtitle}>En iyi fırsatlar burada! 🎯</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalProducts}</Text>
                <Text style={styles.statLabel}>Ürün</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.averageRating}</Text>
                <Text style={styles.statLabel}>Puan</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Bar */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>✅</Text>
              <Text style={styles.quickStatText}>{stats.inStock} Stokta</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>🔥</Text>
              <Text style={styles.quickStatText}>{stats.discountedProducts} İndirim</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatIcon}>⭐</Text>
              <Text style={styles.quickStatText}>4.5+ Ortalama</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar with AI Assistant */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="AI ile akıllı ara..."
                placeholderTextColor="#9CA3AF"
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
            <Text style={styles.aiAssistantText}>AI Asistan</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Categories Filter */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
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
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View>
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
          <Text style={styles.sortLabel}>Sırala:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortOptions}>
              {[
                { id: 'default', label: 'Önerilen', icon: '🎯' },
                { id: 'price-low', label: 'Fiyat (Artan)', icon: '📈' },
                { id: 'price-high', label: 'Fiyat (Azalan)', icon: '📉' },
                { id: 'rating', label: 'Değerlendirme', icon: '⭐' },
                { id: 'discount', label: 'İndirim', icon: '🔥' }
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.id}
                  style={[
                    styles.sortOption,
                    sortBy === sort.id && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(sort.id)}
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
            <Text style={styles.resultsCount}>{sortedProducts.length}</Text> ürün bulundu
          </Text>
          {selectedCategory !== 'all' && (
            <View style={styles.activeFilter}>
              <Text style={styles.activeFilterText}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                <Text style={styles.clearFilter}>✕</Text>
              </TouchableOpacity>
            </View>
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
              <Text style={styles.emptyStateButtonText}>Tüm Ürünleri Göster</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
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
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
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
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  clearIcon: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  aiAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiAssistantIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#FFFFFF',
  },
  aiAssistantText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
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
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  categoryCount: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
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
    color: '#6B7280',
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
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
    color: '#6B7280',
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
    color: '#6B7280',
    fontWeight: '500',
  },
  resultsCount: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingHorizontal: 10,
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
    borderRadius: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bestSellerBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  bestSellerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#1F2937',
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  featureTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockContainer: {
    flex: 1,
  },
  stockIndicator: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inStock: {
    backgroundColor: '#DCFCE7',
  },
  outOfStock: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#166534',
  },
  reviewCount: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default ProductListScreen;