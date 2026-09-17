import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (user) {
      const { data } = await api.get('/cart');
      setCart(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (user) {
      const { data } = await api.post('/cart/add', { productId, quantity });
      setCart(data);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
