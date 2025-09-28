// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = process.env.REACT_APP_API_URL || 
  (isDevelopment ? 'http://localhost:5000/api' : 'https://vistagram-production-f1a6.up.railway.app/api');

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 
  (isDevelopment ? 'http://localhost:5000' : 'https://vistagram-production-f1a6.up.railway.app');