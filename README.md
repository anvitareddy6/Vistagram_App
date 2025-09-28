# Vistagram - Points of Interest Social Platform

A full-stack web application that allows users to capture, upload, and share images of Points of Interest (POI) with captions. Built with the MERN stack and designed for seamless photo sharing and social interaction.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Performance Optimizations](#performance-optimizations)
- [Cross-Browser Compatibility](#cross-browser-compatibility)
- [Security Features](#security-features)

## Features

### Core Functionality
- **Image Capture & Upload**: Capture photos using device camera or upload from gallery
- **Timeline Feed**: Browse posts in reverse chronological order with infinite scroll
- **Social Interactions**: Like and share posts with persistent counters
- **User Profiles**: View individual user profiles and their posts
- **Real-time Updates**: Live post interactions and feed updates

### Advanced Features
- **Camera Integration**: Direct camera access for mobile and desktop
- **File Validation**: Comprehensive image type and size validation
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Error Handling**: Graceful error recovery with user-friendly messages
- **Loading States**: Professional loading indicators and skeleton screens
- **Hashtag Support**: Automatic hashtag detection and highlighting
- **Share Functionality**: Copy-to-clipboard sharing with fallback support

### User Experience
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels
- **Performance**: Lazy loading, image optimization, and caching
- **Offline Support**: Basic offline functionality with service workers

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Axios**: HTTP client for API requests
- **CSS3**: Modern styling with Flexbox and Grid
- **HTML5**: Semantic markup with accessibility features
- **JavaScript ES6+**: Modern JavaScript features

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **Multer**: Middleware for handling multipart/form-data

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Indexes**: Optimized queries for performance
- **Validation**: Schema-level data validation
- **Aggregation**: Complex data processing pipelines

### Development Tools
- **Create React App**: React development environment
- **Nodemon**: Development server with auto-restart
- **Concurrently**: Run multiple npm scripts simultaneously
- **ESLint**: Code linting and style enforcement

## Architecture

### Component Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express API    │    │  MongoDB Atlas  │
│                 │    │                 │    │                 │
│  • Components   │◄──►│  • Routes       │◄──►│  • Collections  │
│  • State Mgmt   │    │  • Middleware   │    │  • Indexes      │
│  • API Calls    │    │  • Validation   │    │  • Aggregation  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. User interacts with React components
2. Components make API calls via Axios
3. Express routes handle requests
4. Mongoose interacts with MongoDB
5. Response flows back through the stack

## Project Structure

```
vistagram/
├── package.json                 # Root package.json with scripts
├── README.md                    # This file
├── .gitignore                   # Git ignore rules
├── client/                      # React frontend
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   └── src/
│       ├── App.js               # Main React component
│       ├── App.css              # Global styles
│       ├── index.js             # React entry point
│       ├── components/          # React components
│       │   ├── Header.js
│       │   ├── CreatePost.js
│       │   ├── PostCard.js
│       │   ├── Timeline.js
│       │   ├── ErrorBoundary.js
│       │   ├── Loading.js
│       │   ├── ErrorMessage.js
│       │   └── EmptyState.js
│       └── utils/               # Utility functions
│           ├── apiConfig.js
│           └── helpers.js
└── server/                      # Express backend
    ├── package.json
    ├── server.js                # Main server file
    ├── .env                     # Environment variables
    ├── models/                  # Mongoose models
    │   └── Post.js
    ├── routes/                  # Express routes
    │   ├── posts.js
    │   └── upload.js
    ├── middleware/              # Custom middleware
    ├── uploads/                 # File upload directory
    └── scripts/                 # Utility scripts
        └── seedData.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vistagram_App
   ```

2. **Install dependencies and start the application**
   ```bash
   npm i
   npm start
   ```
   
   This will automatically install dependencies for both client and server, then start both the frontend (port 3000) and backend (port 5000) concurrently. Run it on [localhost:3000](http://localhost:3000/)

3. **Seed the database (Done by Defualt)**
   ```bash
   npm run seed
   ```

### Available Scripts

#### Root Level
- `npm start` - Start both client and server in development mode
- `npm run client` - Start only the React client
- `npm run server` - Start only the Express server
- `npm run build` - Build the React app for production
- `npm run install-all` - Install dependencies for both client and server
- `npm run seed` - Seed the database with sample data
- `npm test` - Run all tests

#### Server Scripts
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm run seed` - Populate database with sample data
- `npm test` - Run server tests

#### Client Scripts
- `npm run build` - Create production build
- `npm run test:coverage` - Run tests with coverage report

## Environment Configuration

### Development
- Frontend: http://localhost:3001
- Backend: http://localhost:5001
- Database: MongoDB Atlas

## API Documentation

### Posts Endpoints

#### GET /api/posts
Get all posts with pagination
```javascript
Response: {
  posts: Array,
  pagination: {
    currentPage: Number,
    totalPages: Number,
    totalPosts: Number,
    hasMore: Boolean
  }
}
```

#### POST /api/posts
Create a new post
```javascript
Request: FormData {
  image: File,
  caption: String,
  username: String
}
Response: Post Object
```

#### POST /api/posts/:id/like
Like/unlike a post
```javascript
Request: { userId: String }
Response: { likes: Number, hasLiked: Boolean }
```

#### POST /api/posts/:id/share
Share a post
```javascript
Response: { shares: Number, shareUrl: String }
```

### Upload Endpoints

#### POST /api/upload/image
Upload a single image
```javascript
Request: FormData { image: File }
Response: { filename: String, path: String }
```

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Images loaded on demand with intersection observer
- **Memoization**: React.memo for preventing unnecessary re-renders
- **Bundle Optimization**: Webpack optimizations for smaller bundles
- **Caching**: Browser caching with appropriate cache headers

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Compression**: Gzip compression for API responses
- **Rate Limiting**: Prevents API abuse and improves stability
- **Connection Pooling**: Efficient database connection management
- **Static File Serving**: Optimized static asset delivery

### Image Optimizations
- **File Size Validation**: Prevents large uploads
- **Format Support**: Multiple image formats supported
- **Lazy Loading**: Images load as needed
- **Error Handling**: Graceful fallbacks for missing images

## Cross-Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills and Fallbacks
- **Clipboard API**: Fallback for older browsers
- **File API**: Progressive enhancement for file uploads
- **CSS Grid/Flexbox**: Fallbacks for older browsers
- **ES6+ Features**: Babel transpilation for compatibility

### Testing Strategy
- Browser testing across major platforms
- Mobile device testing (iOS, Android)
- Accessibility testing with screen readers
- Performance testing on various network conditions

## Security Features

### Input Validation
- File type and size validation
- XSS prevention with input sanitization
- SQL injection prevention (NoSQL injection for MongoDB)
- CSRF protection

### API Security
- Rate limiting to prevent abuse
- CORS configuration for trusted origins
- Helmet.js for security headers
- Environment variable protection

### File Upload Security
- File type validation
- Size restrictions
- Secure file storage
- Path traversal prevention
