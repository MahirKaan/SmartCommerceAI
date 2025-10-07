import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
  discount?: number; // discount property'sini ekledim
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // DEĞİŞTİRİLDİ: quantity parametresi eklendi
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product: product,
          quantity: quantity,
        });
      }

      state.total = state.items.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
      );
      
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity,
        0
      );
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.product.id !== action.payload
      );
      
      state.total = state.items.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
      );
      
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity,
        0
      );
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(
        item => item.product.id === action.payload.productId
      );

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            cartItem => cartItem.product.id !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
        }

        state.total = state.items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        );
        
        state.itemCount = state.items.reduce(
          (count, item) => count + item.quantity,
          0
        );
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;