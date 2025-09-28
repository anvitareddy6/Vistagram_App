// src/App.js
import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import Timeline from './components/Timeline';

// Styles - Import in order of specificity
import './styles/globals.css';
import './styles/Button.css';
import './styles/Auth.css';
import './styles/App.css';
import './styles/Header.css';
import './styles/CreatePost.css';
import './styles/Timeline.css';
import './styles/PostCard.css';
import './styles/ErrorBoundary.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = (newPost) => {
    // Trigger timeline refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
      <AuthProvider>
        <ErrorBoundary>
          <div className="app">
            <Header />
            <main className="main-content">
              <CreatePost onPostCreated={handlePostCreated} />
              <Timeline refreshTrigger={refreshTrigger} />
            </main>
          </div>
        </ErrorBoundary>
      </AuthProvider>
  );
}

export default App;