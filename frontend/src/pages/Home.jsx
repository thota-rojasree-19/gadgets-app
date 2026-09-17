import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Heart, ShoppingCart, Loader, Image as ImageIcon } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by search
    if (searchTerm) {
      const query = searchTerm.trim().toLowerCase();
      result = result.filter(p => 
        (p.name?.toLowerCase().includes(query)) || 
        (p.brand?.toLowerCase().includes(query)) || 
        (p.category?.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [searchTerm, category, sort, products]);

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1);
      toast.success('Added to Cart');
    } catch (e) {
      toast.error('Please login to add to cart');
    }
  };

  const handleAddToWishlist = async (id) => {
    try {
      await addToWishlist(id);
      toast.success('Added to Wishlist');
    } catch (e) {
      toast.error('Please login to add to wishlist');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-indigo-600 rounded-2xl p-8 mb-12 text-white shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Latest Gadgets<br/>Upgrade Your Tech Life</h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">Discover smartphones, laptops, earbuds, smartwatches and more.</p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md">Shop Now</button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Gadgets</h2>
        <div className="flex gap-4">
          <select 
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Tablets">Tablets</option>
            <option value="Earbuds">Earbuds</option>
            <option value="Headphones">Headphones</option>
            <option value="Smartwatches">Smartwatches</option>
            <option value="Gaming">Gaming</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select 
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort By ▼</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-900 mb-2">No products found</p>
          <p className="text-gray-500">Try searching for another gadget, brand or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
            <div className="relative h-56 bg-gray-50 flex flex-col items-center justify-center p-4">
              <button onClick={() => handleAddToWishlist(product._id)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10 transition bg-white/80 rounded-full p-2 shadow-sm">
                <Heart className="h-5 w-5" />
              </button>
              {product.image ? (
                <img 
                  src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply" 
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
              ) : null}
              {(!product.image) && (
                <div style={{ display: product.image ? 'none' : 'block' }}>
                  <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                  <div className="text-gray-400 text-xs text-center">{product.name}</div>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">{product.brand}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-sm text-gray-600">{product.rating || 4.5} ({product.reviews || 0} Reviews)</span>
              </div>
              <div className="flex items-baseline space-x-2 mb-3">
                <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div className="flex items-center text-green-600">
                  <span className="mr-1">🚚</span> Free Delivery
                </div>
                <div className="flex items-center text-indigo-600">
                  <span className="mr-1">✓</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <button 
                onClick={() => handleAddToCart(product._id)} 
                disabled={product.stock <= 0}
                className={`w-full py-2 rounded-lg font-semibold transition flex justify-center items-center ${product.stock > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                <ShoppingCart className="h-4 w-4 mr-2" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default Home;
