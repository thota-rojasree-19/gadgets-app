import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, fetchCart } = useContext(CartContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">Go Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {cart.items.map(item => (
              <div key={item.productId?._id} className="flex items-center p-4 mb-4 bg-white shadow rounded-lg">
                <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                  {item.productId?.image ? (
                    <img 
                      src={item.productId.image.startsWith('http') ? item.productId.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.productId.image}`} 
                      alt={item.productId.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                  ) : null}
                  {(!item.productId?.image) && (
                    <span className="text-xs text-gray-400">Img</span>
                  )}
                  <span style={{ display: 'none' }} className="text-xs text-gray-400">Img</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold text-lg">{item.productId?.name}</h3>
                  <p className="text-gray-600">₹{item.productId?.price?.toLocaleString('en-IN')}</p>
                  <div className="flex items-center mt-2 space-x-3">
                    <button onClick={() => addToCart(item.productId?._id, -1)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">-</button>
                    <span className="text-sm text-gray-700 font-bold">{item.quantity}</span>
                    <button onClick={() => addToCart(item.productId?._id, 1)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="font-bold text-xl mb-4">Price Details</h3>
              <div className="flex justify-between mb-2">
                <span>Total Items</span>
                <span>{cart.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <Link to="/checkout" className="block text-center w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
