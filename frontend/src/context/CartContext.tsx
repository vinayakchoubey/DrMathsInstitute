"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    _id: string;
    title: string;
    price: number;
    thumbnail: string;
    teacherName?: string;
    className?: string; // For modules
    type?: 'course' | 'module';
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    cartTotal: number;
    isInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            if (prev.some(i => i._id === item._id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(i => i._id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const isInCart = (itemId: string) => {
        return items.some(item => item._id === itemId);
    };

    const cartTotal = items.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal, isInCart }}>
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

