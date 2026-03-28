// src/utils/api.js
import axios from 'axios';

// Cache for openFDA API responses
const openFDACache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

// Track API call times for rate limiting (max 10 calls per minute)
const apiCallTimes = [];

// Check if we've exceeded the rate limit
function isRateLimited() {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  // Remove calls older than 1 minute
  while (apiCallTimes.length > 0 && apiCallTimes[0] < oneMinuteAgo) {
    apiCallTimes.shift();
  }
  
  // Check if we've made more than 10 calls in the last minute
  return apiCallTimes.length >= 10;
}

// Function to generate a pharmaceutical-themed placeholder image URL
// This uses a service that generates themed placeholder images
function generatePlaceholderImage(name) {
  if (!name) return '/placeholder-image.jpg';
  
  // Create a URL-encoded version of the name for the placeholder service
  const encodedName = encodeURIComponent(name);
  // Using a placeholder service that creates themed images
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=250`;
}

// Base API instance with common configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Use env var or default
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    console.log('[API Utility] Request interceptor called for:', config.url);
    
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API Utility] Added authorization header to request');
    } else {
      console.log('[API Utility] No token found, proceeding without auth header');
    }
    
    return config;
  },
  (error) => {
    console.error('[API Utility] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    console.log('[API Utility] Successful response from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('[API Utility] Response error from:', error.config?.url, error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('[API Utility] 401 Unauthorized - removing token and redirecting to login');
      localStorage.removeItem('token');
      // Optionally trigger logout in context or redirect user
    }
    
    return Promise.reject(error);
  }
);

// Export the configured API instance
export default api;

// Convenience functions for auth endpoints
export const authAPI = {
  // Login function
  login: async (email, password) => {
    console.log('[API Utility] Calling login endpoint with email:', email);
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('[API Utility] Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API Utility] Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register function
  register: async (userData) => {
    console.log('[API Utility] Calling register endpoint with data:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('[API Utility] Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API Utility] Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify token function
  verifyToken: async (token) => {
    console.log('[API Utility] Calling verify token endpoint');
    try {
      const response = await api.get('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[API Utility] Token verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API Utility] Token verification error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user profile function
  getUserProfile: async () => {
    console.log('[API Utility] Calling get user profile endpoint');
    try {
      const response = await api.get('/auth/profile');
      console.log('[API Utility] User profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API Utility] Get user profile error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// Initialize mock pharmaceutical product data
let mockPharmaProducts = [
  {
    id: 1,
    name: 'Lisinopril',
    price: 25.99,
    image: generatePlaceholderImage('Lisinopril'),
    ndc: '12345-678-901',
    dosage: '10mg',
    commonName: 'Prinivil, Zestril',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
    userId: null, // Initially no user owns this product
    stock: 10 // Add initial stock for existing products
  },
  {
    id: 2,
    name: 'Metformin',
    price: 19.99,
    image: generatePlaceholderImage('Metformin'),
    ndc: '23456-789-012',
    dosage: '500mg',
    commonName: 'Glucophage',
    description: 'Used to treat type 2 diabetes by improving insulin sensitivity.',
    userId: null,
    stock: 15
  },
  {
    id: 3,
    name: 'Atorvastatin',
    price: 35.50,
    image: generatePlaceholderImage('Atorvastatin'),
    ndc: '34567-890-123',
    dosage: '20mg',
    commonName: 'Lipitor',
    description: 'A statin medication used to lower cholesterol and prevent cardiovascular disease.',
    userId: null,
    stock: 8
  },
  {
    id: 4,
    name: 'Levothyroxine',
    price: 18.75,
    image: generatePlaceholderImage('Levothyroxine'),
    ndc: '45678-901-234',
    dosage: '50mcg',
    commonName: 'Synthroid',
    description: 'Synthetic thyroid hormone used to treat hypothyroidism.',
    userId: null,
    stock: 12
  },
  {
    id: 5,
    name: 'Amlodipine',
    price: 22.30,
    image: generatePlaceholderImage('Amlodipine'),
    ndc: '56789-012-345',
    dosage: '5mg',
    commonName: 'Norvasc',
    description: 'A calcium channel blocker used to treat high blood pressure and chest pain.',
    userId: null,
    stock: 20
  },
  {
    id: 6,
    name: 'Omeprazole',
    price: 28.99,
    image: generatePlaceholderImage('Omeprazole'),
    ndc: '67890-123-456',
    dosage: '20mg',
    commonName: 'Prilosec',
    description: 'A proton pump inhibitor used to treat acid reflux and stomach ulcers.',
    userId: null,
    stock: 5
  },
  {
    id: 7,
    name: 'Viagra',
    price: 45.99,
    image: generatePlaceholderImage('Viagra'),
    ndc: '78901-234-567',
    dosage: '50mg',
    commonName: 'Sildenafil',
    description: 'Used to treat erectile dysfunction and pulmonary arterial hypertension.',
    userId: null,
    stock: 18
  }
];

// Helper function to generate unique IDs for new products
const generateUniqueId = () => {
  const maxId = Math.max(...mockPharmaProducts.map(p => p.id), 0);
  return maxId + 1;
};

// Convenience functions for product endpoints
export const productAPI = {
  // Get all pharmaceutical products
  getProducts: async () => {
    console.log('[API Utility] Calling get pharmaceutical products endpoint');
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now, replace with real API call when available
      return mockPharmaProducts;
    } catch (error) {
      console.error('[API Utility] Get pharmaceutical products error:', error);
      throw error;
    }
  },

  // Get a single pharmaceutical product by ID
  getProductById: async (productId) => {
    console.log(`[API Utility] Calling get pharmaceutical product by ID: ${productId}`);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the product with the given ID
      const product = mockPharmaProducts.find(p => p.id === productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      return product;
    } catch (error) {
      console.error('[API Utility] Get pharmaceutical product by ID error:', error);
      throw error;
    }
  },

  // Get products by user ID to show user's inventory
  getProductsByUserId: async (userId) => {
    console.log(`[API Utility] Calling get products for user ID: ${userId}`);
    try {
      // Filter products by user ID
      const userProducts = mockPharmaProducts.filter(p => p.userId === userId);
      return userProducts;
    } catch (error) {
      console.error('[API Utility] Get user products error:', error);
      throw error;
    }
  },

  // Search pharmaceutical products
  searchProducts: async (searchTerm) => {
    console.log(`[API Utility] Calling search pharmaceutical products endpoint with term: ${searchTerm}`);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (!searchTerm) {
        return mockPharmaProducts;
      }
      
      // Filter products based on search term across name, commonName, ndc, and dosage
      const filteredProducts = mockPharmaProducts.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ndc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dosage.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`[API Utility] Found ${filteredProducts.length} products matching "${searchTerm}"`);
      return filteredProducts;
    } catch (error) {
      console.error('[API Utility] Search pharmaceutical products error:', error);
      throw error;
    }
  },
  
  // Search products using openFDA API with rate limiting and caching
  searchProductsFromOpenFDA: async (searchTerm) => {
    console.log(`[API Utility] Calling openFDA API with term: ${searchTerm}`);
    
    if (!searchTerm) {
      console.log('[API Utility] Empty search term, returning empty array');
      return [];
    }
    
    // Create cache key
    const cacheKey = searchTerm.toLowerCase();
    const now = Date.now();
    
    // Check if we have a cached response that's still valid
    if (openFDACache.has(cacheKey)) {
      const cachedResponse = openFDACache.get(cacheKey);
      if (now - cachedResponse.timestamp < CACHE_TTL) {
        console.log('[API Utility] Returning cached openFDA response');
        return cachedResponse.data;
      } else {
        // Remove expired cache entry
        openFDACache.delete(cacheKey);
        console.log('[API Utility] Removed expired cache entry');
      }
    }
    
    // Check if we're rate limited
    if (isRateLimited()) {
      console.warn('[API Utility] Rate limit reached, skipping openFDA API call');
      // Return empty array when rate limited
      return [];
    }
    
    try {
      // Record this API call for rate limiting
      apiCallTimes.push(now);
      console.log(`[API Utility] Making openFDA API call #${apiCallTimes.length} for term: ${searchTerm}`);
      
      // openFDA API endpoint for drug information
      // Using the specification-compliant search syntax with product_ndc, brand_name and generic_name
      const openFDAApiUrl = `https://api.fda.gov/drug/label.json?search=openfda.product_ndc:"${encodeURIComponent(searchTerm)}"+openfda.brand_name:"${encodeURIComponent(searchTerm)}"+openfda.generic_name:"${encodeURIComponent(searchTerm)}"&limit=10`;
      
      console.log(`[API Utility] Fetching from openFDA: ${openFDAApiUrl}`);
      
      const response = await fetch(openFDAApiUrl);
      
      if (!response.ok) {
        console.error('[API Utility] openFDA API request failed:', response.status, response.statusText);
        throw new Error(`openFDA API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[API Utility] openFDA API returned ${data.results ? data.results.length : 0} results`);
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }
      
      // Transform openFDA data to our product format
      const transformedResults = data.results.map((result, index) => {
        // Extract relevant information from openFDA result
        const brandName = result.openfda?.brand_name?.[0] || 'Unknown Brand';
        const genericName = result.openfda?.generic_name?.[0] || 'Generic Name Not Available';
        const manufacturerName = result.openfda?.manufacturer_name?.[0] || 'Manufacturer Unknown';
        const ndcProductCode = result.openfda?.product_ndc?.[0] || 'NDC Not Available';
        const dosageForm = result.openfda?.dosage_and_administration?.[0] || 'Dosage Information Not Available';
        const purpose = result.purpose?.[0] || result.indications_and_usage?.[0]?.substring(0, 200) || 'Purpose not specified';
        
        // Try to get an image URL from openFDA if available, otherwise use themed placeholder
        let imageUrl = generatePlaceholderImage(brandName); // Default to themed placeholder
        
        // Some openFDA entries might have images in the spl_image_elements array
        if (result.spl_image_elements && Array.isArray(result.spl_image_elements) && result.spl_image_elements.length > 0) {
          // Use the first image from the SPL image elements if available
          imageUrl = result.spl_image_elements[0];
        }
        
        return {
          id: `fda-${searchTerm}-${index}`, // Use search term and index as ID to make it more unique
          name: brandName,
          commonName: genericName,
          manufacturer: manufacturerName,
          ndc: ndcProductCode,
          dosage: dosageForm.substring(0, 50) + (dosageForm.length > 50 ? '...' : ''), // Truncate dosage info
          description: purpose,
          price: 'N/A', // Price not available from openFDA
          image: imageUrl, // Use image from SPL if available, otherwise themed placeholder
          stock: 0, // No stock info from openFDA
          isFromOpenFDA: true, // Flag to identify openFDA sourced products
          source: "openfda" // Data source identifier as per spec
        };
      });
      
      // Cache the successful response
      openFDACache.set(cacheKey, {
        data: transformedResults,
        timestamp: now
      });
      
      console.log(`[API Utility] Cached ${transformedResults.length} openFDA results for term: ${searchTerm}`);
      return transformedResults;
    } catch (error) {
      console.error('[API Utility] Error querying openFDA API:', error);
      // Return empty array in case of error
      return [];
    }
  },
  
  // Search products using openFDA API with broader partial matching
  searchProductsFromOpenFDAWithPartial: async (searchTerm) => {
    console.log(`[API Utility] Calling openFDA API with partial term: ${searchTerm}`);
    
    if (!searchTerm) {
      console.log('[API Utility] Empty search term, returning empty array');
      return [];
    }
    
    // For partial matching, we'll try different approaches
    // First, check if we have this exact search cached
    const cacheKey = `partial_${searchTerm.toLowerCase()}`;
    const now = Date.now();
    
    if (openFDACache.has(cacheKey)) {
      const cachedResponse = openFDACache.get(cacheKey);
      if (now - cachedResponse.timestamp < CACHE_TTL) {
        console.log('[API Utility] Returning cached cached partial openFDA response');
        return cachedResponse.data;
      } else {
        // Remove expired cache entry
        openFDACache.delete(cacheKey);
        console.log('[API Utility] Removed expired partial cache entry');
      }
    }
    
    // Check if we're rate limited
    if (isRateLimited()) {
      console.warn('[API Utility] Rate limit reached, skipping openFDA API call');
      // Return empty array when rate limited
      return [];
    }
    
    try {
      // Record this API call for rate limiting
      apiCallTimes.push(now);
      console.log(`[API Utility] Making partial openFDA API call #${apiCallTimes.length} for term: ${searchTerm}`);
      
      // For partial matching, we'll use the wildcard operator in openFDA
      // The openFDA API supports wildcard searches with asterisk (*)
      // Using the specification-compliant search syntax with product_ndc, brand_name and generic_name wildcards
      const openFDAApiUrl = `https://api.fda.gov/drug/label.json?search=openfda.product_ndc:"${encodeURIComponent(searchTerm)}*"+openfda.brand_name:"${encodeURIComponent(searchTerm)}*"+openfda.generic_name:"${encodeURIComponent(searchTerm)}*"&limit=10`;
      
      console.log(`[API Utility] Fetching from openFDA with wildcard: ${openFDAApiUrl}`);
      
      const response = await fetch(openFDAApiUrl);
      
      if (!response.ok) {
        console.error('[API Utility] openFDA API request failed:', response.status, response.statusText);
        // Try with the alternative search combining all fields with wildcards
        const alternativeApiUrl = `https://api.fda.gov/drug/label.json?search=openfda.product_ndc:"${encodeURIComponent(searchTerm)}*"+openfda.brand_name:"${encodeURIComponent(searchTerm)}*"+openfda.generic_name:"${encodeURIComponent(searchTerm)}*"&limit=10`;
        console.log(`[API Utility] Trying alternative search: ${alternativeApiUrl}`);
        
        const altResponse = await fetch(alternativeApiUrl);
        if (!altResponse.ok) {
          console.error('[API Utility] Alternative openFDA API request also failed:', altResponse.status, altResponse.statusText);
          throw new Error(`openFDA API request failed: ${altResponse.status} ${altResponse.statusText}`);
        }
        
        const data = await altResponse.json();
        console.log(`[API Utility] Alternative openFDA API returned ${data.results ? data.results.length : 0} results`);
        
        if (!data.results || !Array.isArray(data.results)) {
          return [];
        }
        
        // Transform the data similar to the main search
        const transformedResults = data.results.map((result, index) => {
          const brandName = result.openfda?.brand_name?.[0] || 'Unknown Brand';
          const genericName = result.openfda?.generic_name?.[0] || 'Generic Name Not Available';
          const manufacturerName = result.openfda?.manufacturer_name?.[0] || 'Manufacturer Unknown';
          const ndcProductCode = result.openfda?.product_ndc?.[0] || 'NDC Not Available';
          const dosageForm = result.openfda?.dosage_and_administration?.[0] || 'Dosage Information Not Available';
          const purpose = result.purpose?.[0] || result.indications_and_usage?.[0]?.substring(0, 200) || 'Purpose not specified';
          
          // Try to get an image URL from openFDA if available, otherwise use themed placeholder
          let imageUrl = generatePlaceholderImage(brandName); // Default to themed placeholder
          
          // Some openFDA entries might have images in the spl_image_elements array
          if (result.spl_image_elements && Array.isArray(result.spl_image_elements) && result.spl_image_elements.length > 0) {
            // Use the first image from the SPL image elements if available
            imageUrl = result.spl_image_elements[0];
          }
          
          return {
            id: `fda-partial-${searchTerm}-${index}`,
            name: brandName,
            commonName: genericName,
            manufacturer: manufacturerName,
            ndc: ndcProductCode,
            dosage: dosageForm.substring(0, 50) + (dosageForm.length > 50 ? '...' : ''),
            description: purpose,
            price: 'N/A',
            image: imageUrl, // Use image from SPL if available, otherwise themed placeholder
            stock: 0,
            isFromOpenFDA: true,
            source: "openfda"
          };
        });
        
        // Cache the successful response
        openFDACache.set(cacheKey, {
          data: transformedResults,
          timestamp: now
        });
        
        console.log(`[API Utility] Cached ${transformedResults.length} partial openFDA results for term: ${searchTerm}`);
        return transformedResults;
      }
      
      const data = await response.json();
      console.log(`[API Utility] openFDA API returned ${data.results ? data.results.length : 0} results`);
      
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }
      
      // Transform openFDA data to our product format
      const transformedResults = data.results.map((result, index) => {
        // Extract relevant information from openFDA result
        const brandName = result.openfda?.brand_name?.[0] || 'Unknown Brand';
        const genericName = result.openfda?.generic_name?.[0] || 'Generic Name Not Available';
        const manufacturerName = result.openfda?.manufacturer_name?.[0] || 'Manufacturer Unknown';
        const ndcProductCode = result.openfda?.product_ndc?.[0] || 'NDC Not Available';
        const dosageForm = result.openfda?.dosage_and_administration?.[0] || 'Dosage Information Not Available';
        const purpose = result.purpose?.[0] || result.indications_and_usage?.[0]?.substring(0, 200) || 'Purpose not specified';
        
        // Try to get an image URL from openFDA if available, otherwise use themed placeholder
        let imageUrl = generatePlaceholderImage(brandName); // Default to themed placeholder
        
        // Some openFDA entries might have images in the spl_image_elements array
        if (result.spl_image_elements && Array.isArray(result.spl_image_elements) && result.spl_image_elements.length > 0) {
          // Use the first image from the SPL image elements if available
          imageUrl = result.spl_image_elements[0];
        }
        
        return {
          id: `fda-partial-${searchTerm}-${index}`, // Use search term and index as ID to make it more unique
          name: brandName,
          commonName: genericName,
          manufacturer: manufacturerName,
          ndc: ndcProductCode,
          dosage: dosageForm.substring(0, 50) + (dosageForm.length > 50 ? '...' : ''), // Truncate dosage info
          description: purpose,
          price: 'N/A', // Price not available from openFDA
          image: imageUrl, // Use image from SPL if available, otherwise themed placeholder
          stock: 0, // No stock info from openFDA
          isFromOpenFDA: true, // Flag to identify openFDA sourced products
          source: "openfda" // Data source identifier as per spec
        };
      });
      
      // Cache the successful response
      openFDACache.set(cacheKey, {
        data: transformedResults,
        timestamp: now
      });
      
      console.log(`[API Utility] Cached ${transformedResults.length} partial openFDA results for term: ${searchTerm}`);
      return transformedResults;
    } catch (error) {
      console.error('[API Utility] Error querying openFDA API for partial match:', error);
      // Return empty array in case of error
      return [];
    }
  },
  
  // Add a product from openFDA to our mock inventory
  addProductFromOpenFDA: async (openFDAProduct) => {
    console.log(`[API Utility] Adding product from openFDA to mock inventory: ${openFDAProduct.name}`);
    
    // Check if product already exists in mock inventory
    const existingProduct = mockPharmaProducts.find(p => 
      p.name.toLowerCase() === openFDAProduct.name.toLowerCase() ||
      p.ndc === openFDAProduct.ndc
    );
    
    if (existingProduct) {
      console.log(`[API Utility] Product already exists in inventory: ${openFDAProduct.name}`);
      return existingProduct;
    }
    
    // Generate a new ID for the product
    const newId = generateUniqueId();
    
    // Create a new product based on openFDA data with mock values
    const newProduct = {
      id: newId,
      name: openFDAProduct.name,
      commonName: openFDAProduct.commonName,
      manufacturer: openFDAProduct.manufacturer,
      ndc: openFDAProduct.ndc,
      dosage: openFDAProduct.dosage,
      description: openFDAProduct.description,
      price: openFDAProduct.price !== 'N/A' ? openFDAProduct.price : Math.floor(Math.random() * 100) + 10, // Use existing price if available
      image: openFDAProduct.image || generatePlaceholderImage(openFDAProduct.name), // Use image from openFDA if available, otherwise themed placeholder
      stock: openFDAProduct.stock || 1, // Use existing stock if available, default to 1
      isFromOpenFDA: true,
      source: "openfda"
    };
    
    // Add to mock inventory
    mockPharmaProducts.push(newProduct);
    
    console.log(`[API Utility] Added product to mock inventory with ID: ${newId}`);
    return newProduct;
  },
  
  // Increment stock for an existing product or add a new one if it doesn't exist
  addProductToListingOrIncrementStock: async (productData, userId) => {
    console.log(`[API Utility] Adding product to listing or incrementing stock: ${productData.name} for user: ${userId}`);
    
    // Look for an existing product with the same NDC
    const existingProductIndex = mockPharmaProducts.findIndex(p => 
      p.ndc === productData.ndc
    );
    
    if (existingProductIndex !== -1) {
      // Product exists, increment stock
      const existingProduct = mockPharmaProducts[existingProductIndex];
      
      // Update the existing product with new information (if provided) and increment stock
      mockPharmaProducts[existingProductIndex] = {
        ...existingProduct,
        stock: existingProduct.stock + 1, // Increment stock by 1 as specified
        userId: userId, // Assign to the user adding it
        // Update other fields if provided in productData
        price: productData.price || existingProduct.price,
        image: productData.image || existingProduct.image,
        manufacturer: productData.manufacturer || existingProduct.manufacturer,
        description: productData.description || existingProduct.description,
        // Add unique information for this listing
        lotNumber: productData.lotNumber,
        expirationDate: productData.expirationDate,
        serialNumber: productData.serialNumber,
        batchNumber: productData.batchNumber
      };
      
      console.log(`[API Utility] Incremented stock for existing product: ${productData.name}. New stock: ${mockPharmaProducts[existingProductIndex].stock}`);
      return mockPharmaProducts[existingProductIndex];
    } else {
      // Product doesn't exist, add it as a new product
      const newId = generateUniqueId();
      
      const newProduct = {
        id: newId,
        name: productData.name,
        commonName: productData.commonName,
        manufacturer: productData.manufacturer,
        ndc: productData.ndc,
        dosage: productData.dosage,
        description: productData.description,
        price: productData.price || Math.floor(Math.random() * 100) + 10, // Random price if not provided
        image: productData.image || generatePlaceholderImage(productData.name), // Use provided image or themed placeholder
        stock: productData.stock || 1, // Default to 1 if not specified
        userId: userId, // Tag the product with the user ID
        lotNumber: productData.lotNumber, // Add lot number
        expirationDate: productData.expirationDate, // Add expiration date
        serialNumber: productData.serialNumber, // Add serial number for unique identification
        batchNumber: productData.batchNumber, // Add batch number
        isFromOpenFDA: productData.isFromOpenFDA || false,
        source: productData.source || "manual_entry", // Mark as manually entered
        // Ensure new products are considered in stock
        isAvailable: true
      };
      
      mockPharmaProducts.push(newProduct);
      
      console.log(`[API Utility] Added new product to inventory with ID: ${newId} for user: ${userId}`);
      return newProduct;
    }
  }
};