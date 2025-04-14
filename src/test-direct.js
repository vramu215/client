import axios from 'axios';

// Test the API connection directly
const testDirectAPI = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Testing direct API connection (attempt ${attempt}/${retries})...`);
      const response = await axios.get('http://localhost:3001/api/food-items', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 15000 // Increased from 5000 to 15000
      });
      
      if (response.data && Array.isArray(response.data)) {
        console.log('Direct API connection successful!');
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`Direct API connection failed (attempt ${attempt}/${retries}):`, error);
      
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      if (attempt === retries) {
        return null;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
};

export default testDirectAPI; 