import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchTerm = searchParams.get('search') || '';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (location.pathname !== '/') {
      navigate(`/?search=${encodeURIComponent(val)}`);
    } else {
      navigate(`/?search=${encodeURIComponent(val)}`, { replace: true });
    }
  };

  const clearSearch = () => {
    navigate(`/?search=`, { replace: true });
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wider">GADGETS</Link>
          </div>
          
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search for gadgets, brands, or categories..."
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/wishlist" className="relative text-gray-500 hover:text-indigo-600 transition">
              <Heart className="h-6 w-6" />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="relative text-gray-500 hover:text-indigo-600 transition">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/orders" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 hidden sm:block">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 hidden sm:block">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition flex items-center">
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-gray-500 hover:text-indigo-600 transition flex items-center">
                <User className="h-6 w-6 mr-1" />
                <span className="hidden sm:inline text-sm font-semibold">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
