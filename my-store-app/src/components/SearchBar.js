const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // Search for products when query changes
  useEffect(() => {
    if (query.trim() !== '') {
      setIsLoading(true);
      const timer = setTimeout(async () => {
        try {
          // First try to search in our own product database
          let ourProducts = [];
          try {
            ourProducts = await productAPI.searchProducts(query);
          } catch (error) {
            console.error('[SearchBar] Error searching our products:', error);
          }
          
          // Search in openFDA if we have a substantial query
          let openFDAResults = [];
          
          // Make API call to openFDA for partial matches, regardless of length
          if (query.length >= 1) {  // Now search with just 1 character
            try {
              // Use the new partial matching search method
              const newOpenFDAResults = await productAPI.searchProductsFromOpenFDAWithPartial(query);
              
              // Update the cache with new results
              // Remove duplicates based on ID
              const uniqueNewResults = newOpenFDAResults.filter(newItem => 
                !cachedOpenFDAResults.some(cachedItem => cachedItem.id === newItem.id)
              );
              
              cachedOpenFDAResults = [...cachedOpenFDAResults, ...uniqueNewResults];
              
              openFDAResults = newOpenFDAResults;
            } catch (error) {
              console.error('[SearchBar] Error searching openFDA:', error);
              
              // Try searching in cached results even if API call fails
              openFDAResults = cachedOpenFDAResults.filter(item => 
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.commonName.toLowerCase().includes(query.toLowerCase()) ||
                item.ndc.toLowerCase().includes(query.toLowerCase()) ||
                item.dosage.toLowerCase().includes(query.toLowerCase())
              );
            }
          }
          
          // Combine results: our products first, then openFDA results
          const combinedResults = [...ourProducts, ...openFDAResults];
          
          setSuggestions(combinedResults.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
          setActiveSuggestion(-1); // Reset active suggestion
        } catch (error) {
          console.error('[SearchBar] Error searching products:', error);
          // Fallback to basic filtering if API fails
          const fallbackResults = [
            { id: 1, name: 'Lisinopril', commonName: 'Prinivil, Zestril', ndc: '12345-678-901', dosage: '10mg' },
            { id: 2, name: 'Metformin', commonName: 'Glucophage', ndc: '23456-789-012', dosage: '500mg' },
            { id: 3, name: 'Atorvastatin', commonName: 'Lipitor', ndc: '34567-890-123', dosage: '20mg' },
            { id: 4, name: 'Levothyroxine', commonName: 'Synthroid', ndc: '45678-901-234', dosage: '50mcg' },
            { id: 5, name: 'Amlodipine', commonName: 'Norvasc', ndc: '56789-012-345', dosage: '5mg' },
            { id: 6, name: 'Omeprazole', commonName: 'Prilosec', ndc: '67890-123-456', dosage: '20mg' },
            { id: 7, name: 'Viagra', commonName: 'Sildenafil', ndc: '78901-234-567', dosage: '50mg' },
            { id: 8, name: 'Simvastatin', commonName: 'Zocor', ndc: '78901-234-567', dosage: '20mg' }
          ].filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.commonName.toLowerCase().includes(query.toLowerCase()) ||
            item.ndc.toLowerCase().includes(query.toLowerCase()) ||
            item.dosage.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 8);
          
          setSuggestions(fallbackResults);
          setShowSuggestions(true);
          setActiveSuggestion(-1);
        } finally {
          setIsLoading(false);
        }
      }, 300); // Debounce search by 300ms

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }, [query]);