import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  // Log when a product card is rendered
  console.log('[ProductCard] Rendering product:', product.name);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Check if product is from openFDA (has no price or stock)
    if (product.isFromOpenFDA) {
      alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
      return;
    }
    
    addToCart(product);
    console.log('[ProductCard] Added to cart:', product.name);
  };

  const toggleDetails = () => {
    console.log('[ProductCard] Toggling details for:', product.name);
    setShowDetails(!showDetails);
  };

  // Handler for "List Your Own" button
  const handleListYourOwn = (e) => {
    e.stopPropagation();
    console.log('[ProductCard] List Your Own clicked for:', product.name);
    // This would open a modal or navigate to a form with pre-filled data
    // For now, we'll just trigger a custom event that parent components can listen to
    window.dispatchEvent(new CustomEvent('requestListProduct', { detail: product }));
  };

  return (
    <div className="product-card-professional" onClick={toggleDetails}>
      <div className="product-image-container">
        <img 
          src={product.image || '/placeholder-image.jpg'} 
          alt={product.name} 
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'; // fallback image
          }}
        />
      </div>
      <div className="product-info-professional">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-common-name">{product.commonName || 'Generic Name: N/A'}</p>
        <div className="product-meta">
          <p className="product-dosage">Dosage: {product.dosage || 'N/A'}</p>
          <p className="product-ndc">NDC: {product.ndc || 'N/A'}</p>
        </div>
        
        {product.isFromOpenFDA ? (
          <p className="price unavailable">Unavailable</p>
        ) : (
          <p className="price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
        )}
        
        {product.isFromOpenFDA && (
          <p className="fda-source-badge">FDA Source</p>
        )}
        {!product.isFromOpenFDA && product.userId && (
          <p className="owned-by-user">Your Listing</p>
        )}
      </div>
      
      <div className="card-buttons-professional">
        {product.isFromOpenFDA ? (
          <>
            <button 
              className="unavailable-btn-professional" 
              onClick={(e) => { 
                e.stopPropagation(); 
                console.log('[ProductCard] Unavailable button clicked for:', product.name);
                alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
              }}
            >
              Unavailable
            </button>
            <button 
              className="list-your-own-btn-professional"
              onClick={handleListYourOwn}
            >
              List Yours
            </button>
          </>
        ) : (
          <>
            <button onClick={handleAddToCart} className="add-to-cart-professional">
              Add to Cart
            </button>
            <button 
              className="list-your-own-btn-professional"
              onClick={handleListYourOwn}
            >
              List Yours
            </button>
          </>
        )}
      </div>
      
      {showDetails && (
        <div className="product-details-modal-professional" onClick={(e) => e.stopPropagation()}>
          <div className="product-details-content-professional">
            <span 
              className="close-btn-professional" 
              onClick={(e) => { 
                e.stopPropagation(); 
                console.log('[ProductCard] Closing details for:', product.name);
                setShowDetails(false); 
              }}
            >
              &times;
            </span>
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
            
            <div className="modal-buttons-professional">
              {product.isFromOpenFDA ? (
                <button 
                  className="add-to-cart-modal-professional unavailable" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    console.log('[ProductCard] Modal unavailable button clicked for:', product.name);
                    alert("This product is from FDA database and is not currently in stock. Please contact support for availability.");
                  }}
                >
                  Not Available
                </button>
              ) : (
                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }} className="add-to-cart-modal-professional">
                  Add to Cart
                </button>
              )}
              <button 
                className="list-your-own-modal-professional"
                onClick={handleListYourOwn}
              >
                List Yours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;