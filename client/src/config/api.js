// API Configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = process.env.REACT_APP_API_URL || 
  (isDevelopment ? 'http://localhost:8080/api' : 'https://vistagramapp-production-c497.up.railway.app/api');

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 
  (isDevelopment ? 'http://localhost:8080' : 'https://vistagramapp-production-c497.up.railway.app');