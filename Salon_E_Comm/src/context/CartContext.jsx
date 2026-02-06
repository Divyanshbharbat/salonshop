import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/apiClient';
import { getAuthToken } from '../utils/apiClient';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch cart when component mounts or user logs in
    const fetchCart = async () => {
        const token = getAuthToken();
        if (!token) {
            console.log('No auth token, clearing cart');
            setCart(null);
            return;
        }

        setLoading(true);
        setError('');
        try {
            console.log('Fetching cart from API...');
            const cartData = await cartAPI.getCart();
            console.log('Cart fetched:', cartData);
            setCart(cartData);
        } catch (err) {
            console.warn('Failed to fetch cart:', err);
            setError('');
            // Don't show error, just use empty cart
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart on mount and when user logs in/out
    useEffect(() => {
        fetchCart();
        
        // Listen for login/logout events
        const handleAuthChange = () => {
            console.log('📡 Auth state changed, refreshing cart...');
            setTimeout(() => fetchCart(), 100); // Small delay to ensure token is set
        };
        
        // Listen for custom auth event
        window.addEventListener('authChange', handleAuthChange);
        
        // Also listen for storage changes (logout from other tabs)
        const handleStorageChange = (e) => {
            if (e.key === 'authToken') {
                console.log('📡 Token changed in storage, refreshing cart...');
                handleAuthChange();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Also refetch periodically when user is logged in
    useEffect(() => {
        if (!getAuthToken()) return;
        
        const interval = setInterval(() => {
            fetchCart();
        }, 30000); // Refetch cart every 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        try {
            console.log('🛒 Adding to cart:', { productId, quantity, token: getAuthToken()?.substring(0, 20) + '...' });
            const updatedCart = await cartAPI.addToCart(productId, quantity);
            console.log('✅ Cart updated successfully:', updatedCart);
            
            if (!updatedCart) {
                throw new Error('No cart data returned from API');
            }
            
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            console.error('❌ Add to cart error:', err.message);
            setError(err.message);
            throw err;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const updatedCart = await cartAPI.removeFromCart(productId);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const updatedCart = await cartAPI.updateCart(productId, quantity);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const clearCart = async () => {
        try {
            const updatedCart = await cartAPI.clearCart();
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getCartTotal = () => {
        if (!cart) return { totalItems: 0, totalPrice: 0 };
        return {
            totalItems: cart.totalItems || 0,
            totalPrice: cart.totalPrice || 0,
            itemCount: cart.items?.length || 0,
        };
    };

    const value = {
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
        items: cart?.items || [],
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
