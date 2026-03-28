import React, { createContext, useContext, useReducer } from 'react';
import { authAPI } from '../utils/api';
import { validateTestCredentials, testUsers } from '../utils/testUsers'; // Import test users and validation

// Create the AuthContext
const AuthContext = createContext();

// Define initial state for authentication
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginAttempts: 0
};

// Auth reducer to handle different auth states
const authReducer = (state, action) => {
  console.log('[AuthContext] Reducer called with action:', action.type, 'payload:', action.payload);

  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        loginAttempts: 0
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload.error,
        loginAttempts: state.loginAttempts + 1
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };

    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user
      };

    default:
      return state;
  }
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (email, password) => {
    console.log('[AuthContext] Login attempt with email:', email);
    
    dispatch({ type: 'LOGIN_START' });

    // Check if this is a test user login
    const testUserValidation = validateTestCredentials(email, password);
    
    if (testUserValidation.isValid) {
      console.log('[AuthContext] Test user validation successful, creating mock token');
      
      // Create a mock token for test users (in real app, this would come from backend)
      const mockToken = `mock_token_${Date.now()}_${testUserValidation.user.id}`;
      
      // Save token to localStorage along with user info for later validation
      localStorage.setItem('token', mockToken);
      localStorage.setItem('testUserEmail', testUserValidation.user.email);
      localStorage.setItem('testUserEmailMatch', email); // Store original email for validation
      
      // Dispatch success action
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: testUserValidation.user,
          token: mockToken
        }
      });

      console.log('[AuthContext] Test user login successful');
      return { success: true, user: testUserValidation.user };
    }

    // For non-test users, use the API
    try {
      // Using the API utility for login
      const data = await authAPI.login(email, password);
      console.log('[AuthContext] Login successful, received data:', data);

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Dispatch success action
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('[AuthContext] Login error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: {
          error: errorMessage
        }
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    console.log('[AuthContext] Registration attempt with data:', userData);
    
    dispatch({ type: 'REGISTER_START' });

    try {
      const data = await authAPI.register(userData);
      console.log('[AuthContext] Registration successful, received data:', data);

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: data.user,
          token: data.token
        }
      });

      return { success: true, user: data.user };
    } catch (error) {
      console.error('[AuthContext] Registration error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: {
          error: errorMessage
        }
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    console.log('[AuthContext] Logout initiated');
    
    // Remove token and test user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('testUserEmail');
    localStorage.removeItem('testUserEmailMatch');
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    
    console.log('[AuthContext] User logged out successfully');
  };

  // Clear error function
  const clearError = () => {
    console.log('[AuthContext] Clearing error');
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update user function
  const updateUser = (userData) => {
    console.log('[AuthContext] Updating user data:', userData);
    
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        user: userData
      }
    });
  };

  // Check if user is authenticated based on token
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('testUserEmailMatch');
    console.log('[AuthContext] Checking auth status, token exists:', !!token);
    
    // Check if this is a test user token (starts with mock_token_) and email still matches
    if (token && token.startsWith('mock_token_') && savedEmail) {
      console.log('[AuthContext] Detected test user token, validating credentials...');
      
      // Look up the user in our test users
      let matchedUser = null;
      for (const userType in testUsers) {
        if (testUsers[userType].email === savedEmail) {
          matchedUser = testUsers[userType];
          break;
        }
      }
      
      if (matchedUser) {
        console.log('[AuthContext] Test user still valid, restoring session');
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: matchedUser,
            token: token
          }
        });
        
        return true;
      } else {
        console.log('[AuthContext] Test user no longer valid, clearing session');
        localStorage.removeItem('token');
        localStorage.removeItem('testUserEmail');
        localStorage.removeItem('testUserEmailMatch');
        return false;
      }
    }
    
    if (token && !token.startsWith('mock_token_')) {
      try {
        // Verify the token with the backend (only for non-test users)
        const userData = await authAPI.verifyToken(token);
        console.log('[AuthContext] Token verified, user data:', userData);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: userData,
            token: token
          }
        });
        
        return true;
      } catch (error) {
        console.error('[AuthContext] Token validation error:', error);
        localStorage.removeItem('token');
        return false;
      }
    }
    return false;
  };

  // Initialize auth status on app load
  React.useEffect(() => {
    console.log('[AuthContext] Initializing auth status');
    checkAuthStatus();
  }, []);

  // Return the context value
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('[AuthContext] useAuth hook called, returning context');
  return context;
};