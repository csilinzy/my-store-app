import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import the auth context
import './AddProductForm.css';

const AddProductForm = ({ onProductAdded, initialProductData = null }) => {
  const { user } = useAuth(); // Get user from auth context
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [qrScanEnabled, setQrScanEnabled] = useState(false); // For QR code scanning functionality
  const [imagePreview, setImagePreview] = useState(null); // Preview for uploaded image

  const handleSearchChange = async (e, setFieldValue) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      try {
        const results = await productAPI.searchProductsFromOpenFDA(value);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('[AddProductForm] Error searching OpenFDA:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectProduct = (product, setFieldValue) => {
    setFieldValue('name', product.name);
    setFieldValue('commonName', product.commonName);
    setFieldValue('manufacturer', product.manufacturer);
    setFieldValue('ndc', product.ndc);
    setFieldValue('dosage', product.dosage);
    setFieldValue('description', product.description);
    setFieldValue('price', product.price !== 'N/A' ? product.price : '');
    setFieldValue('stock', product.stock || 1);
    
    setSearchTerm(product.name);
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Handle image upload
  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      // Set the file for form submission
      setFieldValue('imageFile', file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle QR scan mode
  const toggleQrScan = () => {
    setQrScanEnabled(!qrScanEnabled);
  };

  // Initial form values
  const initialValues = {
    name: initialProductData?.name || '',
    commonName: initialProductData?.commonName || '',
    manufacturer: initialProductData?.manufacturer || '',
    ndc: initialProductData?.ndc || '',
    dosage: initialProductData?.dosage || '',
    description: initialProductData?.description || '',
    price: initialProductData?.price || '',
    lotNumber: '',
    expirationDate: '',
    serialNumber: '', // Unique identifier for each bottle
    batchNumber: '', // Batch information
    stock: initialProductData?.stock || 1,
    imageFile: null
  };

  // Validation schema
  const validate = values => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Product Name is required';
    }
    
    if (!values.ndc) {
      errors.ndc = 'NDC Number is required';
    }
    
    if (!values.lotNumber) {
      errors.lotNumber = 'Lot Number is required';
    }
    
    if (!values.expirationDate) {
      errors.expirationDate = 'Expiration Date is required';
    }
    
    if (!values.serialNumber) {
      errors.serialNumber = 'Serial Number is required (unique per bottle)';
    }
    
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Get the user ID from the auth context
      const userId = user?.id || 'anonymous'; // Use anonymous if no user is logged in
      
      // Prepare form data
      const formData = new FormData();
      
      // Add all form values to the FormData object
      Object.keys(values).forEach(key => {
        if (key !== 'imageFile' && values[key]) {
          formData.append(key, values[key]);
        }
      });
      
      // Add the image file if provided
      if (values.imageFile) {
        formData.append('image', values.imageFile);
      }
      
      // Create product object with unique batch information
      const productToAdd = {
        ...values,
        price: parseFloat(values.price) || 0,
        stock: parseInt(values.stock) || 1,
        userId: userId, // Attach user ID to track inventory
        uniqueIdentifier: `${values.lotNumber}-${values.serialNumber}`, // Unique ID for this specific bottle
        // We'll handle image upload differently since we're using a mock API
        image: values.imageFile ? URL.createObjectURL(values.imageFile) : (initialProductData?.image || null)
      };

      // Use the new API function to add the product or increment stock, passing userId
      const result = await productAPI.addProductToListingOrIncrementStock(productToAdd, userId);
      
      // Notify parent component
      onProductAdded && onProductAdded(result);
      
      // Reset form
      resetForm();
      setSearchTerm('');
      setSearchResults([]);
      setShowSearchResults(false);
      setImagePreview(null);
    } catch (error) {
      console.error('[AddProductForm] Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-form-container">
      <h2>{initialProductData ? "List Your Own Product" : "Add New Product"}</h2>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="add-product-form">
            <div className="form-group">
              <label htmlFor="searchInput">Search Product (Auto-fill from OpenFDA):</label>
              <div className="search-container">
                <Field
                  type="text"
                  id="searchInput"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e, setFieldValue)}
                  placeholder="Type at least 2 characters to search OpenFDA..."
                  className="search-input"
                />
                {showSearchResults && searchResults.length > 0 && (
                  <ul className="search-results-list">
                    {searchResults.map((result) => (
                      <li 
                        key={result.id} 
                        onClick={() => handleSelectProduct(result, setFieldValue)}
                        className="search-result-item"
                      >
                        <div className="result-name">{result.name}</div>
                        <div className="result-details">
                          <span className="result-common">{result.commonName}</span>
                          <span className="result-ndc">NDC: {result.ndc}</span>
                          <span className="result-dosage">{result.dosage}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {showSearchResults && searchResults.length === 0 && (
                  <div className="no-results">No products found</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="name">Product Name *</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Product Name"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="commonName">Common/Generic Name</label>
                <Field
                  type="text"
                  id="commonName"
                  name="commonName"
                  placeholder="Common Name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="manufacturer">Manufacturer</label>
                <Field
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  placeholder="Manufacturer"
                />
              </div>
              <div className="form-group half-width">
                <label htmlFor="ndc">NDC Number *</label>
                <Field
                  type="text"
                  id="ndc"
                  name="ndc"
                  placeholder="NDC Number"
                />
                <ErrorMessage name="ndc" component="div" className="error-message" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="dosage">Dosage</label>
                <Field
                  type="text"
                  id="dosage"
                  name="dosage"
                  placeholder="Dosage"
                />
              </div>
              <div className="form-group half-width">
                <label htmlFor="price">Price ($)</label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Product description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="lotNumber">Lot Number *</label>
                <Field
                  type="text"
                  id="lotNumber"
                  name="lotNumber"
                  placeholder="Lot Number"
                />
                <ErrorMessage name="lotNumber" component="div" className="error-message" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="expirationDate">Expiration Date *</label>
                <Field
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                />
                <ErrorMessage name="expirationDate" component="div" className="error-message" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="serialNumber">Serial Number (per bottle) *</label>
                <Field
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="Unique serial for this bottle"
                />
                <ErrorMessage name="serialNumber" component="div" className="error-message" />
              </div>
              <div className="form-group half-width">
                <label htmlFor="batchNumber">Batch Number</label>
                <Field
                  type="text"
                  id="batchNumber"
                  name="batchNumber"
                  placeholder="Batch Number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="stock">Initial Stock Count</label>
                <Field
                  type="number"
                  id="stock"
                  name="stock"
                  min="1"
                />
              </div>
              <div className="form-group half-width">
                <label>Product Image</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                  />
                  <button 
                    type="button" 
                    className="qr-scan-btn"
                    onClick={toggleQrScan}
                  >
                    {qrScanEnabled ? 'Disable QR Scan' : 'Enable QR Scan'}
                  </button>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {qrScanEnabled && (
                  <div className="qr-scan-placeholder">
                    <p>QR Scanner would appear here in a real implementation</p>
                    <p>Scan to upload product image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Adding...' : (initialProductData ? 'List Product' : 'Add Product')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProductForm;