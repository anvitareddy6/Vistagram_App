import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import PostCard from './PostCard';

const Timeline = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching posts from:', `${API_URL}/posts`);
      const response = await axios.get(`${API_URL}/posts`);
      
      const postsData = response.data.posts || response.data;
      setPosts(Array.isArray(postsData) ? postsData : []);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchPosts} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="timeline-section">
      <div className="timeline-header">
        <h2>📸 Latest Posts</h2>
        <button onClick={fetchPosts} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Be the first to share a point of interest!</p>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onPostUpdate={handlePostUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Timeline;