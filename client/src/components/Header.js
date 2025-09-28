// src/components/Header.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './auth/Login';
import Register from './auth/Register';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  const username = user?.username || localStorage.getItem('vistagram_username') || 'anonymous_user';
  
  const handleLogout = async () => {
    await logout();
    // Show logout toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.textContent = 'Successfully logged out!';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">
              <span className="title-icon">📸</span>
              Vistagram
            </h1>
          </div>
          
          <div className="header-right">
            {isAuthenticated ? (
              <>
                <div className="user-info">
            
                  <span className="username-display">@{user?.username || username}</span>
                </div>
                <div className='auth-buttons'>
                <button onClick={handleLogout} className="btn btn-secondary btn-small">
                  Logout
                </button>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => setShowLogin(true)} 
                  className="btn btn-secondary btn-small"
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowRegister(true)} 
                  className="btn btn-primary btn-small"
                >
                  Sign Up
                </button>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Animated background particles */}
        <div className="header-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </header>

      {/* Auth Modals */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Header;