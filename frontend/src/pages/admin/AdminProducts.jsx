import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'Smartphones', description: '', price: 0, mrp: 0, stock: 0 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentId(product._id);
    setFormData({
      name: product.name, brand: product.brand, category: product.category,
      description: product.description, price: product.price, mrp: product.mrp, stock: product.stock
    });
    setFile(null);
    setPreview(product.image ? (product.image.startsWith('http') ? product.image : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '').replace(/\/api$/, '')}${product.image}`) : null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', brand: '', category: 'Smartphones', description: '', price: 0, mrp: 0, stock: 0 });
    setFile(null);
    setPreview(null);
    setIsEditing(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('brand', formData.brand);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('mrp', formData.mrp);
    submitData.append('stock', formData.stock);
    if (file) {
      submitData.append('image', file);
    }

    try {
      if (isEditing) {
        await api.put(`/products/${currentId}`, submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', submitData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to add product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
        <button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Name" value={formData.name} className="border p-2 rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="Brand" value={formData.brand} className="border p-2 rounded" onChange={e => setFormData({...formData, brand: e.target.value})} />
            <select value={formData.category} className="border p-2 rounded" onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Smartphones</option><option>Laptops</option><option>Tablets</option><option>Earbuds</option><option>Headphones</option><option>Smartwatches</option><option>Gaming</option><option>Accessories</option>
            </select>
            <input required type="number" placeholder="Price" value={formData.price} className="border p-2 rounded" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            <input required type="number" placeholder="MRP" value={formData.mrp} className="border p-2 rounded" onChange={e => setFormData({...formData, mrp: Number(e.target.value)})} />
            <input required type="number" placeholder="Stock" value={formData.stock} className="border p-2 rounded" onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
          </div>
          <textarea required placeholder="Description" value={formData.description} className="border p-2 rounded w-full" onChange={e => setFormData({...formData, description: e.target.value})} />
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Product Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />
            {preview && (
              <div className="mt-2 relative w-32 h-32 border rounded overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">{isEditing ? 'Update Product' : 'Save Product'}</button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '').replace(/\/api$/, '')}${product.image}`} 
                      alt={product.name} 
                      className="h-10 w-10 object-cover rounded" 
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                  ) : null}
                  {(!product.image) && (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Img</span>
                    </div>
                  )}
                  <div style={{ display: 'none' }} className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center"><span className="text-xs text-gray-500">No Img</span></div></td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-gray-500 text-sm">{product.brand} • {product.category}</div>
                </td>
                <td className="px-6 py-4">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
