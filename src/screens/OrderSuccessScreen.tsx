// src/screens/OrderSuccessScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

const OrderSuccessScreen = ({ navigation, route }: any) => {
  const { orderId, total } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#10b981" barStyle="light-content" />
      
      <View style={styles.container}>
        <View style={styles.successIcon}>
          <Text style={styles.iconText}>🎉</Text>
        </View>
        
        <Text style={styles.title}>Siparişiniz Alındı!</Text>
        <Text style={styles.subtitle}>AI destekli alışveriş deneyiminiz için teşekkürler</Text>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Sipariş No:</Text>
          <Text style={styles.orderValue}>{orderId}</Text>
          
          <Text style={styles.orderLabel}>Toplam Tutar:</Text>
          <Text style={styles.orderValue}>₺{total.toLocaleString('tr-TR')}</Text>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.stepsTitle}>Sonraki Adımlar:</Text>
          <Text style={styles.step}>1. Sipariş onay e-postası alacaksınız</Text>
          <Text style={styles.step}>2. Kargo bilgileri 24 saat içinde iletilecek</Text>
          <Text style={styles.step}>3. AI asistanı size özel indirimler sunacak</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.primaryButtonText}>🏠 Ana Sayfaya Dön</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.secondaryButtonText}>📦 Siparişlerimi Gör</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#10b981',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#10b981',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  orderInfo: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
  },
  orderLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  nextSteps: {
    width: '100%',
    marginBottom: 32,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  step: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  secondaryButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderSuccessScreen;