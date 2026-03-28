import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';
import './ProductList.css';
import { productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import the auth context

const ProductList = () => {
  const { user } = useAuth(); // Get user from auth context
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductForListing, setSelectedProductForListing] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for the requestListProduct event
  useEffect(() => {
    const handleRequestListProduct = (event) => {
      setSelectedProductForListing(event.detail);
      setShowAddForm(true);
    };

    window.addEventListener('requestListProduct', handleRequestListProduct);
    return () => {
      window.removeEventListener('requestListProduct', handleRequestListProduct);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      // Using the productAPI to fetch pharmaceutical products
      const response = await productAPI.getProducts();
      
      setProducts(response);
      setLoading(false);
    } catch (err) {
      console.error('[ProductList] Error fetching products:', err);
      setError(err.message);
      setLoading(false);
      
      // As a last resort, use static fallback if even mock data fails
      const fallbackProducts = [
        {
          id: 1,
          name: 'Lisinopril',
          price: 25.99,
          image: '/images/lisinopril.jpg',
          ndc: '12345-678-901',
          dosage: '10mg',
          commonName: 'Prinivil, Zestril',
          description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
          userId: null
        },
        {
          id: 2,
          name: 'Metformin',
          price: 19.99,
          image: '/images/metformin.jpg',
          ndc: '23456-789-012',
          dosage: '500mg',
          commonName: 'Glucophage',
          description: 'Used to treat type 2 diabetes by improving insulin sensitivity.',
          userId: null
        },
        {
          id: 3,
          name: 'Atorvastatin',
          price: 35.50,
          image: '/images/atorvastatin.jpg',
          ndc: '34567-890-123',
          dosage: '20mg',
          commonName: 'Lipitor',
          description: 'A statin medication used to lower cholesterol and prevent cardiovascular disease.',
          userId: null
        },
        {
          id: 4,
          name: 'Levothyroxine',
          price: 18.75,
          image: '/images/levothyroxine.jpg',
          ndc: '45678-901-234',
          dosage: '50mcg',
          commonName: 'Synthroid',
          description: 'Synthetic thyroid hormone used to treat hypothyroidism.',
          userId: null
        },
        {
          id: 5,
          name: 'Amlodipine',
          price: 22.30,
          image: '/images/amlodipine.jpg',
          ndc: '56789-012-345',
          dosage: '5mg',
          commonName: 'Norvasc',
          description: 'A calcium channel blocker used to treat high blood pressure and chest pain.',
          userId: null
        },
        {
          id: 6,
          name: 'Omeprazole',
          price: 28.99,
          image: '/images/omeprazole.jpg',
          ndc: '67890-123-456',
          dosage: '20mg',
          commonName: 'Prilosec',
          description: 'A proton pump inhibitor used to treat acid reflux and stomach ulcers.',
          userId: null
        },
        {
          id: 7,
          name: 'Viagra',
          price: 45.99,
          image: '/images/viagra.jpg',
          ndc: '78901-234-567',
          dosage: '50mg',
          commonName: 'Sildenafil',
          description: 'Used to treat erectile dysfunction and pulmonary arterial hypertension.',
          userId: null
        }
      ];
      
      setProducts(fallbackProducts);
      setLoading(false);
    }
  };

  // Update products when they change (in case new products are added)
  useEffect(() => {
    const updateProducts = async () => {
      try {
        const response = await productAPI.getProducts();
        setProducts(response);
      } catch (err) {
        console.error('[ProductList] Error updating products:', err);
      }
    };

    updateProducts();
  }, []);

  const handleProductAdded = (productData) => {
    // In a real implementation, this would add the product to the backend
    // For now, we'll just close the form and show a success message
    alert(`${productData.name} has been successfully listed!`);
    setShowAddForm(false);
    setSelectedProductForListing(null);
    
    // Refresh the product list
    fetchProducts();
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setSelectedProductForListing(null);
  };

  // Filter products based on search term (match name, commonName, NDC, or dosage)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.ndc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading pharmaceutical products...</div>;
  if (error) return <div className="error">Error: {error}. Showing demo data...</div>;

  return (
    <div className="product-list-container">
      <h2>Pharmaceutical Products</h2>
      {showAddForm ? (
        <div className="add-product-section">
          <button onClick={handleCloseForm} className="back-to-products-btn">Back to Products</button>
          <AddProductForm 
            initialProductData={selectedProductForListing} 
            onProductAdded={handleProductAdded} 
          />
        </div>
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, common name, NDC, or dosage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="add-product-spacer"></div>
          <div className="add-product-cta">
            <button 
              onClick={() => {
                setSelectedProductForListing(null);
                setShowAddForm(true);
              }}
              className="add-new-product-btn"
            >
              + Add New Product
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;