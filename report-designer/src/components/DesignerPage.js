import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TopBar from './TopBar';
import './DesignerPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTrash, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ItemTypes = {
  TEXT: 'text',
};

function DesignerPage() {
  const [rows, setRows] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [elementData, setElementData] = useState({});
  const [undoHistory, setUndoHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);;

  const addRow = () => {
    saveState();
    const newRow = {
      id: `row-${rows.length + 1}`,
      columns: [],
    };
    setRows([...rows, newRow]);
  };

  const addColumnToRow = (rowId) => {
    saveState();
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

  const saveState = () => {
    setUndoHistory([...undoHistory, rows]);
    setRedoHistory([]); // Clear redo history on new action
  };

  const undo = () => {
    if (undoHistory.length > 0) {
      setRedoHistory([rows, ...redoHistory]);
      setRows(undoHistory[undoHistory.length - 1]);
      setUndoHistory(undoHistory.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      setUndoHistory([...undoHistory, rows]);
      setRows(redoHistory[0]);
      setRedoHistory(redoHistory.slice(1));
    }
  };

  const updateElementContent = (id, content) => {
    saveState();
    setElementData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        content: content,
      },
    }));
  };

  const deleteElement = (elementId) => {
    saveState();
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        columns: row.columns.map((col) => ({
          ...col,
          elements: col.elements.filter((element) => element.id !== elementId),
        })),
      }))
    );
  };

  return (
    <div
      className="designer-container"
      onClick={() => setSelectedElementId(null)} // Deselect element when clicking outside
    >
      <TopBar selectedElement={selectedElementId} setStyle={updateElementContent} />

      <div className="toolbar" onClick={(e) => e.stopPropagation()}>
  <h3>Elements</h3>
  <DraggableElement type={ItemTypes.TEXT}>Text</DraggableElement>
  <button onClick={addRow}>Add Row</button>
  <button onClick={undo} disabled={undoHistory.length === 0}>
    <FontAwesomeIcon icon={faUndo} /> Undo
  </button>
  <button onClick={redo} disabled={redoHistory.length === 0}>
    <FontAwesomeIcon icon={faRedo} /> Redo
  </button>
</div>


      <div className="designer-canvas" onClick={(e) => e.stopPropagation()}>
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
            elementData={elementData}
            updateElementContent={updateElementContent}
            deleteElement={deleteElement}
          />
        ))}
      </div>
    </div>
  );
}


function Row({ row, setRows, rows, addColumnToRow, setSelectedElementId, selectedElementId, elementData, updateElementContent, deleteElement }) {
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
            elementData={elementData}
            updateElementContent={updateElementContent}
            deleteElement={deleteElement}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ column, rowId, setRows, rows, setSelectedElementId, selectedElementId, elementData, updateElementContent, deleteElement }) {
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

  const moveColumn = (direction) => {
    const rowIndex = rows.findIndex((row) => row.id === rowId);
    const columnIndex = rows[rowIndex].columns.findIndex((col) => col.id === column.id);

    if (
      (direction === 'left' && columnIndex === 0) ||
      (direction === 'right' && columnIndex === rows[rowIndex].columns.length - 1)
    ) {
      return;
    }

    const newColumns = [...rows[rowIndex].columns];
    const [movedColumn] = newColumns.splice(columnIndex, 1);
    newColumns.splice(direction === 'left' ? columnIndex - 1 : columnIndex + 1, 0, movedColumn);

    const updatedRows = rows.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          columns: newColumns,
        };
      }
      return row;
    });

    setRows(updatedRows);
  };

  return (
    <div ref={drop} className={`column ${isOver ? 'hovered-column' : ''}`}>
      <div className="column-controls">
        <button onClick={() => moveColumn('left')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button onClick={() => moveColumn('right')}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button onClick={() => deleteElement(column.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      {column.elements.map((element) => (
        <Element
          key={element.id}
          element={element}
          setSelectedElementId={setSelectedElementId}
          isSelected={selectedElementId === element.id}
          elementData={elementData[element.id] || { content: 'Text Element', styles: {} }}
          updateElementContent={updateElementContent}
          deleteElement={deleteElement}
        />
      ))}
    </div>
  );
}

function Element({ element, setSelectedElementId, isSelected, elementData, updateElementContent, deleteElement }) {
  const [localContent, setLocalContent] = useState(elementData.content || 'Text Element');

  // Update local content when elementData.content changes externally
  useEffect(() => {
    setLocalContent(elementData.content || 'Text Element');
  }, [elementData.content]);

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  // Handle content change locally to prevent cursor jumping
  const handleContentChange = (content) => {
    setLocalContent(content);
  };

  // Update global content only when editing is done
  const handleBlur = () => {
    updateElementContent(element.id, localContent);
  };

  // Default styles if none are provided
  const defaultStyles = {
    fontSize: '16px',
    color: '#000000',
    padding: '10px',
    border: '1px solid #ccc',
    margin: '10px 0',
  };

  const appliedStyles = {
    ...defaultStyles,
    ...elementData.styles,
  };

  return (
    <div
      id={element.id}
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={appliedStyles}
    >
      <button
        className="delete-element-button"
        onClick={(e) => {
          e.stopPropagation();
          deleteElement(element.id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
      {isSelected ? (
        <ReactQuill
          value={localContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          theme="snow"
          style={{ width: '100%', minHeight: '80px' }}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: localContent }} />
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
