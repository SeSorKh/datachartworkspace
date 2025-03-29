import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import Editor from '@monaco-editor/react';
import TableWindow from './TableWindow';
import './Workspace.css';

// eslint-disable-next-line no-unused-vars
const SHEET_ID = '1WQQaPcC8LjWk7_JjFoPhcTo1sz6Do__Xq5sMoNYrj8Q';

const Workspace = () => {
  const [windows, setWindows] = useState([]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  const handleClose = (id) => {
    setWindows(windows.filter(window => window.id !== id));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCreateNewWindow = (type) => {
    const newId = Math.max(...windows.map(w => w.id), 0) + 1;
    const newWindow = {
      id: newId,
      title: type === 'table' ? `Table ${newId}` : `Code Editor ${newId}`,
      type: type,
      content: type === 'editor' ? '// New code editor\n// Start coding here...' : null,
      position: { 
        x: contextMenu.x, 
        y: contextMenu.y 
      },
      size: { width: 600, height: 400 }
    };
    setWindows([...windows, newWindow]);
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleResize = (id, e, { size }) => {
    setWindows(windows.map(window => 
      window.id === id 
        ? { ...window, size: { width: size.width, height: size.height } }
        : window
    ));
  };

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const renderWindowContent = (window) => {
    if (window.type === 'table') {
      return (
        <TableWindow
          title={window.title}
          size={window.size}
        />
      );
    }
    return (
      <Editor
        height={window.size.height - 30}
        defaultLanguage="javascript"
        defaultValue={window.content}
        theme="vs-dark"
      />
    );
  };

  return (
    <div 
      className="workspace" 
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {windows.map(window => (
        <Draggable
          key={window.id}
          defaultPosition={window.position}
          bounds="parent"
          handle=".window-header"
        >
          <div className="window-container">
            <Resizable
              width={window.size.width}
              height={window.size.height}
              onResize={(e, data) => handleResize(window.id, e, data)}
              minConstraints={[300, 200]}
              resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
            >
              <div className="window" style={{ width: window.size.width, height: window.size.height }}>
                <div className="window-header">
                  <span>{window.title}</span>
                  <button onClick={() => handleClose(window.id)}>×</button>
                </div>
                <div className="window-content">
                  {renderWindowContent(window)}
                </div>
              </div>
            </Resizable>
          </div>
        </Draggable>
      ))}
      
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
        >
          <button onClick={() => handleCreateNewWindow('editor')}>New Code Editor</button>
          <button onClick={() => handleCreateNewWindow('table')}>New Table</button>
        </div>
      )}
    </div>
  );
};

export default Workspace; 