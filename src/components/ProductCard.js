import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css'; // New CSS file for ProductCard

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    // Check if product is from openFDA (has no price or stock)
    if (product.isFromOpenFDA) {
      alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
      return;
    }
    
    addToCart(product);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Handler for "List Your Own" button
  const handleListYourOwn = (e) => {
    e.stopPropagation();
    // This would open a modal or navigate to a form with pre-filled data
    // For now, we'll just trigger a custom event that parent components can listen to
    window.dispatchEvent(new CustomEvent('requestListProduct', { detail: product }));
  };

  return (
    <div className="product-card" onClick={toggleDetails}>
      <img src={product.image || '/placeholder-image.jpg'} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="common-name">{product.commonName ? `Also known as: ${product.commonName}` : ''}</p>
        <p className="dosage">{product.dosage ? `Dosage: ${product.dosage}` : ''}</p>
        <p className="ndc">NDC: {product.ndc || 'N/A'}</p>
        {product.isFromOpenFDA ? (
          <p className="price unavailable">Currently Unavailable</p>
        ) : (
          <p className="price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
        )}
        {product.isFromOpenFDA && (
          <p className="fda-source-badge">From FDA Database</p>
        )}
        {!product.isFromOpenFDA && product.userId && (
          <p className="owned-by-user">Listed by you</p>
        )}
      </div>
      
      {showDetails && (
        <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="product-details-content">
            <span className="close-btn" onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}>&times;</span>
            <h3>{product.name}</h3>
            <p><strong>Common Name:</strong> {product.commonName || 'N/A'}</p>
            <p><strong>Dosage:</strong> {product.dosage || 'N/A'}</p>
            <p><strong>NDC Number:</strong> {product.ndc || 'N/A'}</p>
            <p><strong>Manufacturer:</strong> {product.manufacturer || 'N/A'}</p>
            <p><strong>Price:</strong> {product.isFromOpenFDA ? 'Not in stock' : 
              (typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price)}</p>
            <p><strong>Description:</strong> {product.description || 'No description available.'}</p>
            
            {/* Show unique product information */}
            {product.lotNumber && <p><strong>Lot Number:</strong> {product.lotNumber}</p>}
            {product.expirationDate && <p><strong>Expiration Date:</strong> {new Date(product.expirationDate).toLocaleDateString()}</p>}
            {product.serialNumber && <p><strong>Serial Number:</strong> {product.serialNumber}</p>}
            {product.batchNumber && <p><strong>Batch Number:</strong> {product.batchNumber}</p>}
            
            <div className="modal-buttons">
              {product.isFromOpenFDA ? (
                <button 
                  className="add-to-cart-modal unavailable" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
                  }}
                >
                  Not Available
                </button>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(); }} className="add-to-cart-modal">
                  Add to Cart
                </button>
              )}
              <button 
                className="list-your-own-modal"
                onClick={handleListYourOwn}
              >
                List Your Own
              </button>
            </div>
          </div>
        </div>
      )}
      
      {product.isFromOpenFDA ? (
        <div className="card-buttons">
          <button 
            className="unavailable-btn" 
            onClick={(e) => { 
              e.stopPropagation(); 
              alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
            }}
          >
            Not Available
          </button>
          <button 
            className="list-your-own-btn"
            onClick={handleListYourOwn}
          >
            List Your Own
          </button>
        </div>
      ) : (
        <div className="card-buttons">
          <button onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}>Add to Cart</button>
          <button 
            className="list-your-own-btn"
            onClick={handleListYourOwn}
          >
            List Your Own
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;