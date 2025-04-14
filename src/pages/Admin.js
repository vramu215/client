import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'main', // Default category
  });

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('/api/food-items');
      setFoodItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch food items');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (editingItem) {
        await axios.put(
          `/api/food-items/${editingItem.id}`,
          formData
        );
        setSuccess('Food item updated successfully!');
      } else {
        await axios.post('/api/food-items', formData);
        setSuccess('Food item added successfully!');
      }
      fetchFoodItems();
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        image: '',
        description: '',
        category: 'main',
      });
    } catch (err) {
      setError('Failed to save food item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category || 'main',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/food-items/${id}`);
        setSuccess('Food item deleted successfully!');
        fetchFoodItems();
      } catch (err) {
        setError('Failed to delete food item');
      }
    }
  };

  const filteredItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="3"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update' : 'Add'} Item
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      price: '',
                      image: '',
                      description: '',
                      category: 'main',
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Food Items</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded pl-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <svg 
                className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No food items found</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="card p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.category || 'main'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-secondary bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin; 