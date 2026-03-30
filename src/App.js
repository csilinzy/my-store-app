import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Header from './components/Header';
import Homepage from './components/Homepage';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CartPage from './components/CartPage'; 
import Login from './components/Login'; // Import Login component
import About from './components/About'; // Import About component
import Resources from './components/Resources'; // Import Resources component

function App() {
  // Use the environment variable for basename as per project specifications
  const basename = process.env.REACT_APP_PUBLIC_URL || '/';

  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <CartProvider>
        <Router basename={basename}>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/resources" element={<Resources />} />
                
                {/* Placeholder routes for additional pages */}
                <Route path="/suppliers" element={<Homepage />} />
                <Route path="/support" element={<Homepage />} />
                
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