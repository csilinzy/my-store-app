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
      const product = mockPharmaProducts.find(p => p.id == productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      return product;
    } catch (error) {
      console.error('[API Utility] Get pharmaceutical product by ID error:', error);
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