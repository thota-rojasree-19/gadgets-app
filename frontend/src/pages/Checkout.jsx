import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);

  const totalAmount = cart?.items?.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0) || 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock Payment Step
    toast.success('Payment processing...');
    
    setTimeout(async () => {
      try {
        const orderItems = cart.items.map(i => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity
        }));
        
        await api.post('/orders', {
          items: orderItems,
          shippingAddress: address,
          paymentMethod: 'Online Payment',
          totalAmount
        });

        // Clear cart in real app - wait, we should clear it in backend.
        // For now just notify
        toast.success('Order placed successfully!');
        navigate('/orders');
      } catch (err) {
        toast.error('Failed to place order');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form className="bg-white shadow p-6 rounded-lg space-y-4" onSubmit={handlePlaceOrder}>
            <h3 className="font-bold text-xl mb-4">Shipping Address</h3>
            <input required placeholder="Full Name" className="w-full border p-2 rounded" onChange={e => setAddress({...address, fullName: e.target.value})} />
            <input required placeholder="Phone Number" className="w-full border p-2 rounded" onChange={e => setAddress({...address, phone: e.target.value})} />
            <input required placeholder="Address" className="w-full border p-2 rounded" onChange={e => setAddress({...address, address: e.target.value})} />
            <div className="flex gap-4">
              <input required placeholder="City" className="w-full border p-2 rounded" onChange={e => setAddress({...address, city: e.target.value})} />
              <input required placeholder="State" className="w-full border p-2 rounded" onChange={e => setAddress({...address, state: e.target.value})} />
              <input required placeholder="Pincode" className="w-full border p-2 rounded" onChange={e => setAddress({...address, pincode: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Processing...' : 'Pay & Place Order'}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-bold text-xl mb-4">Order Summary</h3>
            {cart.items.map(item => (
              <div key={item.productId._id} className="flex justify-between mb-2">
                <span className="text-gray-600 truncate mr-2">{item.productId.name} x {item.quantity}</span>
                <span>₹{(item.productId.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4 font-bold flex justify-between">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
