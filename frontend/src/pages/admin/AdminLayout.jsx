import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="h-5 w-5 mr-3" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="h-5 w-5 mr-3" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5 mr-3" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="w-full md:w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-extrabold text-indigo-700 tracking-wider">GADGETS ADMIN</h2>
        </div>
        <nav className="mt-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'text-indigo-700 bg-indigo-50 border-r-4 border-indigo-700'
                  : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
