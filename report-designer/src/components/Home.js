import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleCreateReport = () => {
    navigate('/designer');
  };

  return (
    <div className="home-container">
      <h1>Welcome to Adnan Report Builder</h1>
      <div className="options-container">
        <button onClick={() => alert('Sign Up/Login not implemented yet')}>Sign Up / Login (Optional)</button>
        <button onClick={() => alert('Upload functionality coming soon')}>Upload a Report</button>
        <button onClick={handleCreateReport}>Create a New Report</button>
        <button onClick={() => alert('Connect with REST coming soon')}>Connect with REST</button>
      </div>
    </div>
  );
}

export default Home;
