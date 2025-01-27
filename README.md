# Menu Management API

A Node.js backend server for menu management built with Express.js, TypeScript, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example` and update the values:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/menu-management
NODE_ENV=development
```

3. Build and run the server:
```bash
npm run build
npm start
```

For development with hot reload:
```bash
npm run dev
```

## API Documentation

### Categories

#### Create Category
- **POST** `/api/categories`
- Body:
  ```json
  {
    "name": "string",
    "image": "string (URL)",
    "description": "string",
    "taxApplicability": "boolean",
    "tax": "number (optional)",
    "taxType": "string (PERCENTAGE/FIXED, optional)"
  }
  ```

#### Get All Categories
- **GET** `/api/categories`

#### Get Category by ID
- **GET** `/api/categories/id/:id`

#### Get Category by Name
- **GET** `/api/categories/name/:name`

#### Update Category
- **PATCH** `/api/categories/:id`
- Body: Same as create (all fields optional)

### Subcategories

#### Create Subcategory
- **POST** `/api/subcategories`
- Body:
  ```json
  {
    "name": "string",
    "image": "string (URL)",
    "description": "string",
    "category": "string (Category ID)",
    "taxApplicability": "boolean (optional)",
    "tax": "number (optional)",
    "taxType": "string (PERCENTAGE/FIXED, optional)"
  }
  ```

#### Get All Subcategories
- **GET** `/api/subcategories`

#### Get Subcategories by Category
- **GET** `/api/subcategories/category/:categoryId`

#### Get Subcategory by ID
- **GET** `/api/subcategories/:id`

#### Update Subcategory
- **PATCH** `/api/subcategories/:id`
- Body: Same as create (all fields optional)

### Items

#### Create Item
- **POST** `/api/items`
- Body:
  ```json
  {
    "name": "string",
    "image": "string (URL)",
    "description": "string",
    "category": "string (Category ID)",
    "subCategory": "string (Subcategory ID, optional)",
    "taxApplicability": "boolean",
    "tax": "number (optional)",
    "baseAmount": "number",
    "discount": "number"
  }
  ```

#### Get All Items
- **GET** `/api/items`

#### Search Items
- **GET** `/api/items/search?query=searchterm`

#### Get Items by Category
- **GET** `/api/items/category/:categoryId`

#### Get Items by Subcategory
- **GET** `/api/items/subcategory/:subCategoryId`

#### Get Item by ID
- **GET** `/api/items/:id`

#### Update Item
- **PATCH** `/api/items/:id`
- Body: Same as create (all fields optional)

## Security Features

1. Rate limiting to prevent brute force attacks
2. Helmet for security headers
3. CORS protection
4. Input validation and sanitization
5. Error handling middleware
6. MongoDB injection protection

## Data Models

### Category
- name (unique)
- image
- description
- taxApplicability
- tax (required if taxApplicability is true)
- taxType (required if taxApplicability is true)

### Subcategory
- name (unique within category)
- image
- description
- category (reference)
- taxApplicability
- tax
- taxType

### Item
- name (unique within category/subcategory)
- image
- description
- category (reference)
- subCategory (reference, optional)
- taxApplicability
- tax
- baseAmount
- discount
- totalAmount (calculated)
