import { useState } from 'react';

export default function Camera() {
  const [cameraActive, setCameraActive] = useState(false);
  
  return (
    <section className="camera-container">
      <h1>Beauty Product Scanner</h1>
      <p>Use your camera to scan beauty products and analyze their ingredients for potential allergens or harmful components.</p>
      
      <div className="camera-view">
        {cameraActive ? (
          <div className="active-camera">
            <p>Camera would be active here in a real implementation</p>
          </div>
        ) : (
          <div className="camera-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <p>Click "Activate Camera" to start scanning</p>
          </div>
        )}
      </div>
      
      <div className="camera-controls">
        <button 
          className="btn primary-btn"
          onClick={() => setCameraActive(!cameraActive)}
        >
          {cameraActive ? 'Deactivate Camera' : 'Activate Camera'}
        </button>
        <button className="btn secondary-btn">
          Upload Image
        </button>
      </div>
      
      <div className="scanner-info">
        <h3>How It Works</h3>
        <ul>
          <li>Point your camera at the product ingredients list</li>
          <li>Our AI will identify potentially harmful ingredients</li>
          <li>Get instant feedback on product safety</li>
          <li>Learn about alternative products if needed</li>
        </ul>
      </div>
    </section>
  );
}
