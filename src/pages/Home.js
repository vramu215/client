import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import testAPI from '../test-api';
import testDirectAPI from '../test-direct';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';

function Home() {
  const theme = useTheme();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching food items...');
      
      // First try the direct API connection
      const directResult = await testDirectAPI();
      if (directResult && Array.isArray(directResult)) {
        console.log('Using direct API result:', directResult);
        setFoodItems(directResult);
        setLoading(false);
        return;
      }
      
      // If direct connection fails, try the proxy
      console.log('Direct API failed, trying proxy...');
      const testResult = await testAPI();
      if (testResult && Array.isArray(testResult)) {
        console.log('Using test API result:', testResult);
        setFoodItems(testResult);
        setLoading(false);
        return;
      }
      
      // If both direct and test API fail, try the regular API call
      console.log('Both direct and test API failed, trying regular API call...');
      const response = await axios.get('/api/food-items', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Regular API call successful:', response.data);
        setFoodItems(response.data);
        setLoading(false);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Error fetching food items:', err);
      let errorMessage = 'Failed to fetch food items. ';
      
      if (err.response) {
        errorMessage += `Server responded with status ${err.response.status}`;
      } else if (err.request) {
        errorMessage += 'No response received from server. Please check if the server is running.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchFoodItems();
  };

  // Get unique categories from food items
  const categories = ['all', ...new Set(foodItems.map(item => item.category || 'main'))];

  // Filter food items based on selected category and search term
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading food items...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            If the problem persists, please check:
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ listStyle: 'none', pl: 0 }}>
            <li>• The server is running on port 3001</li>
            <li>• Your internet connection is stable</li>
            <li>• The API endpoints are accessible</li>
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4,
          color: 'text.primary',
        }}
      >
        Discover Delicious Food
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  onClick={() => setSelectedCategory(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {filteredItems.length === 0 ? (
        <Box 
          textAlign="center" 
          py={6}
          sx={{ 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No food items found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1} sx={{ maxWidth: '900px', margin: '0 auto' }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 1 }}>
                  <Typography gutterBottom variant="subtitle2" component="h2" noWrap>
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 0.5,
                      fontSize: '0.7rem'
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="caption" color="primary" fontWeight="bold">
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CartIcon sx={{ fontSize: '0.8rem' }} />}
                      onClick={() => addToCart(item)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                        py: 0.25,
                        px: 0.75,
                        fontSize: '0.7rem',
                        minWidth: 'auto'
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Home; 