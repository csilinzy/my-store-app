// src/__tests__/auth.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';

// Mock component to test the useAuth hook
const TestComponent = () => {
  const auth = useAuth();
  return <div>Is Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</div>;
};

describe('Authentication System', () => {
  test('should provide auth context to child components', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText(/Is Authenticated:/)).toBeInTheDocument();
  });

  test('should render login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Email:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('should toggle between login and register modes', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Initially should show login
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    
    // Toggle to register
    const toggleButton = screen.getByRole('button', { name: /Don't have an account\? Register/i });
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });
  });
});