import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
    tags: ['apple', 'iphone', 'premium']
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
    tags: ['samsung', 'android', 'spen']
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
    tags: ['apple', 'macbook', 'laptop']
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
    tags: ['sony', 'kulaklık', 'wireless']
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
    tags: ['nike', 'spor', 'ayakkabı']
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
    tags: ['sony', 'playstation', 'oyun']
  }
];

const ProductListScreen = ({ navigation }: any) => {
  const renderProduct = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₺{item.price.toLocaleString()}</Text>
        {item.originalPrice && (
          <Text style={styles.originalPrice}>₺{item.originalPrice.toLocaleString()}</Text>
        )}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.reviews}>({item.reviewCount})</Text>
        </View>
        <View style={styles.stockContainer}>
          <Text style={item.inStock ? styles.inStock : styles.outOfStock}>
            {item.inStock ? '✅ Stokta' : '❌ Stokta Yok'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tüm Ürünler ({tempProducts.length})</Text>
      <FlatList
        data={tempProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 220,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
    height: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#999',
  },
  stockContainer: {
    marginTop: 'auto',
  },
  inStock: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
  },
  outOfStock: {
    fontSize: 11,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default ProductListScreen;