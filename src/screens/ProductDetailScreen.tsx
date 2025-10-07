import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params;
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert(`${product.name} sepete eklendi! 🛒`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigation.navigate('Cart');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₺{product.price.toLocaleString()}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₺{product.originalPrice.toLocaleString()}</Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
          <Text style={styles.reviews}>({product.reviewCount} değerlendirme)</Text>
          <View style={styles.stockStatus}>
            <Text style={product.inStock ? styles.inStock : styles.outOfStock}>
              {product.inStock ? '✅ Stokta var' : '❌ Stokta yok'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          {product.features.map((feature: string, index: number) => (
            <Text key={index} style={styles.feature}>• {feature}</Text>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.addToCartButton,
              !product.inStock && styles.disabledButton
            ]} 
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <Text style={styles.addToCartText}>
              {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.buyNowButton,
              !product.inStock && styles.disabledButton
            ]} 
            onPress={handleBuyNow}
            disabled={!product.inStock}
          >
            <Text style={styles.buyNowText}>
              {product.inStock ? 'Hemen Satın Al' : 'Stokta Yok'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  reviews: {
    fontSize: 14,
    color: '#999',
    marginRight: 15,
  },
  stockStatus: {
    marginLeft: 'auto',
  },
  inStock: {
    color: '#34C759',
    fontWeight: '600',
  },
  outOfStock: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
});

export default ProductDetailScreen;