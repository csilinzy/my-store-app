# My Store App - Pharmaceutical E-commerce Platform

## Product Listing Feature

Authenticated users can now list their own products using the "List Your Own" button on any product card. This feature:

- Auto-fills product information from OpenFDA based on NDC number
- Requires lot number and expiration date for verification
- Requires unique serial number for each bottle
- Allows optional batch number entry
- Supports image upload for product photos
- Includes QR code scanning capability (framework implemented)
- Increments stock count when the same product is listed again
- Allows pharmacies to contribute to the marketplace inventory
- Tags each product with the user ID to track inventory per user
- Utilizes Formik for reliable form validation and state management

## Product Listing and Stock Management

The application allows authenticated users to list their own products:

- Each product listing requires a unique NDC number, lot number, and expiration date
- Each bottle requires a unique serial number for identification
- Optional batch number entry for grouping related items
- If a product with the same NDC already exists, the system increments the stock count
- New products are added to the inventory with initial stock count
- The "List Your Own" button appears on all product cards for easy access
- Form validation handled by Formik for improved user experience
- Each product is tagged with the user ID to track inventory per user
- Support for uploading custom product images
- QR code scanning capability for easy product identification (framework in place)


## Project Overview

My Store App is a React-based e-commerce application designed specifically for the pharmaceutical industry. It enables pharmacies to purchase medications and healthcare products through a B2B wholesale platform. The application leverages modern React development practices and integrates with external data sources like openFDA for comprehensive medication information.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Components Overview](#components-overview)
- [External API Integration](#external-api-integration)
- [Dynamic Search Functionality](#dynamic-search-functionality)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- **Pharmaceutical-Focused Catalog**: Specialized product listings with NDC numbers, dosage information, and generic names
- **Advanced Search**: Search functionality powered by both internal database and openFDA API
- **Authentication System**: Complete login/registration flow with JWT token management
- **Shopping Cart**: Full-featured cart with quantity adjustments and checkout
- **Product Listing by Pharmacies**: Authenticated users can list their own products with lot numbers and expiration dates
- **OpenFDA Integration**: Access to comprehensive medication database with NDC numbers, dosages, and manufacturer details
- **Responsive Design**: Fully responsive interface for desktop and mobile users

## Technology Stack

- **Frontend**: React v19.2.4
- **Routing**: React Router v7.13.2
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Form Management**: Formik for robust form handling and validation
- **Build Tool**: Create React App (react-scripts v5.0.1)
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules and Custom Stylesheets

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-store-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure your settings:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

The application requires the following environment variables:

- `REACT_APP_API_URL`: The URL of the backend API server (default: http://localhost:5000/api)

Example `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects Create React App configuration (irreversible)

## Project Structure

```
my-store-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── CartPage.css
│   │   ├── CartPage.js
│   │   ├── Footer.css
│   │   ├── Footer.js
│   │   ├── Header.css
│   │   ├── Header.js
│   │   ├── Login.css
│   │   ├── Login.js
│   │   ├── ProductCard.js
│   │   ├── ProductCard.css
│   │   ├── ProductCard.css
│   │   ├── ProductList.css
│   │   ├── ProductList.js
│   │   ├── ProtectedRoute.js
│   │   ├── SearchBar.css
│   │   └── SearchBar.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── utils/
│   │   ├── api.js
│   │   └── testUsers.js
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── reportWebVitals.js
├── README.md
├── AuthReadMe.md
├── package.json
└── .gitignore
```

## API Integration

The application uses a centralized API utility ([src/utils/api.js](file:///c:/Users/csili/my-store-app/src/utils/api.js)) with:

- Base URL configuration via environment variables
- Automatic JWT token injection for authenticated requests
- Request/response interceptors for logging and error handling
- Modular API functions organized by domain (auth, products)
- Rate limiting and caching for external APIs
- Comprehensive logging for API calls

### Product API Endpoints

- `getProducts()`: Retrieve all pharmaceutical products
- `getProductById(productId)`: Get a specific product by ID
- `getProductsByUserId(userId)`: Get products owned by a specific user
- `searchProducts(searchTerm)`: Search products locally
- `searchProductsFromOpenFDA(searchTerm)`: Search medications in openFDA database with rate limiting and caching, using a multi-field search across product NDC numbers, brand names and generic names
- `addProductToListingOrIncrementStock(productData, userId)`: Add a new product or increment stock for existing products, tagged with user ID

## Dynamic Search Functionality

The application features a dynamic search system with the following characteristics:

- **Real-time Search**: Updates results as the user types with a 300ms debounce
- **Dual Source Search**: Queries both internal database and openFDA API simultaneously
- **Multi-field openFDA Search**: Searches across product NDC numbers, brand names, and generic names using the syntax `search=openfda.product_ndc:"TERM"+openfda.brand_name:"TERM"+openfda.generic_name:"TERM"`
- **Rate Limiting**: Limits external API calls to 10 per minute to respect API quotas
- **Caching**: Caches API responses for 5 minutes to reduce redundant calls
- **Loading States**: Visual indicators during search operations
- **Error Handling**: Graceful fallback when APIs are unavailable
- **Keyboard Navigation**: Arrow keys and Enter support for selecting results
- **Result Differentiation**: Clear indication of results from internal vs. external sources

## Authentication

The application implements a comprehensive authentication system with:

- Login and registration functionality
- JWT token management
- Protected routes
- Role-based access control
- Test user credentials for development

### Test User Credentials

For development purposes, you can use these test accounts:

- **Standard User**: test@example.com / TestPassword123!
- **Admin User**: admin@example.com / AdminPassword123!
- **Secondary User**: user2@example.com / UserPassword123!

## Components Overview

### Core Components

- **Header**: Navigation, search bar, cart summary, and user authentication controls
- **ProductList**: Displays all available pharmaceutical products in a grid layout with enhanced search capability
- **ProductCard**: Individual product display with image, name, price, NDC, dosage, and common name
- **SearchBar**: Advanced search with autocomplete functionality powered by internal data and openFDA with real-time feedback
- **CartPage**: Shopping cart management with quantity adjustments and checkout
- **Login**: Authentication interface supporting both login and registration
- **ProtectedRoute**: Route guard for authenticated-only pages

### Context Providers

- **AuthContext**: Manages user authentication state, login/logout functionality, and token handling
- **CartContext**: Handles shopping cart operations (add/remove items, update quantities)

## External API Integration

The application integrates with openFDA API to provide comprehensive medication information beyond the internal product catalog. When users search for medications:

1. The system first searches the internal product database
2. Then queries the openFDA API for additional medication data (with rate limiting and caching)
3. Combines both results to present a comprehensive list
4. Medications from openFDA are clearly marked and noted as unavailable for purchase

This ensures that even if a medication isn't in stock, users can still access detailed information about it.

## Testing

The application includes a comprehensive testing suite:

- Unit tests for individual components
- Integration tests for API interactions
- Authentication flow testing
- Cart functionality tests

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For additional documentation on the authentication system, see [AuthReadMe.md](./AuthReadMe.md).