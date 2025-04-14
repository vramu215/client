import axios from 'axios';

// Test the API connection
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await axios.get('/api/food-items');
    console.log('API response:', response.data);
    console.log('API connection successful!');
    return response.data;
  } catch (error) {
    console.error('API connection failed:', error);
    console.error('Error details:', error.response || error.message);
    return null;
  }
};

export default testAPI; 