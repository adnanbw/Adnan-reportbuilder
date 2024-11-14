// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TopBar from './TopBar';
import './DesignerPage.css';

const ItemTypes = {
  TEXT: 'text',
};

function DesignerPage() {
  const [rows, setRows] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [elementStyles, setElementStyles] = useState({});
  const [elementContents, setElementContents] = useState({});

  const addRow = () => {
    const newRow = {
      id: `row-${rows.length + 1}`,
      columns: [],
    };
    setRows([...rows, newRow]);
  };

  const addColumnToRow = (rowId) => {
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          columns: [
            ...row.columns,
            {
              id: `col-${row.id}-${row.columns.length + 1}`,
              elements: [],
            },
          ],
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const updateElementStyles = (styles) => {
    if (!selectedElementId) return;

    setElementStyles((prevStyles) => ({
      ...prevStyles,
      [selectedElementId]: {
        ...prevStyles[selectedElementId],
        ...styles,
      },
    }));
  };

  const updateElementContent = (id, content) => {
    setElementContents((prevContents) => ({
      ...prevContents,
      [id]: content,
    }));
  };

  return (
    <div className="designer-container">
      <TopBar selectedElement={selectedElementId} setStyle={updateElementStyles} />
      <div className="toolbar">
        <h3>Elements</h3>
        {/* Draggable Elements Section */}
        <DraggableElement type={ItemTypes.TEXT}>Text</DraggableElement>
        <button onClick={addRow}>Add Row</button>
      </div>
      <div className="designer-canvas">
        <h3>Report Preview Area</h3>
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            setRows={setRows}
            rows={rows}
            addColumnToRow={addColumnToRow}
            setSelectedElementId={setSelectedElementId}
            selectedElementId={selectedElementId}
            elementStyles={elementStyles}
            elementContents={elementContents}
            updateElementContent={updateElementContent}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ row, setRows, rows, addColumnToRow, setSelectedElementId, selectedElementId, elementStyles, elementContents, updateElementContent }) {
  return (
    <div className="row">
      <button className="add-column-button" onClick={() => addColumnToRow(row.id)}>
        Add Column
      </button>
      <div className="columns-container">
        {row.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            rowId={row.id}
            setRows={setRows}
            rows={rows}
            setSelectedElementId={setSelectedElementId}
            selectedElementId={selectedElementId}
            elementStyles={elementStyles}
            elementContents={elementContents}
            updateElementContent={updateElementContent}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ column, rowId, setRows, rows, setSelectedElementId, selectedElementId, elementStyles, elementContents, updateElementContent }) {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.TEXT],
    drop: (item) => {
      const updatedRows = rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            columns: row.columns.map((col) => {
              if (col.id === column.id) {
                return {
                  ...col,
                  elements: [
                    ...col.elements,
                    { type: item.type, id: `${col.id}-${col.elements.length + 1}` },
                  ],
                };
              }
              return col;
            }),
          };
        }
        return row;
      });
      setRows(updatedRows);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`column ${isOver ? 'hovered-column' : ''}`}>
      {column.elements.map((element) => (
        <Element
          key={element.id}
          element={element}
          setSelectedElementId={setSelectedElementId}
          isSelected={selectedElementId === element.id}
          elementStyles={elementStyles[element.id] || {}}
          elementContent={elementContents[element.id] || 'Text Element'}
          updateElementContent={updateElementContent}
        />
      ))}
    </div>
  );
}

function Element({ element, setSelectedElementId, isSelected, elementStyles, elementContent, updateElementContent }) {
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleContentChange = (e) => {
    updateElementContent(element.id, e.target.value);
  };

  return (
    <div
      id={element.id}
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ ...elementStyles, padding: '10px', border: '1px solid #ccc', margin: '10px 0' }} // Directly applying styles and adding default styling
    >
      {isSelected ? (
        <input
          type="text"
          value={elementContent}
          onChange={handleContentChange}
          onClick={(e) => e.stopPropagation()} // Prevent unselecting when clicking inside the input
          style={{ width: '100%', fontSize: elementStyles.fontSize || '16px' }} // Ensuring font size is applied correctly
        />
      ) : (
        <span style={{ fontSize: elementStyles.fontSize || '16px' }}>{elementContent}</span> // Directly applying font size
      )}
    </div>
  );
}

function DraggableElement({ type, children }) {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className="draggable-element" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
}

export default DesignerPage;
