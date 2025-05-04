
import { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 
