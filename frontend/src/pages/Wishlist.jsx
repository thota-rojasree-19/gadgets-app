import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    toast.success('Added to Cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h2>
      {wishlist.products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.products.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-40 bg-gray-100 flex items-center justify-center p-2">
                {product.image ? (
                  <img 
                    src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                ) : null}
                {(!product.image) && (
                  <div className="text-gray-400 text-sm">Img</div>
                )}
                <div style={{ display: 'none' }} className="text-gray-400 text-sm">Img</div>
              </div>
              <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
              <div className="text-xl font-bold text-gray-900 mb-3">₹{product?.price?.toLocaleString('en-IN')}</div>
              <button 
                onClick={() => handleAddToCart(product._id)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex justify-center items-center">
                <ShoppingCart className="h-4 w-4 mr-2" /> Move to Cart
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
