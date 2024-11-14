import React from 'react';
import './DesignerPage.css';

function DesignerPage() {
  return (
    <div className="designer-container">
      <div className="toolbar">
        <h3>Elements</h3>
        <button>Text</button>
        <button>Table</button>
        <button>Chart</button>
        {/* Add other element buttons here */}
      </div>
      <div className="designer-canvas">
        <h3>Report Preview Area</h3>
        {/* Canvas for report components */}
      </div>
      <div className="top-bar">
        <button>Save</button>
        {/* Add other top bar features here */}
      </div>
    </div>
  );
}

export default DesignerPage;
