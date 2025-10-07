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
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen'; // CartScreen'i import ettim

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
            {/* Cart Screen'i Stack Navigator'a ekledim */}
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