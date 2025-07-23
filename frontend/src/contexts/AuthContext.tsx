import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Supervisor' | 'Contractor' | 'County Officer';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: 'Supervisor' | 'Contractor' | 'County Officer';
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (replace with real backend later)
const MOCK_USERS: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'admin@cleankili.org',
    role: 'Supervisor',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'contractor@cleankili.org',
    role: 'Contractor',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock password storage (in real app, this would be hashed in backend)
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@cleankili.org': 'admin123',
  'contractor@cleankili.org': 'contractor123'
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('cleankili_admin_user');
      const storedToken = localStorage.getItem('cleankili_admin_token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('cleankili_admin_user');
          localStorage.removeItem('cleankili_admin_token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user by email
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, message: 'Invalid email or password' };
      }
      
      // Check password
      const storedPassword = MOCK_PASSWORDS[foundUser.email];
      if (password !== storedPassword) {
        setIsLoading(false);
        return { success: false, message: 'Invalid email or password' };
      }
      
      // Generate mock JWT token (in real app, this comes from backend)
      const mockToken = `jwt_token_${foundUser.id}_${Date.now()}`;
      
      // Store user and token
      localStorage.setItem('cleankili_admin_user', JSON.stringify(foundUser));
      localStorage.setItem('cleankili_admin_token', mockToken);
      
      setUser(foundUser);
      setIsLoading(false);
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        setIsLoading(false);
        return { success: false, message: 'An account with this email already exists' };
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      };
      
      // Add to mock database
      MOCK_USERS.push(newUser);
      MOCK_PASSWORDS[userData.email] = userData.password;
      
      // Generate mock JWT token
      const mockToken = `jwt_token_${newUser.id}_${Date.now()}`;
      
      // Store user and token
      localStorage.setItem('cleankili_admin_user', JSON.stringify(newUser));
      localStorage.setItem('cleankili_admin_token', mockToken);
      
      setUser(newUser);
      setIsLoading(false);
      
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cleankili_admin_user');
    localStorage.removeItem('cleankili_admin_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
