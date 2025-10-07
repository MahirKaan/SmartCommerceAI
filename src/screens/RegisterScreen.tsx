import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerUser } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isFocused, setIsFocused] = useState({ 
    displayName: false, 
    email: false, 
    password: false 
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Giriş animasyonları
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Hata durumunda shake animasyonu
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const handleRegister = () => {
    if (!email || !password || !displayName) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı');
      return;
    }

    dispatch(registerUser({ email, password, displayName }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Smooth Gradient Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Logo Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🚀</Text>
              <View style={styles.logoGlow} />
            </View>
            <Text style={styles.welcomeText}>Yeni Hesap Oluştur</Text>
            <Text style={styles.subtitle}>AI destekli alışveriş deneyimine başla</Text>
          </View>

          {/* Error Message */}
          {error && (
            <Animated.View 
              style={[
                styles.errorContainer,
                { transform: [{ translateX: shakeAnim }] }
              ]}
            >
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Display Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                placeholder="Ali Yılmaz"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={displayName}
                onChangeText={setDisplayName}
                style={[
                  styles.input,
                  isFocused.displayName && styles.inputFocused
                ]}
                autoCapitalize="words"
                onFocus={() => setIsFocused(prev => ({ ...prev, displayName: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, displayName: false }))}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-posta Adresi</Text>
              <TextInput
                placeholder="ornek@email.com"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={email}
                onChangeText={setEmail}
                style={[
                  styles.input,
                  isFocused.email && styles.inputFocused
                ]}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsFocused(prev => ({ ...prev, email: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, email: false }))}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={password}
                onChangeText={setPassword}
                style={[
                  styles.input,
                  isFocused.password && styles.inputFocused
                ]}
                secureTextEntry
                onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
              />
              <Text style={styles.passwordHint}>En az 6 karakter</Text>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Hesap açmanın avantajları:</Text>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🎯</Text>
                <Text style={styles.benefitText}>Kişiselleştirilmiş AI önerileri</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>💾</Text>
                <Text style={styles.benefitText}>Sepet ve favori kaydı</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>⚡</Text>
                <Text style={styles.benefitText}>Hızlı ödeme ve takip</Text>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              style={[
                styles.registerButton,
                isLoading && styles.registerButtonDisabled
              ]}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
                </Text>
                {!isLoading && <Text style={styles.buttonArrow}>✨</Text>}
              </View>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginContainer}
          >
            <Text style={styles.loginText}>
              Zaten hesabın var mı? <Text style={styles.loginHighlight}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>Verileriniz 256-bit şifreleme ile korunuyor</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#8b5cf6',
    opacity: 0.9,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    zIndex: -1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#FEF2F2',
    fontWeight: '600',
    flex: 1,
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    padding: 18,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputFocused: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  passwordHint: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  benefitsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  benefitsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  benefitText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#6366f1',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonArrow: {
    color: '#6366f1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  loginContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  loginHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  securityIcon: {
    marginRight: 8,
    fontSize: 12,
  },
  securityText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RegisterScreen;