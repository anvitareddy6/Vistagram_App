// src/components/auth/Register.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Register = ({ onSwitchToLogin, onClose }) => {
  const { register, checkUsernameAvailability, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  useEffect(() => {
    clearError();
    // Prevent body scroll when modal opens
    document.body.classList.add('modal-open');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [clearError]);

  const handleClose = () => {
    document.body.classList.remove('modal-open');
    onClose();
  };

  const checkUsername = useCallback(async (username) => {
    if (username.length < 3) return;
    
    setCheckingUsername(true);
    const result = await checkUsernameAvailability(username);
    setUsernameStatus(result);
    setCheckingUsername(false);
  }, [checkUsernameAvailability]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.username && formData.username.length >= 3) {
        checkUsername(formData.username);
      } else {
        setUsernameStatus(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, checkUsername]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      errors.username = 'Username cannot exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 50) {
      errors.displayName = 'Display name cannot exceed 50 characters';
    }

    if (formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (usernameStatus && !usernameStatus.available) {
      setValidationErrors(prev => ({
        ...prev,
        username: 'Username is not available'
      }));
      return;
    }

    setIsSubmitting(true);

    const result = await register({
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      displayName: formData.displayName.trim(),
      bio: formData.bio.trim()
    });
    
    if (result.success) {
      handleClose();
      const toast = document.createElement('div');
      toast.className = 'toast toast-success';
      toast.textContent = `Welcome to Vistagram, ${result.user.displayName}!`;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
    
    setIsSubmitting(false);
  };

  const isFormValid = formData.username.trim() && 
                     formData.email.trim() && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.displayName.trim() && 
                     formData.password === formData.confirmPassword &&
                     (!usernameStatus || usernameStatus.available);

  return (
    <div className="auth-modal-overlay" onClick={handleClose} style={{alignItems: 'center', justifyContent: 'center'}}>
      <div className="auth-modal register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Join Vistagram</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={`form-input ${validationErrors.username ? 'error' : ''} ${usernameStatus?.available === true ? 'success' : ''}`}
                  autoComplete="username"
                  required
                />
                <div className="username-status">
                  {checkingUsername && <div className="mini-spinner"></div>}
                  {usernameStatus && !checkingUsername && (
                    <span className={`status-icon ${usernameStatus.available ? 'success' : 'error'}`}>
                      {usernameStatus.available ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </div>
              {validationErrors.username && (
                <span className="error-text">{validationErrors.username}</span>
              )}
              {usernameStatus && !validationErrors.username && (
                <span className={`status-text ${usernameStatus.available ? 'success' : 'error'}`}>
                  {usernameStatus.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your display name"
                  className={`form-input ${validationErrors.displayName ? 'error' : ''}`}
                  autoComplete="name"
                  required
                />
              </div>
              {validationErrors.displayName && (
                <span className="error-text">{validationErrors.displayName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                autoComplete="email"
                required
              />
            </div>
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {validationErrors.password && (
                <span className="error-text">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="error-text">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>



          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || loading}
            className="btn btn-primary btn-auth"
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-secondary btn-auth"
          >
            Already have an account? Sign In
          </button>

          <div className="terms-text">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;