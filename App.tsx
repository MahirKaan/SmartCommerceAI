import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './src/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { setUser } from './src/store/authSlice';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen'; // ✅ EKSİK OLAN IMPORT EKLENDİ
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import FavoritesScreen from './src/screens/FavoritesScreen'; // ✅ FAVORİLER EKRANI DA EKLENDİ

// ÖDEME EKRANLARI
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';

// Navigation
import MainTabs from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);

  // Splash screen gösterilsin
  if (!isSplashComplete) {
    return <SplashScreen onComplete={() => setIsSplashComplete(true)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Kullanıcı giriş yapmışsa ana uygulama (Bottom Tabs)
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }} 
            />
            
            {/* ProductList Screen'i Stack Navigator'a EKLENDİ */}
            <Stack.Screen 
              name="ProductList" 
              component={ProductListScreen}
              options={{ 
                title: 'Ürünler',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{ 
                title: 'Ürün Detay',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{ 
                title: 'Sepetim',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            
            {/* ✅ FAVORİLER EKRANI STACK'E EKLENDİ */}
            <Stack.Screen 
              name="Favorites" 
              component={FavoritesScreen}
              options={{ 
                title: 'Favorilerim',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            
            {/* ✅ YENİ EKLENEN ÖDEME EKRANLARI */}
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen}
              options={{ 
                title: 'Ödeme',
                headerStyle: {
                  backgroundColor: '#6366f1',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }} 
            />
            
            <Stack.Screen 
              name="OrderSuccess" 
              component={OrderSuccessScreen}
              options={{ 
                headerShown: false
              }} 
            />
          </>
        ) : (
          // Kullanıcı giriş yapmamışsa auth ekranları
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;