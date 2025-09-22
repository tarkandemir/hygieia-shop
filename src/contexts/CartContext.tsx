'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { ICartItem, ICart, IProduct } from './types';

interface CartContextType {
  cart: ICart;
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: IProduct; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: ICart };

const initialCart: ICart = {
  items: [],
  subtotal: 0,
  taxAmount: 0,
  shippingCost: 0,
  totalAmount: 0,
};

function calculateTotals(items: ICartItem[]): Pick<ICart, 'subtotal' | 'taxAmount' | 'shippingCost' | 'totalAmount'> {
  // Use proper floating point arithmetic
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.totalPrice, 0) * 100) / 100; // Prices already include VAT
  const taxAmount = 0; // No additional VAT calculation needed
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over 500 TL
  const totalAmount = Math.round((subtotal + shippingCost) * 100) / 100; // Total = products + shipping (no extra VAT)

  return {
    subtotal,
    taxAmount,
    shippingCost,
    totalAmount,
  };
}

function cartReducer(state: ICart, action: CartAction): ICart {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product._id === product._id);
      
      let newItems: ICartItem[];
      
      if (existingItemIndex >= 0) {
        // Update existing item with stock control
        const existingItem = state.items[existingItemIndex];
        const maxQuantity = Math.min(product.stock, existingItem.quantity + quantity);
        const actualQuantity = Math.max(1, maxQuantity); // Ensure at least 1
        
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? {
                ...item, 
                quantity: actualQuantity,
                totalPrice: Math.round((product.retailPrice * actualQuantity) * 100) / 100
              }
            : item
        );
      } else {
        // Add new item with stock control
        const safeQuantity = Math.min(Math.max(1, quantity), product.stock);
        const newItem: ICartItem = {
          product,
          quantity: safeQuantity,
          unitPrice: product.retailPrice,
          totalPrice: Math.round((product.retailPrice * safeQuantity) * 100) / 100,
        };
        newItems = [...state.items, newItem];
      }

      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.product._id !== productId);
      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }
      
      const newItems = state.items.map(item => {
        if (item.product._id === productId) {
          // Apply stock control
          const safeQuantity = Math.min(quantity, item.product.stock);
          return {
            ...item,
            quantity: safeQuantity,
            totalPrice: Math.round((item.unitPrice * safeQuantity) * 100) / 100,
          };
        }
        return item;
      });

      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'CLEAR_CART': {
      return initialCart;
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes (only on client side)
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: IProduct, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      isLoaded,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
