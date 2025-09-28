// Utility functions for the Vistagram app

/**
 * Format timestamp to human-readable format
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} - Formatted time string
 */
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

/**
 * Validate file type and size for image uploads
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
 * @returns {object} - Validation result with isValid and error message
 */
export const validateImageFile = (file, maxSize = 10 * 1024 * 1024) => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Generate a random user ID for anonymous users
 * @returns {string} - Random user ID
 */
export const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Copy text to clipboard with fallback for non-HTTPS environments
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Get or create user ID from localStorage
 * @returns {string} - User ID
 */
export const getUserId = () => {
  let userId = localStorage.getItem('vistagram_user_id');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('vistagram_user_id', userId);
  }
  return userId;
};

/**
 * Get username from localStorage
 * @returns {string} - Username or 'anonymous_user' if not set
 */
export const getUsername = () => {
  return localStorage.getItem('vistagram_username') || 'anonymous_user';
};

/**
 * Set username in localStorage
 * @param {string} username - Username to save
 */
export const setUsername = (username) => {
  localStorage.setItem('vistagram_username', username);
};