import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens - Relative path kullanıyoruz
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ 
          title: 'Ana Sayfa',
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <HomeStack.Screen 
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
    </HomeStack.Navigator>
  );
};

// Favorites Stack Navigator
const FavoritesStackNavigator = () => {
  return (
    <FavoritesStack.Navigator>
      <FavoritesStack.Screen 
        name="FavoritesMain" 
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
    </FavoritesStack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <HomeStackNavigator />
  );
};

export default MainTabs;