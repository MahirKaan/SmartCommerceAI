// src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearCart } from '../store/cartSlice';

const CheckoutScreen = ({ navigation, route }: any) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');

  const paymentMethods = [
    { id: 'card', name: '💳 Kredi/Banka Kartı', icon: '💳' },
    { id: 'paypal', name: '📊 PayPal', icon: '📊' },
    { id: 'transfer', name: '🏦 Havale/EFT', icon: '🏦' },
  ];

  const deliveryOptions = [
    { id: 'standard', name: 'Standart Teslimat', price: 0, days: '3-5 iş günü' },
    { id: 'express', name: 'Express Teslimat', price: 29.99, days: '1-2 iş günü' },
    { id: 'sameDay', name: 'Aynı Gün Teslimat', price: 49.99, days: 'Aynı gün' },
  ];

  const [selectedDelivery, setSelectedDelivery] = useState('standard');

  // ✅ DÜZELTME: Delivery option'ı güvenli şekilde al
  const selectedDeliveryOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
  
  // ✅ DÜZELTME: Fiyatı güvenli şekilde hesapla
  const deliveryPrice = selectedDeliveryOption?.price || 0;
  const finalTotal = cart.total + deliveryPrice;

  // Stripe Ödeme Başlatma
  const initializePaymentSheet = async () => {
    setLoading(true);
    
    try {
      // Backend'den payment intent al
      // NOT: Şimdilik mock data kullanıyoruz, sonra gerçek backend entegre ederiz
      const mockPaymentData = {
        paymentIntent: 'pi_mock_123456',
        ephemeralKey: 'ek_mock_123456', 
        customer: 'cus_mock_123456'
      };

      const { error } = await initPaymentSheet({
        merchantDisplayName: "SmartCommerce AI",
        customerId: mockPaymentData.customer,
        customerEphemeralKeySecret: mockPaymentData.ephemeralKey,
        paymentIntentClientSecret: mockPaymentData.paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (!error) {
        setLoading(false);
        return true;
      } else {
        Alert.alert('Hata', error.message);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.log('Ödeme hatası:', error);
      Alert.alert('Hata', 'Ödeme işlemi başlatılamadı');
      setLoading(false);
      return false;
    }
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    
    const initialized = await initializePaymentSheet();
    if (!initialized) return;

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Ödeme başarısız: ${error.message}`);
    } else {
      // Ödeme başarılı
      Alert.alert('✅ Ödeme Başarılı!', 'Siparişiniz alındı.', [
        {
          text: 'Tamam',
          onPress: () => {
            dispatch(clearCart());
            navigation.navigate('OrderSuccess', { 
              orderId: `ORD-${Date.now()}`,
              total: finalTotal 
            });
          },
        },
      ]);
    }
    setLoading(false);
  };

  // ✅ DÜZELTME: Mock ödeme fonksiyonu (Stripe entegre edene kadar)
  const handleMockPayment = () => {
    setLoading(true);
    
    // 2 saniye loading göster
    setTimeout(() => {
      dispatch(clearCart());
      setLoading(false);
      navigation.navigate('OrderSuccess', { 
        orderId: `ORD-${Date.now()}`,
        total: finalTotal 
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        {/* Teslimat Seçenekleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚚 Teslimat Seçeneği</Text>
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedDelivery === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedDelivery(option.id)}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionPrice}>
                  {/* ✅ DÜZELTİLDİ: option.price doğrudan kullan */}
                  {option.price > 0 ? `+₺${option.price}` : 'ÜCRETSİZ'}
                </Text>
              </View>
              <Text style={styles.optionDays}>{option.days}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ödeme Yöntemleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Ödeme Yöntemi</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionCard,
                selectedPayment === method.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentIcon}>{method.icon}</Text>
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sipariş Özeti */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Sipariş Özeti</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ara Toplam</Text>
              <Text style={styles.summaryValue}>₺{cart.total.toLocaleString('tr-TR')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo</Text>
              <Text style={styles.summaryValue}>
                {/* ✅ DÜZELTİLDİ: deliveryPrice kullan */}
                {deliveryPrice > 0 ? `₺${deliveryPrice}` : 'ÜCRETSİZ'}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Toplam</Text>
              <Text style={styles.totalValue}>₺{finalTotal.toLocaleString('tr-TR')}</Text>
            </View>
          </View>
        </View>

        {/* Güvenlik Bilgisi */}
        <View style={styles.securitySection}>
          <Text style={styles.securityTitle}>🛡️ Güvenli Ödeme</Text>
          <Text style={styles.securityText}>
            • 256-bit SSL şifreleme{'\n'}
            • Ödeme bilgileriniz güvende{'\n'}
            • 3D Secure desteği
          </Text>
        </View>

        {/* Demo Notu */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>🧪 Demo Modu</Text>
          <Text style={styles.demoText}>
            • Şu an mock ödeme sistemi çalışıyor{'\n'}
            • Gerçek ödeme için Stripe entegre edilecek{'\n'}
            • Test amaçlı "Ödemeyi Tamamla" butonunu kullanın
          </Text>
        </View>
      </ScrollView>

      {/* Ödeme Butonu */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            loading && styles.payButtonDisabled
          ]}
          onPress={handleMockPayment} // ✅ Mock ödeme kullan
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>
              💳 ₺{finalTotal.toLocaleString('tr-TR')} Öde
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Demo Bilgilendirme */}
        <Text style={styles.demoNote}>
          🔒 Bu bir demo ödeme ekranıdır
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#6366f1',
  },
  backButton: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  optionDays: {
    fontSize: 14,
    color: '#64748b',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6366f1',
  },
  securitySection: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  demoSection: {
    backgroundColor: '#fffbeb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
    marginTop: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  payButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  demoNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CheckoutScreen;