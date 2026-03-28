import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Header from './components/Header';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CartPage from './components/CartPage'; 
import Login from './components/Login'; // Import Login component

function App() {
  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} /> {/* Reuse login component with toggle */}
                
                {/* Example of a protected route */}
                {/* <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } /> */}
            
                
                {/* Add other routes */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;