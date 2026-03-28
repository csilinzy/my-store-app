# Pharmaceutical Features Documentation

## Overview

This document describes the pharmaceutical-specific features implemented in the My Store App, designed for a B2B pharmaceutical marketplace targeting pharmacies.

## Core Pharmaceutical Features

### Product Information Schema

Each pharmaceutical product in the system includes the following attributes:

- `id`: Unique identifier for the product
- `name`: Brand name of the medication
- `commonName`: Generic name of the medication
- `price`: Cost of the medication
- `image`: Product image URL
- `ndc`: National Drug Code number
- `dosage`: Dosage strength and form
- `manufacturer`: Manufacturing company
- `description`: Medication purpose and usage
- `stock`: Current inventory level
- `isFromOpenFDA`: Boolean flag indicating source

### NDC (National Drug Code) Integration

The system prominently displays the National Drug Code for each medication:

- Standardized identifier assigned to each medication
- Used for tracking and identification in the pharmaceutical industry
- Displayed on product cards and in search results
- Critical for pharmacy compliance and ordering accuracy

### Dosage Information

Medication dosage information is clearly presented:

- Strength (e.g., 10mg, 500mg)
- Form (e.g., tablet, capsule, liquid)
- Administration guidelines when available
- Helps pharmacists verify correct medication

### Common Name Display

Generic names are displayed alongside brand names:

- Allows comparison between brand and generic equivalents
- Facilitates substitution decisions
- Important for formulary compliance

## Search Functionality with openFDA Integration

### Dual Search System

The application implements a dual search approach:

1. **Internal Product Search**: Searches the local inventory database
2. **openFDA Integration**: Queries the openFDA API for comprehensive medication data

### openFDA API Integration

- Endpoint: `https://api.fda.gov/drug/label.json`
- Search parameters: Brand name and generic name
- Results include NDC numbers, dosage information, and manufacturer details
- Products from openFDA are marked distinctly in the UI

### Search Result Presentation

- Internal products appear first in search results
- openFDA products are labeled as "from FDA" 
- Availability is clearly indicated (internal products: in stock, openFDA: unavailable)
- All pharmaceutical details are displayed consistently

## Product Card Enhancements

### Detailed Information Display

Product cards now show:

- Brand name and common name
- Dosage information
- NDC number
- Manufacturer information
- Availability status
- Source indicator (internal vs. FDA)

### Modal Detail View

Clicking a product card reveals:

- Complete medication description
- Detailed dosage information
- Manufacturer details
- NDC number
- Interaction warnings for FDA-sourced products

## Cart Management for Pharmaceuticals

### Availability Checks

- Internal products can be added to cart normally
- FDA-sourced products show "Not Available" status
- Cart page filters out unavailable items
- Special notices for FDA-sourced products in cart

### Pharmaceutical Compliance

- Clear distinction between available and unavailable products
- Proper handling of prescription medication information
- Regulatory compliance indicators

## API Integration Details

### Internal Product API

The system maintains its own product database with inventory levels:

- `GET /pharma-products` - Retrieve all products
- `GET /pharma-products/{id}` - Get specific product
- `GET /pharma-products/search?q={query}` - Search products

### openFDA Integration

Implemented in [src/utils/api.js](file:///c:/Users/csili/my-store-app/src/utils/api.js) under `productAPI.searchProductsFromOpenFDA`:

- Uses multi-field search syntax: `search=openfda.product_ndc:"TERM"+openfda.brand_name:"TERM"+openfda.generic_name:"TERM"`
- Transforms openFDA response to internal format
- Handles API rate limits and errors gracefully
- Maps openFDA fields to internal schema
- Maintains consistent UI experience

## UI/UX Considerations

### Visual Indicators

- Clear badges for FDA-sourced products
- Different styling for available vs. unavailable items
- Consistent presentation of pharmaceutical information
- Intuitive interaction flows

### Responsive Design

- Optimized for various screen sizes
- Touch-friendly interface for mobile pharmacy use
- Clear typography for medication information

## Security and Compliance

### Data Handling

- Proper handling of pharmaceutical information
- Secure API communication
- Privacy considerations for medication data
- Compliance with healthcare industry standards

### Access Control

- Authentication required for purchasing
- Different access levels for various user types
- Audit trail for orders and searches

## Future Pharmaceutical Features

### Planned Enhancements

- Medication interaction checking
- Prescription tracking
- Regulatory compliance reporting
- Batch and lot number tracking
- Supply chain visibility
- Cold chain monitoring
- DEA-controlled substance handling

### Integration Opportunities

- Electronic prescribing systems
- Pharmacy management systems
- Insurance verification
- Prior authorization workflows
- Inventory management systems