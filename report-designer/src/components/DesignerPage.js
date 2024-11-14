import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import TopBar from './TopBar';
import './DesignerPage.css';

const ItemTypes = {
  TEXT: 'text',
  TABLE: 'table',
  CHART: 'chart',
  COLUMN: 'column',
};

function DesignerPage() {
  const [rows, setRows] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementStyle, setElementStyle] = useState({});

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
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

  return (
    <div className="designer-container">
      <TopBar selectedElement={selectedElement} setStyle={setElementStyle} />
      <div className="toolbar">
        <h3>Elements</h3>
        {/* Draggable Elements Section */}
        <DraggableElement type={ItemTypes.TEXT}>Text</DraggableElement>
        <DraggableElement type={ItemTypes.TABLE}>Table</DraggableElement>
        <DraggableElement type={ItemTypes.CHART}>Chart</DraggableElement>
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
            setSelectedElement={setSelectedElement}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ row, setRows, rows, addColumnToRow, setSelectedElement }) {
  const moveColumn = (columnId, direction) => {
    const updatedRows = rows.map((r) => {
      if (r.id === row.id) {
        const index = r.columns.findIndex((col) => col.id === columnId);
        if (index < 0) return r;

        const newColumns = [...r.columns];
        if (direction === 'left' && index > 0) {
          [newColumns[index - 1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
        } else if (direction === 'right' && index < newColumns.length - 1) {
          [newColumns[index + 1], newColumns[index]] = [newColumns[index], newColumns[index + 1]];
        }
        return { ...r, columns: newColumns };
      }
      return r;
    });
    setRows(updatedRows);
  };

  return (
    <div className="row">
      <button className="add-column-button" onClick={() => addColumnToRow(row.id)}>
        Add Column
      </button>
      <div className="columns-container">
        {row.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            rowId={row.id}
            setRows={setRows}
            rows={rows}
            moveColumn={moveColumn}
            setSelectedElement={setSelectedElement}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ column, rowId, setRows, rows, moveColumn, setSelectedElement }) {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.TEXT, ItemTypes.TABLE, ItemTypes.CHART],
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

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: { type: ItemTypes.COLUMN, id: column.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const deleteColumn = () => {
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          columns: row.columns.filter((col) => col.id !== column.id),
        };
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`column ${isOver ? 'hovered-column' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => setSelectedElement(column)}
    >
      <div className="column-controls">
        <FontAwesomeIcon icon={faArrowLeft} className="column-control-icon" onClick={() => moveColumn(column.id, 'left')} />
        <FontAwesomeIcon icon={faArrowRight} className="column-control-icon" onClick={() => moveColumn(column.id, 'right')} />
        <FontAwesomeIcon icon={faTrash} className="column-control-icon" onClick={deleteColumn} />
      </div>
      {column.elements.map((element) => (
        <Element
          key={element.id}
          element={element}
          rowId={rowId}
          columnId={column.id}
          rows={rows}
          setRows={setRows}
          setSelectedElement={setSelectedElement}
        />
      ))}
    </div>
  );
}

function Element({ element, rowId, columnId, rows, setRows, setSelectedElement }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content || '');

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          columns: row.columns.map((col) => {
            if (col.id === columnId) {
              return {
                ...col,
                elements: col.elements.map((el) => {
                  if (el.id === element.id) {
                    return {
                      ...el,
                      content,
                    };
                  }
                  return el;
                }),
              };
            }
            return col;
          }),
        };
      }
      return row;
    });
    setRows(updatedRows);
    setIsEditing(false);
  };

  return (
    <div
      className="element"
      onClick={() => {
        toggleEditing();
        setSelectedElement(element);
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{content || 'Text Element'}</span>
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
