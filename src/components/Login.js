// src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, error, clearError, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Login Component] Form submitted with email:', email);

    if (clearError) {
      clearError(); // Clear any previous errors
    }

    if (isRegistering) {
      // Registration process
      console.log('[Login Component] Initiating registration...');
      const result = await register({ email, password });
      
      if (result.success) {
        console.log('[Login Component] Registration successful');
        // Redirect or show success message
      } else {
        console.error('[Login Component] Registration failed:', result.error);
      }
    } else {
      // Login process
      console.log('[Login Component] Initiating login...');
      const result = await login(email, password);
      
      if (result.success) {
        console.log('[Login Component] Login successful');
        // Redirect to dashboard or previous page
      } else {
        console.error('[Login Component] Login failed:', result.error);
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    if (clearError) {
      clearError(); // Clear any errors when switching modes
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        
        <div className="toggle-mode">
          <button onClick={toggleMode}>
            {isRegistering 
              ? 'Already have an account? Login' 
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;