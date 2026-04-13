import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.product_id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.product_id === product.id
                        ? { ...i, qty: i.qty + qty }
                        : i
                );
            }
            return [...prev, {
                product_id:   product.id,
                product_name: product.name,
                unit_price:   parseFloat(product.price),
                image_url:    product.image_url,
                qty,
            }];
        });
    };

    const updateQty = (productId, qty) => {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(i => i.product_id === productId ? { ...i, qty } : i));
    };

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(i => i.product_id !== productId));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.unit_price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, total, count }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
