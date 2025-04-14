import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Divider,
  Grid,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

function OrderConfirmation() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have order data in the location state
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
    } else {
      // If no order data is available, redirect to home page
      navigate('/');
    }
  }, [location.state, navigate]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon
            sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Thank you for your order. We'll notify you when it's ready.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography variant="body1">
                Order ID: {order._id}
              </Typography>
              <Typography variant="body1">
                Restaurant: {order.restaurantId?.name || 'Unknown Restaurant'}
              </Typography>
              <Typography variant="body1">
                Total Amount: ${order.totalAmount?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="body1">
                Estimated Delivery: {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleTimeString() : 'Calculating...'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              {order.items?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">
                    {item.quantity}x {item.name}
                  </Typography>
                  <Typography variant="body1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<RestaurantIcon />}
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Continue Ordering
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ShippingIcon />}
            onClick={() => navigate('/orders')}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Track Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default OrderConfirmation; 