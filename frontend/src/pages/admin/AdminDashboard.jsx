import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  if (!stats) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {stats.recentOrders.map(order => (
              <div key={order._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{order.userId?.name}</p>
                  <p className="text-sm text-gray-500">#{order._id.substring(18,24)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-indigo-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Recent Products</h3>
          <div className="space-y-4">
            {stats.recentProducts.map(product => (
              <div key={product._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="font-bold">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
