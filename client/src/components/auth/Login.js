// src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onSwitchToRegister, onClose }) => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(formData.identifier, formData.password, formData.rememberMe);
    
    if (result.success) {
      handleClose();
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'toast toast-success';
      toast.textContent = `Welcome back, ${result.user.displayName}!`;
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
    
    setIsSubmitting(false);
  };

  const isFormValid = formData.identifier.trim() && formData.password.trim();

  return (
    <div className="auth-modal-overlay" onClick={handleClose} style={{alignItems: 'center', justifyContent: 'center'}}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Welcome Back</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className="form-input"
                autoComplete="username"
                required
              />
            </div>
          </div>

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
                placeholder="Enter your password"
                className="form-input"
                autoComplete="current-password"
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
          </div>


          <button
            type="submit"
            disabled={!isFormValid || isSubmitting || loading}
            className="btn btn-primary btn-auth"
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            onClick={onSwitchToRegister}
            className="btn btn-secondary btn-auth"
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;