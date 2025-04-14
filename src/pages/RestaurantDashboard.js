import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: 'https://via.placeholder.com/150',
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    calories: '',
    ingredients: [],
    allergens: [],
  });

  const [imageError, setImageError] = useState('');

  const restaurant = JSON.parse(localStorage.getItem('restaurant'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!restaurant || !token) {
      navigate('/restaurant/login');
      return;
    }
    fetchMenuItems();
    fetchOrders();
  }, [navigate, restaurant, token]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/food-items?restaurantId=${restaurant.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenuItems(response.data);
    } catch (err) {
      setError('Error fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/restaurant/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError('Error fetching orders');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        isAvailable: item.isAvailable,
        preparationTime: item.preparationTime,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
        isGlutenFree: item.isGlutenFree,
        calories: item.calories,
        ingredients: item.ingredients,
        allergens: item.allergens,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: '',
        image: 'https://via.placeholder.com/150',
        isAvailable: true,
        preparationTime: 15,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        calories: '',
        ingredients: [],
        allergens: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'image') {
      // Validate image URL
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        setImageError('Image URL must start with http:// or https://');
      } else {
        setImageError('');
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate image URL before submission
    if (!formData.image.startsWith('http://') && !formData.image.startsWith('https://')) {
      setError('Please enter a valid image URL');
      return;
    }
    
    try {
      if (selectedItem) {
        await axios.put(
          `/api/food-items/${selectedItem._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          '/api/food-items',
          { ...formData, restaurantId: restaurant.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchMenuItems();
      handleCloseDialog();
    } catch (err) {
      setError('Error saving menu item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/food-items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMenuItems();
      } catch (err) {
        setError('Error deleting menu item');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('restaurant');
    navigate('/restaurant/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">Restaurant Dashboard</Typography>
              <Button variant="outlined" color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </Paper>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper sx={{ width: '100%' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Menu Items" />
                <Tab label="Orders" />
              </Tabs>

              {activeTab === 0 && (
                <Box sx={{ p: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Add Menu Item
                    </Button>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menuItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>${item.price}</TableCell>
                            <TableCell>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleOpenDialog(item)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(item._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Items</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{order.userId.name}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>${order.totalAmount}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>
                              <IconButton>
                                <ViewIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Category"
                  name="category"
                  select
                  value={formData.category}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="main course">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="side dish">Side Dish</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  error={!!imageError}
                  helperText={imageError || "Enter a valid image URL (must start with http:// or https://)"}
                />
              </Grid>
              <Grid item xs={12}>
                {formData.image && !imageError && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img 
                      src={formData.image} 
                      alt="Food item preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preparation Time (minutes)"
                  name="preparationTime"
                  type="number"
                  value={formData.preparationTime}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Calories"
                  name="calories"
                  type="number"
                  value={formData.calories}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      name="isAvailable"
                    />
                  }
                  label="Available"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVegetarian}
                      onChange={handleChange}
                      name="isVegetarian"
                    />
                  }
                  label="Vegetarian"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isVegan}
                      onChange={handleChange}
                      name="isVegan"
                    />
                  }
                  label="Vegan"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RestaurantDashboard; 