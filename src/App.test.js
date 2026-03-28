import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Test that the app renders with authentication context
test('renders app with authentication context', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Check if header elements are present
  expect(screen.getByText(/My Store/i)).toBeInTheDocument();
  
  // Check if navigation links are present
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Products/i)).toBeInTheDocument();
  
  // Check if cart link is present
  expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  
  // Check if account/login link is present
  expect(screen.getByText(/Account/i)).toBeInTheDocument();
});

// Test that routes are working
test('displays products route', () => {
  // This would require more advanced routing tests with Memory Router
  // For now we're just verifying the app renders properly
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/My Store/i)).toBeInTheDocument();
});