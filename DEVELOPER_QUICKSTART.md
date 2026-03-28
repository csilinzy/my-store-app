# Developer Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- npm package manager
- Git version control system

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-store-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the Application
```bash
npm start
```
The application will start on http://localhost:3000 (or another available port)

## Key Commands

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # React components
│   ├── ProductCard.js   # Product display with pharmaceutical details
│   ├── ProductList.js   # Product listing page
│   ├── SearchBar.js     # Search with openFDA integration
│   ├── CartPage.js      # Shopping cart
│   └── ...              # Other UI components
├── context/             # React Context providers
│   ├── AuthContext.js   # Authentication state
│   └── CartContext.js   # Shopping cart state
├── utils/               # Utility functions
│   └── api.js           # API utilities and openFDA integration
└── App.js               # Main application component
```

## Key Features to Understand

### 1. Pharmaceutical Data Schema
Products include these key fields:
- `name` - Brand name
- `commonName` - Generic name
- `ndc` - National Drug Code
- `dosage` - Medication strength/form
- `manufacturer` - Producing company
- `isFromOpenFDA` - Source indicator

### 2. Search with openFDA
The search functionality combines:
- Internal product database
- openFDA API for broader medication coverage
- Results are merged and displayed together

### 3. Authentication System
Uses React Context with test users:
- `test@example.com` / `TestPassword123!`
- `admin@example.com` / `AdminPassword123!`
- `user2@example.com` / `UserPassword123!`

### 4. Cart Behavior
- Internal products: Available for purchase
- openFDA products: Display-only (not in inventory)

## Common Development Tasks

### Adding a New Component
1. Create component in `src/components/`
2. Add corresponding CSS file if needed
3. Import and use in parent component

### Modifying API Calls
1. Update `src/utils/api.js` with new endpoints
2. Add functions to appropriate API group (authAPI, productAPI)
3. Test with mock data first

### Updating Pharmaceutical Data Display
1. Modify the data structure in API responses
2. Update components to render new fields
3. Update CSS for proper display

### Working with openFDA Integration
1. Review `searchProductsFromOpenFDA` function in `api.js`
2. Note the multi-field search syntax: `search=openfda.product_ndc:"TERM"+openfda.brand_name:"TERM"+openfda.generic_name:"TERM"`
3. Ensure proper error handling for API limits
4. Maintain consistent data structure with internal products

## Troubleshooting

### API Issues
- Check `REACT_APP_API_URL` in `.env`
- Verify backend server is running
- Check browser console for CORS or network errors

### Search Not Working
- Verify openFDA API is accessible
- Check for rate limiting
- Confirm search parameters are properly encoded

### Authentication Problems
- Use test credentials listed above
- Check that localStorage is enabled
- Verify token format and handling

## Testing

Run the test suite:
```bash
npm test
```

To run tests once without watch mode:
```bash
npm test -- --watchAll=false
```

## Building for Production

```bash
npm run build
```

The build artifacts will be placed in the `build/` folder.