import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantRegister from './pages/RestaurantRegister';
import RestaurantDashboard from './pages/RestaurantDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f43f5e',
      light: '#fb7185',
      dark: '#e11d48',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <div className="min-h-screen">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/restaurant/login" element={<RestaurantLogin />} />
                  <Route path="/restaurant/register" element={<RestaurantRegister />} />
                  <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
