# My Store App - Technical Documentation

## Architecture Overview

The application follows a standard Create React App architecture with the following key patterns:

- **Component-based Architecture**: Modular components following separation of concerns
- **Context-based State Management**: React Context API for global state management
- **API Abstraction Layer**: Centralized API utility with modular service functions
- **External API Integration**: Integration with openFDA for comprehensive medication data with rate limiting and caching

## Component Design Patterns

### Component Responsibilities

According to the project specifications, each component has specific responsibilities:

- **Header**: Provides navigation, search integration, and cart summary
- **ProductCard**: Renders product information and handles "Add to Cart" interaction; shows detailed modal when clicked; includes "List Your Own" button for all products; displays unique product information in modal
- **ProductList**: Manages product listing state and renders product cards with enhanced search capability; handles the display of AddProductForm; uses AuthContext to access user information
- **AddProductForm**: Allows authenticated users to add products with OpenFDA auto-fill and required lot/expiration information; includes unique serial number and batch number fields; supports image upload; includes QR code scanning setup; utilizes Formik for form management and validation; accesses user ID via AuthContext
- **SearchBar**: Provides dynamic search functionality with autocomplete, loading states, and keyboard navigation
- **CartPage**: Displays cart contents and provides modification capabilities

### Data Flow Patterns

- **Unidirectional Data Flow**: Props flow down, events bubble up
- **Context State Management**: Global state managed through Context API
- **External API Integration**: Direct calls to external services for enhanced data with rate limiting and caching

## API Integration Details

### Internal API Service (`src/utils/api.js`)

The application uses a centralized API service that provides:

- Base configuration with configurable base URL
- Automatic JWT token injection for authenticated requests
- Request/response interceptors for authentication and logging
- Modular service functions organized by domain
- Rate limiting for external APIs
- Client-side caching with TTL
- Comprehensive logging for API calls

#### Authentication API Functions

Located in the `authAPI` object:
- `login(email, password)` - Authenticates user credentials
- `register(userData)` - Creates new user account
- `verifyToken(token)` - Validates JWT token validity
- `getUserProfile()` - Retrieves current user profile

#### Product API Functions

Located in the `productAPI` object:
- `getProducts()` - Retrieves all pharmaceutical products
- `getProductById(productId)` - Gets specific product by ID
- `getProductsByUserId(userId)` - Gets products owned by a specific user
- `searchProducts(searchTerm)` - Searches internal product database
- `searchProductsFromOpenFDA(searchTerm)` - Queries openFDA for medication data with rate limiting and caching, using a multi-field search across product NDC numbers, brand names and generic names
- `addProductToListingOrIncrementStock(productData, userId)` - Adds new product or increments stock count if product already exists, tagged with user ID for inventory tracking; includes unique bottle information like serial number and batch number

### External API Integration (openFDA)

The application integrates with the openFDA API to provide comprehensive medication information:

- Endpoint: `https://api.fda.gov/drug/label.json`
- Search parameters: `openfda.product_ndc`, `openfda.brand_name` and `openfda.generic_name`
- **Search Syntax**: The application uses the following multi-field search syntax: 
  `search=openfda.product_ndc:"TERM"+openfda.brand_name:"TERM"+openfda.generic_name:"TERM"`
  This allows searching across all three key pharmaceutical identifiers simultaneously
- Response transformation: Maps openFDA fields to internal product format
- Rate limiting: Client-side throttling to respect API limits (max 10 calls per minute)
- Caching: In-memory caching with 5-minute TTL to reduce redundant API calls
- Logging: Comprehensive logging of API calls for debugging and monitoring
- Error handling: Graceful degradation when API is unavailable

#### Rate Limiting Implementation

The application implements client-side rate limiting using a sliding window algorithm:
- Tracks timestamps of API calls in a queue
- Limits to 10 calls per minute
- Returns empty results when rate limit is exceeded
- Preserves API quota for better performance

#### Caching Implementation

Client-side caching is implemented with:
- In-memory Map for storing API responses
- Timestamp-based expiration (5-minute TTL)
- Cache key based on search term
- Automatic cleanup of expired entries

## Product Listing and Stock Management

The application implements a sophisticated product listing system that allows authenticated users to contribute to the inventory:

- **Duplicate Detection**: Products are identified by their NDC number to detect duplicates
- **Stock Incrementing**: When a product with an existing NDC is listed again, the stock count is incremented
- **Required Fields**: Listings require lot number, expiration date, and unique serial number for verification
- **Optional Fields**: Batch number entry for grouping related items
- **OpenFDA Integration**: Auto-fills product details from OpenFDA based on NDC lookup
- **Inventory Persistence**: New products are added to the mock inventory with initial stock
- **User Inventory Tracking**: Each product is tagged with the user ID to track inventory per user
- **Unique Identification**: Each bottle has a unique serial number for individual tracking
- **Image Upload Support**: Users can upload custom images for their listings
- **QR Code Capability**: Framework for QR code scanning to facilitate product uploads
- **Form Validation**: Robust validation using Formik to ensure data integrity

### Core Functions

The `addProductToListingOrIncrementStock` function in `src/utils/api.js` handles both:
1. Creating new product listings when an NDC doesn't exist in the inventory
2. Incrementing stock for existing products when the same NDC is listed again
3. Associating the product with the user ID for inventory tracking
4. Storing unique bottle information (serial number, batch number)

The `getProductsByUserId` function retrieves all products associated with a specific user.

### Form Management

The AddProductForm component utilizes Formik for:
- Form state management
- Field validation
- Error handling
- Submission handling
- Integration with OpenFDA search functionality
- Accessing user ID from AuthContext
- Supporting image upload and QR code scanning features

## State Management

### AuthContext (`src/context/AuthContext.js`)

Manages authentication state using React Context and useReducer:

- User session management
- JWT token storage and validation
- Login/logout functionality
- Protected route integration
- `useAuth` hook for accessing user data in components

### CartContext (`src/context/CartContext.js`)

Handles shopping cart functionality:

- Add/remove items
- Quantity updates
- Total calculation
- Cart persistence simulation

## Component Communication

### Prop Drilling vs Context

- Local state: Managed within individual components using `useState`
- Shared state: Managed via Context API (`useCart`, `useAuth`)
- Component communication: Passed through props for parent-child relationships

### Event Handling

- Click handlers for user interactions
- Form submissions with validation
- Keyboard navigation support in search
- Modal interactions for product details
- Custom events for cross-component communication (e.g., 'requestListProduct')

## Styling Approach

### CSS Organization

- Component-specific styles in dedicated CSS files
- Responsive design with mobile-first approach
- Consistent design language across components
- Semantic class names following BEM methodology

### Responsive Design

- Mobile breakpoints at 768px
- Flexible grid layouts for product displays
- Touch-friendly interface elements
- Adaptive search results display

## Error Handling

### Network Requests

- API request/response interceptors for error handling
- Graceful fallback to mock data when API fails
- User-friendly error messages
- Detailed logging for debugging

### User Input Validation

- Form validation in login/register components
- Search input sanitization
- Quantity constraints in cart operations
- Required field validation in product listing form using Formik

## Security Considerations

### Authentication Security

- JWT tokens stored in localStorage
- Automatic token injection for authenticated requests
- Secure token removal on logout
- Test user credential isolation

### Data Validation

- Input sanitization for search queries
- Sanitized data display to prevent XSS
- Secure API communication via HTTPS

## Performance Optimizations

### Rendering Efficiency

- Component memoization where appropriate
- Efficient list rendering with keys
- Conditional rendering to minimize DOM size

### Network Efficiency

- Debounced search API calls (300ms delay)
- Client-side caching for repeated requests
- Rate limiting to respect API quotas
- Efficient data fetching patterns
- Loading states to improve perceived performance

## Development Best Practices

### Code Organization

- Clear separation of concerns between components
- Consistent file naming and structure
- Well-documented functions and components
- Type consistency in data structures

### Logging Implementation

The application includes comprehensive logging for API calls:

- API request/response logging in interceptors
- openFDA API call logging with search terms
- Rate limiting event logging
- Cache hit/miss logging
- Error logging with stack traces