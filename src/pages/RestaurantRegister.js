import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
} from '@mui/material';

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    cuisine: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasError = false;

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.cuisine) {
      errors.cuisine = 'Please select a cuisine type';
      hasError = true;
    }

    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(formData.address.zipCode)) {
      errors['address.zipCode'] = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      hasError = true;
    }

    if (formData.description.length < 50) {
      errors.description = 'Description must be at least 50 characters long';
      hasError = true;
    }

    setFieldErrors(errors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/restaurant/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        cuisine: formData.cuisine,
        description: formData.description,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('restaurant', JSON.stringify(response.data.restaurant));
      navigate('/restaurant/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Restaurant Registration
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Cuisine Type"
                  name="cuisine"
                  select
                  value={formData.cuisine}
                  onChange={handleChange}
                  error={!!fieldErrors.cuisine}
                  helperText={fieldErrors.cuisine || "Select your restaurant's cuisine type"}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Select Cuisine</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Thai">Thai</option>
                  <option value="American">American</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ZIP Code"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  error={!!fieldErrors['address.zipCode']}
                  helperText={fieldErrors['address.zipCode'] || "Enter a valid ZIP code (e.g., 12345 or 12345-6789)"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="address.country"
                  value={formData.address.country}
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
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!fieldErrors.description}
                  helperText={fieldErrors.description || "Description must be at least 50 characters long"}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Restaurant'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RestaurantRegister; 