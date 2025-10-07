import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { mockProducts, featuredProducts, categories } from '../data/mockData';

const HomeScreen = ({ navigation }: any) => {
  const cart = useSelector((state: RootState) => state.cart);
  const itemCount = cart?.itemCount || 0;
  
  const featuredCount = featuredProducts ? featuredProducts.length : 0;
  const totalCount = mockProducts ? mockProducts.length : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Header with Cart Icon */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Hoş Geldiniz! 👋</Text>
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

      <Text style={styles.subtitle}>Akıllı alışverişe başlayın</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Öne Çıkan Ürünler</Text>
        <Text style={styles.cardText}>
          {featuredCount} premium ürün sizi bekliyor
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.buttonText}>Hemen İncele</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📁 Kategoriler</Text>
        <View style={styles.categories}>
          {categories && categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>({category.count})</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ProductList')}
      >
        <Text style={styles.cardTitle}>📦 Tüm Ürünleri Gör</Text>
        <Text style={styles.cardText}>
          {totalCount}+ ürünü keşfet ve AI önerilerini al
        </Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤖 SmartCommerce AI</Text>
        <Text style={styles.cardText}>
          Kişiselleştirilmiş ürün önerileri ve akıllı alışveriş asistanı
        </Text>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>AI Asistanı Başlat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    position: 'relative',
    padding: 10,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginRight: 4,
  },
  categoryCount: {
    fontSize: 10,
    color: '#666',
  },
});

export default HomeScreen;