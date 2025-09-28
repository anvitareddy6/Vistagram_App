import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/api';

const CreatePost = ({ onPostCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found on this device.');
      } else {
        alert('Error accessing camera. Please try uploading an image instead.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          setSelectedFile(file);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setCaption('');
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please log in to create a post');
      return;
    }
    
    // Validation
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }
    
    if (!caption.trim()) {
      alert('Please add a caption');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption.trim());
      
      // Use authenticated user's username
      formData.append('username', user.username);

      console.log('Submitting post...', {
        filename: selectedFile.name,
        size: selectedFile.size,
        caption: caption.trim(),
        username: user.username
      });

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });
      
      console.log('Post created successfully:', response.data);
      
      resetForm();
      
      // Success toast
      const toast = document.createElement('div');
      toast.className = 'toast toast-success';
      toast.textContent = 'Post shared successfully!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('show'), 100);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
      
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
    } catch (error) {
      console.error('Error uploading post:', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || error.response.data?.message || 'Unknown server error';
        
        if (status === 401) {
          alert('Please log in to create a post');
        } else if (status === 400) {
          alert(`Invalid request: ${message}`);
        } else if (status === 413) {
          alert('File too large. Please select a smaller image.');
        } else if (status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert(`Error ${status}: ${message}`);
        }
      } else if (error.request) {
        alert('No response from server. Please check if the server is running.');
      } else {
        alert('Failed to upload post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="create-post-section">
        <div className="login-prompt">
          <h2>Share Your Moments</h2>
          <p>Log in to start sharing your photos with the community!</p>
          <div className="login-prompt-icon">📸</div>
        </div>
      </section>
    );
  }

  return (
    <section className="create-post-section">
      <h2>Share a Moment, @{user.username}!</h2>
      
      {showCamera ? (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-preview"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="camera-controls">
            <button onClick={capturePhoto} className="btn btn-primary">
              📸 Capture Photo
            </button>
            <button onClick={stopCamera} className="btn btn-secondary">
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : !selectedFile ? (
        <div className="capture-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            id="file-upload"
            style={{ display: 'none' }}
          />
          <div className="upload-options">
            <label htmlFor="file-upload" className="btn btn-primary">
              📁 Choose from Gallery
            </label>
            <button onClick={startCamera} className="btn btn-secondary">
              📷 Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(selectedFile)} 
            alt="Preview" 
            className="preview-image"
          />
          
          <div className="upload-form">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's the story behind this moment? Add hashtags like #sunset #memories"
              className="caption-input"
              rows="3"
              maxLength={500}
            />
            
            <div className="caption-counter">
              {caption.length}/500 characters
            </div>
            
            <div className="upload-buttons">
              <button 
                onClick={submitPost} 
                disabled={loading || !caption.trim()} 
                className="btn btn-primary"
              >
                {loading ? 'Posting...' : 'Share Post'}
              </button>
              <button 
                onClick={resetForm} 
                disabled={loading}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreatePost;