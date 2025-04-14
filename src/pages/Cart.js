import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Divider,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

function Cart() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the restaurant ID from the first item in the cart
      const restaurantId = cart[0].restaurantId;
      
      // Format cart items for the order
      const orderItems = cart.map(item => ({
        foodItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specialInstructions: '' // Optional field
      }));

      // Calculate total with delivery fee and tax
      const subtotal = getCartTotal();
      const deliveryFee = 5.00;
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + deliveryFee + tax;

      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to place an order');
        navigate('/login');
        return;
      }

      // Create the order
      const response = await axios.post(
        'http://localhost:3001/api/orders',
        {
          items: orderItems,
          totalAmount,
          deliveryFee,
          tax,
          restaurantId,
          paymentMethod: 'credit_card',
          status: 'pending',
          paymentStatus: 'pending',
          deliveryAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Clear the cart after successful order
      clearCart();
      setSuccess(true);
      
      // Redirect to order confirmation page
      navigate('/order-confirmation', { state: { order: response.data } });
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Log cart items for debugging
  console.log('Cart items:', cart);

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          textAlign="center"
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 6,
            boxShadow: 1,
          }}
        >
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: 'text.primary',
        }}
      >
        Your Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cart.map((item) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 1,
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                  <Grid item xs={9} sm={4}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                          },
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        variant="h6"
                        sx={{
                          mx: 2,
                          minWidth: 40,
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: 'bold', mr: 2 }}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        onClick={() => removeFromCart(item._id)}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: theme.palette.error.light,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              position: 'sticky',
              top: 24,
              backgroundColor: 'background.paper',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${getCartTotal().toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="body1">Delivery Fee</Typography>
                <Typography variant="body1">$5.00</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="body1">Tax (10%)</Typography>
                <Typography variant="body1">
                  ${(getCartTotal() * 0.1).toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${(getCartTotal() + 5 + getCartTotal() * 0.1).toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePlaceOrder}
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
              {!user && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Please <Button color="primary" onClick={() => navigate('/login')}>login</Button> to place your order
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Order placed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Cart; 