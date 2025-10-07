import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

// Type definitions for tab icons
interface TabIconProps {
  focused: boolean;
}

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }: TabIconProps) => (
            <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
                🏠
              </Text>
            </View>
          ),
          tabBarLabel: ({ focused }: TabIconProps) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              Ana Sayfa
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductListScreen}
        options={{
          tabBarIcon: ({ focused }: TabIconProps) => (
            <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
                📦
              </Text>
            </View>
          ),
          tabBarLabel: ({ focused }: TabIconProps) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              Ürünler
            </Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }: TabIconProps) => (
            <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
              <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
                🛒
              </Text>
            </View>
          ),
          tabBarLabel: ({ focused }: TabIconProps) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              Sepet
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 4,
  },
  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabIconText: {
    fontSize: 20,
  },
  tabIconTextFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabLabelFocused: {
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default MainTabs;