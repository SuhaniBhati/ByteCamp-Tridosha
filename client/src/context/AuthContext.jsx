import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token or fetch user profile
          // const res = await api.get('/auth/me');
          // setUser(res.data.user);
          setUser({ email: 'user@example.com' }); // Mock for now until backend is tied in
        } catch (err) {
          console.error("Auth check failed", err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    // Example: const res = await api.post('/auth/login', credentials);
    // localStorage.setItem('token', res.data.token);
    // setUser(res.data.user);
    if(credentials.email) {
       localStorage.setItem('token', 'fake-jwt-token-123');
       setUser({ email: credentials.email });
    }
    return true; // Return success status
  };

  const register = async (userData) => {
    // Example: const res = await api.post('/auth/register', userData);
    // localStorage.setItem('token', res.data.token);
    // setUser(res.data.user);
    if(userData.email) {
       localStorage.setItem('token', 'fake-jwt-token-123');
       setUser({ email: userData.email, name: userData.name });
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
