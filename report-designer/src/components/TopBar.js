// Import necessary React modules
import React from 'react';
import './TopBar.css';

function TopBar({ selectedElement, setStyle }) {
  const handleStyleChange = (styleProp, value) => {
    if (!selectedElement) return; // Prevent style change if no element is selected

    setStyle((prevStyle) => ({
      ...prevStyle,
      [selectedElement.id]: {
        ...prevStyle[selectedElement.id],
        [styleProp]: value,
      },
    }));
  };

  return (
    <div className="top-bar header" style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#fff', padding: '10px', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      {/* Text Alignment */}
      <div className="style-group">
        <label>Text Alignment:</label>
        <button onClick={() => handleStyleChange('textAlign', 'left')} disabled={!selectedElement}>Left</button>
        <button onClick={() => handleStyleChange('textAlign', 'center')} disabled={!selectedElement}>Center</button>
        <button onClick={() => handleStyleChange('textAlign', 'right')} disabled={!selectedElement}>Right</button>
        <button onClick={() => handleStyleChange('textAlign', 'justify')} disabled={!selectedElement}>Justify</button>
      </div>

      {/* Font Size */}
      <div className="style-group">
        <label>Font Size:</label>
        <input
          type="number"
          defaultValue={16}
          onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
          disabled={!selectedElement}
        />
      </div>

      {/* Font Weight */}
      <div className="style-group">
        <label>Font Weight:</label>
        <button onClick={() => handleStyleChange('fontWeight', 'normal')} disabled={!selectedElement}>Normal</button>
        <button onClick={() => handleStyleChange('fontWeight', 'bold')} disabled={!selectedElement}>Bold</button>
      </div>

      {/* Font Style */}
      <div className="style-group">
        <label>Font Style:</label>
        <button onClick={() => handleStyleChange('fontStyle', 'normal')} disabled={!selectedElement}>Normal</button>
        <button onClick={() => handleStyleChange('fontStyle', 'italic')} disabled={!selectedElement}>Italic</button>
      </div>

      {/* Text Decoration */}
      <div className="style-group">
        <label>Text Decoration:</label>
        <button onClick={() => handleStyleChange('textDecoration', 'none')} disabled={!selectedElement}>None</button>
        <button onClick={() => handleStyleChange('textDecoration', 'underline')} disabled={!selectedElement}>Underline</button>
      </div>

      {/* Font Color */}
      <div className="style-group">
        <label>Font Color:</label>
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => handleStyleChange('color', e.target.value)}
          disabled={!selectedElement}
        />
      </div>

      {/* Background Color */}
      <div className="style-group">
        <label>Background Color:</label>
        <input
          type="color"
          defaultValue="#ffffff"
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          disabled={!selectedElement}
        />
      </div>

      {/* Border Settings */}
      <div className="style-group">
        <label>Border Style:</label>
        <select
          onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
          defaultValue="none"
          disabled={!selectedElement}
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      <div className="style-group">
        <label>Border Color:</label>
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
          disabled={!selectedElement}
        />
      </div>

      <div className="style-group">
        <label>Border Width:</label>
        <input
          type="number"
          defaultValue={0}
          onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
          disabled={!selectedElement}
        />
      </div>
    </div>
  );
}

export default TopBar;
