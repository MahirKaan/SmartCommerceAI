import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/store';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'SmartCommerce AI',
              headerBackTitle: 'Çıkış'
            }}
          />
          <Stack.Screen 
            name="ProductList" 
            component={ProductListScreen}
            options={{ 
              title: 'Tüm Ürünler',
              headerBackTitle: 'Geri'
            }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{ 
              title: 'Ürün Detayı',
              headerBackTitle: 'Geri'
            }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ 
              title: 'Sepetim',
              headerBackTitle: 'Geri'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}