import React from 'react';
import './TopBar.css';

function TopBar({ selectedElement, setStyle }) {
  if (!selectedElement) {
    return null; // Don't show the top bar if no element is selected
  }

  const handleStyleChange = (styleProp, value) => {
    setStyle((prevStyle) => ({
      ...prevStyle,
      [styleProp]: value,
    }));
  };

  return (
    <div className="top-bar">
      {/* Text Alignment */}
      <div className="top-bar-section">
        <button onClick={() => handleStyleChange('textAlign', 'left')}>Left</button>
        <button onClick={() => handleStyleChange('textAlign', 'center')}>Center</button>
        <button onClick={() => handleStyleChange('textAlign', 'right')}>Right</button>
        <button onClick={() => handleStyleChange('textAlign', 'justify')}>Justify</button>
      </div>

      {/* Font Size & Font Family */}
      <div className="top-bar-section">
        <select
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
          defaultValue={selectedElement?.style?.fontSize || '16px'}
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
        </select>
        <select
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          defaultValue={selectedElement?.style?.fontFamily || 'Arial'}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Tahoma">Tahoma</option>
        </select>
      </div>

      {/* Font Styles */}
      <div className="top-bar-section">
        <button onClick={() => handleStyleChange('fontWeight', 'bold')}>Bold</button>
        <button onClick={() => handleStyleChange('fontStyle', 'italic')}>Italic</button>
        <button onClick={() => handleStyleChange('textDecoration', 'underline')}>Underline</button>
      </div>

      {/* Font & Background Colors */}
      <div className="top-bar-section">
        <label>Font Color:</label>
        <input
          type="color"
          onChange={(e) => handleStyleChange('color', e.target.value)}
          defaultValue={selectedElement?.style?.color || '#000000'}
        />
        <label>Background Color:</label>
        <input
          type="color"
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          defaultValue={selectedElement?.style?.backgroundColor || '#ffffff'}
        />
      </div>

      {/* Border Settings */}
      <div className="top-bar-section">
        <label>Border:</label>
        <select
          onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
          defaultValue={selectedElement?.style?.borderStyle || 'none'}
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
        <input
          type="color"
          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
          defaultValue={selectedElement?.style?.borderColor || '#000000'}
        />
      </div>
    </div>
  );
}

export default TopBar;
