import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { user } = useContext(AuthContext);

  const fetchWishlist = async () => {
    if (user) {
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user]);

  const addToWishlist = async (productId) => {
    if (user) {
      const { data } = await api.post('/wishlist/add', { productId });
      setWishlist(data);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
