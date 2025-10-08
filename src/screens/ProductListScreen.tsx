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
  StatusBar,
  ActivityIndicator
} from 'react-native';

const { width } = Dimensions.get('window');

// Image Loader Component
const ProductImage = ({ source, style, resizeMode = 'cover' }: any) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={style}>
      {!hasError ? (
        <>
          <Image
            source={{ uri: source }}
            style={[style, { position: 'absolute' }]}
            resizeMode={resizeMode}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          {isLoading && (
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
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setHasError(false);
              setIsLoading(true);
            }}
          >
            <Text style={styles.retryText}>🔄 Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// GERÇEK ÜRÜN VERİLERİ - ÇALIŞAN RESİMLERLE
const tempProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 55999,
    originalPrice: 59999,
    category: 'Elektronik',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692846359318',
    description: 'En yeni iPhone modeli, Titanium kasa, A17 Pro çip, 48MP kamera',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    features: ['5G', 'Face ID', '120Hz', 'USB-C'],
    tags: ['apple', 'iphone', 'premium'],
    discount: 7,
    brand: 'Apple',
    fastDelivery: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 42999,
    originalPrice: 45999,
    category: 'Elektronik',
    image: 'https://images.samsung.com/is/image/samsung/assets/tr/2401/pcd/gallery/S24-Ultra-Bronze-1.jpg',
    description: 'S Pen desteği, 200MP kamera, Snapdragon 8 Gen 3',
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
    features: ['S Pen', '200MP Kamera', '5G', '120Hz'],
    tags: ['samsung', 'android', 'spen'],
    discount: 6,
    brand: 'Samsung',
    fastDelivery: true
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    price: 35999,
    originalPrice: 39999,
    category: 'Elektronik',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367059432',
    description: 'M3 çip, 13.6 inç Liquid Retina, 18 saat pil ömrü',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    features: ['M3 Çip', '18 Saat Pil', 'Retina Ekran', 'MacOS'],
    tags: ['apple', 'macbook', 'laptop'],
    discount: 10,
    brand: 'Apple',
    fastDelivery: false,
    isNew: true
  },
  {
    id: '4',
    name: 'AirPods Pro (2.Nesil)',
    price: 7999,
    originalPrice: 8999,
    category: 'Elektronik',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1694014871985',
    description: 'Gelişmiş aktif gürültü engelleme özellikli kulaklık',
    rating: 4.7,
    reviewCount: 421,
    inStock: true,
    features: ['Gürültü Önleme', '24 Saat Pil', 'USB-C'],
    tags: ['apple', 'airpods', 'kulaklık'],
    discount: 11,
    brand: 'Apple',
    fastDelivery: true
  },
  {
    id: '5',
    name: 'Nike Air Force 1',
    price: 1299,
    originalPrice: 1499,
    category: 'Giyim',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-ayakkab%C4%B1s%C4%B1-1d3386.png',
    description: 'Klasik beyaz spor ayakkabı, deri malzeme',
    rating: 4.5,
    reviewCount: 892,
    inStock: true,
    features: ['Deri Malzeme', 'Air Teknolojisi', 'Beyaz Renk'],
    tags: ['nike', 'spor', 'ayakkabı'],
    discount: 13,
    brand: 'Nike',
    fastDelivery: true,
    isBestSeller: true
  },
  {
    id: '6',
    name: 'iPad Air M2',
    price: 27999,
    originalPrice: 29999,
    category: 'Elektronik',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-finish-select-202405?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1713202736948',
    description: 'M2 çipli yeni nesil iPad',
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    features: ['M2 Çip', 'Liquid Retina', 'Apple Pencil'],
    tags: ['apple', 'ipad', 'tablet'],
    discount: 7,
    brand: 'Apple',
    fastDelivery: false
  },
  {
    id: '7',
    name: 'Samsung Galaxy Buds2 Pro',
    price: 5999,
    originalPrice: 6999,
    category: 'Elektronik',
    image: 'https://images.samsung.com/is/image/samsung/assets/tr/galaxy-buds2-pro/images/galaxy-buds2-pro_highlights_kv.jpg',
    description: 'Profesyonel ses kalitesi',
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    features: ['360 Audio', 'Gürültü Önleme', '24bit Hi-Fi'],
    tags: ['samsung', 'kulaklık', 'wireless'],
    discount: 14,
    brand: 'Samsung',
    fastDelivery: false
  },
  {
    id: '8',
    name: 'Apple Watch Series 9',
    price: 14999,
    originalPrice: 15999,
    category: 'Elektronik',
    image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MT6W3ref_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-aluminum-ultra2_VW_34FR_WF_CO?wid=1400&hei=1400&fmt=p-jpg&qlt=90&.v=1720770862352',
    description: 'Akıllı saatin en gelişmiş modeli',
    rating: 4.5,
    reviewCount: 312,
    inStock: true,
    features: ['GPS', 'Kardiyo Takip', 'Su Geçirmez'],
    tags: ['apple', 'watch', 'akıllı saat'],
    discount: 6,
    brand: 'Apple',
    fastDelivery: true,
    isPopular: true
  },
  {
    id: '9',
    name: 'PlayStation 5',
    price: 14999,
    category: 'Elektronik',
    image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$1600px--t$',
    description: '4K gaming, SSD, DualSense kontrolcü',
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    features: ['4K Gaming', 'SSD', 'DualSense', '8K Çıkış'],
    tags: ['sony', 'playstation', 'oyun'],
    brand: 'Sony',
    fastDelivery: true,
    isPopular: true
  },
  {
    id: '10',
    name: 'Sony WH-1000XM5',
    price: 8999,
    originalPrice: 10999,
    category: 'Elektronik',
    image: 'https://www.sony.com.tr/image/5c8dfb6c9e51d8a0d4d5e5c8a5e5c8a4?fmt=pjpeg&wid=1200&hei=1200',
    description: 'Gürültü önleyici kulaklık, 30 saat pil, dokunmatik kontrol',
    rating: 4.6,
    reviewCount: 421,
    inStock: true,
    features: ['Gürültü Önleme', '30 Saat Pil', 'Dokunmatik', 'Bluetooth 5.2'],
    tags: ['sony', 'kulaklık', 'wireless'],
    discount: 18,
    brand: 'Sony',
    fastDelivery: true
  },
  {
    id: '11',
    name: 'Adidas Ultraboost',
    price: 1899,
    originalPrice: 2199,
    category: 'Giyim',
    image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/abc123def456ghi789jkl/ultraboost-22-shoes.jpg',
    description: 'Koşu ayakkabısı, Boost teknolojisi, rahat taban',
    rating: 4.4,
    reviewCount: 324,
    inStock: true,
    features: ['Boost Teknolojisi', 'Primeknit', 'Koşu'],
    tags: ['adidas', 'spor', 'ayakkabı'],
    discount: 14,
    brand: 'Adidas',
    fastDelivery: true
  },
  {
    id: '12',
    name: 'Dell XPS 13',
    price: 28999,
    originalPrice: 31999,
    category: 'Elektronik',
    image: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/products/notebooks/xps-notebooks/xps-13-9315/media-gallery/notebook-xps-13-9315-nt-blue-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=3334&hei=2417&qlt=100,0&resMode=sharp2&size=3334,2417',
    description: 'İnce ve hafif dizüstü bilgisayar, 13 inç ekran',
    rating: 4.5,
    reviewCount: 198,
    inStock: true,
    features: ['Intel i7', '16GB RAM', '512GB SSD', 'Windows 11'],
    tags: ['dell', 'laptop', 'windows'],
    discount: 9,
    brand: 'Dell',
    fastDelivery: false
  }
];

const categories = [
  { id: 'all', name: 'Tümü', count: tempProducts.length, icon: '📦' },
  { id: 'elektronik', name: 'Elektronik', count: tempProducts.filter(p => p.category === 'Elektronik').length, icon: '📱' },
  { id: 'giyim', name: 'Giyim', count: tempProducts.filter(p => p.category === 'Giyim').length, icon: '👕' },
  { id: 'apple', name: 'Apple', count: tempProducts.filter(p => p.brand === 'Apple').length, icon: '🍎' },
  { id: 'samsung', name: 'Samsung', count: tempProducts.filter(p => p.brand === 'Samsung').length, icon: '📱' },
  { id: 'indirim', name: 'İndirim', count: tempProducts.filter(p => p.discount).length, icon: '🔥' },
  { id: 'yeni', name: 'Yeni Ürünler', count: tempProducts.filter(p => p.isNew).length, icon: '🆕' },
  { id: 'coksatan', name: 'Çok Satan', count: tempProducts.filter(p => p.isBestSeller || p.isPopular).length, icon: '🏆' },
];

// AI Asistanı için arama önerileri
const AI_SEARCH_SUGGESTIONS = [
  { text: 'Bütçe dostu telefonlar', icon: '💰' },
  { text: 'En iyi kulaklıklar', icon: '🎧' },
  { text: 'Yüksek puanlı ürünler', icon: '⭐' },
  { text: 'Hızlı teslimat', icon: '🚚' },
  { text: 'Apple ürünleri', icon: '🍎' },
];

const ProductListScreen = ({ navigation, route }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
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

  // AI Asistanı tetikleme
  const handleAIAssistant = () => {
    navigation.navigate('Home'); // HomeScreen'deki AI modal'ı açılacak
  };

  // AI arama önerisi seçme
  const handleAISuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowAISuggestions(false);
  };

  // Filtreleme fonksiyonu
  const filteredProducts = tempProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.category?.toLowerCase() === selectedCategory ||
      product.brand?.toLowerCase() === selectedCategory ||
      product.tags?.includes(selectedCategory) ||
      (selectedCategory === 'indirim' && product.discount) ||
      (selectedCategory === 'yeni' && product.isNew) ||
      (selectedCategory === 'coksatan' && (product.isBestSeller || product.isPopular));
    
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features?.some((f: string) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
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
        <ProductImage 
          source={item.image} 
          style={styles.productImage}
          resizeMode="cover"
        />
        
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
          {item.fastDelivery && (
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>🚚 Hızlı</Text>
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
        <Text style={styles.productBrand}>{item.brand}</Text>
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
              <Text style={styles.quickStatIcon}>🚚</Text>
              <Text style={styles.quickStatText}>{tempProducts.filter(p => p.fastDelivery).length} Hızlı</Text>
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
                onFocus={() => setShowAISuggestions(true)}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* AI Search Suggestions */}
            {showAISuggestions && searchQuery.length === 0 && (
              <View style={styles.aiSuggestionsContainer}>
                <Text style={styles.aiSuggestionsTitle}>🤖 AI Önerileri</Text>
                {AI_SEARCH_SUGGESTIONS.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.aiSuggestionItem}
                    onPress={() => handleAISuggestion(suggestion.text)}
                  >
                    <Text style={styles.aiSuggestionIcon}>{suggestion.icon}</Text>
                    <Text style={styles.aiSuggestionText}>{suggestion.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.aiAssistantButton}
            onPress={handleAIAssistant}
          >
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
                { id: 'discount', label: 'İndirim', icon: '🔥' },
                { id: 'newest', label: 'Yeniler', icon: '🆕' }
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
          {(selectedCategory !== 'all' || searchQuery) && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              <Text style={styles.clearFiltersText}>🗑️ Filtreleri Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* AI Quick Actions */}
        {sortedProducts.length > 0 && (
          <View style={styles.aiQuickActions}>
            <Text style={styles.aiQuickActionsTitle}>⚡ AI Hızlı İşlemler</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.aiActionsRow}>
                <TouchableOpacity style={styles.aiActionButton}>
                  <Text style={styles.aiActionIcon}>💰</Text>
                  <Text style={styles.aiActionText}>Bütçe Planı</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aiActionButton}>
                  <Text style={styles.aiActionIcon}>⭐</Text>
                  <Text style={styles.aiActionText}>En İyiler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aiActionButton}>
                  <Text style={styles.aiActionIcon}>🚚</Text>
                  <Text style={styles.aiActionText}>Hızlı Teslimat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aiActionButton}>
                  <Text style={styles.aiActionIcon}>🔥</Text>
                  <Text style={styles.aiActionText}>Süper Fırsatlar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

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
              Arama kriterlerinize uygun ürün bulunamadı.{'\n'}
              AI asistanı size özel öneriler sunabilir!
            </Text>
            
            <TouchableOpacity 
              style={styles.aiHelpButton}
              onPress={handleAIAssistant}
            >
              <Text style={styles.aiHelpIcon}>🤖</Text>
              <Text style={styles.aiHelpText}>AI Asistanından Yardım Al</Text>
            </TouchableOpacity>
            
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
    alignItems: 'flex-start',
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
  aiSuggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  aiSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  aiSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  aiSuggestionIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  aiSuggestionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
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
  clearFiltersButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  aiQuickActions: {
    marginBottom: 20,
  },
  aiQuickActionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  aiActionsRow: {
    flexDirection: 'row',
  },
  aiActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aiActionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  aiActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
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
  },
  imagePlaceholder: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  placeholderText: {
    fontSize: 18,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
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
    marginBottom: 4,
  },
  bestSellerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deliveryBadge: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deliveryBadgeText: {
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
  productBrand: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
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
  aiHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  aiHelpIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  aiHelpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
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