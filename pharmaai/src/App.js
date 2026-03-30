import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Register from './components/Register';
import { useState, useEffect } from 'react';

function App() {
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    // Get the public URL from environment variable
    const url = process.env.REACT_APP_PUBLIC_URL || '/';
    setPublicUrl(url);
  }, []);

  return (
    <AuthProvider>
      <Router basename={publicUrl}>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;