// src/components/SearchBar.js
import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { productAPI } from '../utils/api';

// Global cache for openFDA results to enable partial matching
let cachedOpenFDAResults = [];

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

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = async (suggestion) => {
    // If the suggestion is from openFDA, add it to our mock inventory
    if (suggestion.isFromOpenFDA) {
      try {
        await productAPI.addProductFromOpenFDA(suggestion);
        console.log(`[SearchBar] Added ${suggestion.name} from openFDA to mock inventory`);
      } catch (error) {
        console.error('[SearchBar] Error adding product from openFDA to inventory:', error);
      }
    }
    
    setQuery(suggestion.name);
    setShowSuggestions(false);
    inputRef.current.focus(); // Keep focus on input after selection
  };

  // Handler for "List Your Own" button on search results
  const handleListYourOwn = (suggestion, e) => {
    e.stopPropagation(); // Prevent the suggestion click event
    // Trigger the custom event to open the form with the product data
    window.dispatchEvent(new CustomEvent('requestListProduct', { detail: suggestion }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.search-bar-component')) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="search-bar-component">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          id='Products'
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="Search medications..."
          className="search-input"
          autoComplete="off"
        />
        <button className="search-button">🔍</button>
        
        {(isLoading && query.trim() !== '') && (
          <div className="loading-indicator">Searching...</div>
        )}
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`suggestion-item ${index === activeSuggestion ? 'active' : ''}`}
              >
                <div className="suggestion-content">
                  <div className="suggestion-name">
                    {suggestion.name}
                    {suggestion.isFromOpenFDA && <span className="openfda-tag"> (from FDA)</span>}
                  </div>
                  <div className="suggestion-details">
                    <span className="suggestion-common">{suggestion.commonName}</span>
                    <span className="suggestion-dosage">{suggestion.dosage}</span>
                    <span className="suggestion-ndc">NDC: {suggestion.ndc}</span>
                    {suggestion.isFromOpenFDA && 
                     <span className="fda-stock">Stock: {suggestion.stock !== undefined ? suggestion.stock : '0'}</span>}
                  </div>
                </div>
                <div className="suggestion-actions">
                  <button 
                    className="list-your-own-suggestion"
                    onClick={(e) => handleListYourOwn(suggestion, e)}
                  >
                    List Your Own
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {showSuggestions && suggestions.length === 0 && !isLoading && query.trim() !== '' && (
          <div className="no-results">No results found for "{query}"</div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;