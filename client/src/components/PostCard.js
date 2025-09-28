import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL, SERVER_URL } from '../config/api';
import { formatTimestamp } from '../utils/helpers';

const PostCard = ({ post, onPostUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(post.likes || 0);
  const [shares, setShares] = useState(post.shares || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const showLoginPrompt = (action) => {
    const toast = document.createElement('div');
    toast.className = 'toast toast-warning';
    toast.textContent = `Please log in to ${action} posts`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      showLoginPrompt('like');
      return;
    }

    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/like`, {
        userId: user._id
      });
      setLikes(response.data.likes);
      
      // Success toast
      const toast = document.createElement('div');
      toast.className = 'toast toast-success';
      toast.textContent = 'Post liked!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
      
      if (onPostUpdate) {
        onPostUpdate({ ...post, likes: response.data.likes });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      
      const toast = document.createElement('div');
      toast.className = 'toast toast-error';
      toast.textContent = 'Failed to like post. Please try again.';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      showLoginPrompt('share');
      return;
    }

    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const response = await axios.post(`${API_URL}/posts/${post._id}/share`);
      setShares(response.data.shares);
      
      // Copy to clipboard
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Success toast
      const toast = document.createElement('div');
      toast.className = 'toast toast-success';
      toast.textContent = 'Share link copied to clipboard!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
      
      if (onPostUpdate) {
        onPostUpdate({ ...post, shares: response.data.shares });
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      
      const toast = document.createElement('div');
      toast.className = 'toast toast-error';
      toast.textContent = 'Failed to share post. Please try again.';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar">
            <span>{post.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="post-meta">
            <h3 className="username">@{post.username}</h3>
            <p className="timestamp">{formatTimestamp(post.createdAt || post.timestamp)}</p>
          </div>
        </div>
      </div>
      
      <div className="post-image-container">
        <img 
          src={`${SERVER_URL}/uploads/${post.image}`}
          alt={`Post by ${post.username}`}
          loading="lazy"
          className="post-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f8f9fa"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%23999">Image not available</text></svg>';
          }}
        />
      </div>
      
      <div className="post-content">
        <div className="post-actions">
          <div className="action-group primary-actions">
            <button 
              onClick={handleLike} 
              disabled={isLiking}
              className={`action-btn like-btn ${!isAuthenticated ? 'auth-required' : ''}`}
              title={!isAuthenticated ? 'Login to like posts' : 'Like this post'}
            >
              <span className="action-icon">❤️</span>
              <span className="action-count">{likes}</span>
              {isLiking && <div className="mini-spinner"></div>}
            </button>
            
            <button 
              onClick={handleShare} 
              disabled={isSharing}
              className={`action-btn share-btn ${!isAuthenticated ? 'auth-required' : ''}`}
              title={!isAuthenticated ? 'Login to share posts' : 'Share this post'}
            >
              <span className="action-icon">🔗</span>
              <span className="action-count">{shares}</span>
              {isSharing && <div className="mini-spinner"></div>}
            </button>
          </div>

        </div>
        
        {likes > 0 && (
          <div className="likes-count">
            <strong>{likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}</strong>
          </div>
        )}
        
        <div className="caption-container">
          <p className="caption">
            <span className="username-in-caption">@{post.username}</span> {post.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;