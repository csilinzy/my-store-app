import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <Router basename="/">
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