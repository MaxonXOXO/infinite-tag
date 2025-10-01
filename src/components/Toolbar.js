import React from 'react';

const Toolbar = ({ selectedTool, onToolSelect }) => {
  const tools = [
    { id: 'select', label: 'Select', icon: '↦' },
    { id: 'rectangle', label: 'Rectangle', icon: '□' },
    { id: 'ellipse', label: 'Ellipse', icon: '○' }, // <-- NEW TOOL
    { id: 'point', label: 'Point', icon: '•' },
    { id: 'pen', label: 'Pen', icon: '✍' }, // <-- RENAMED (was polygon)
  ];

  return (
    <div className="toolbar">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolSelect(tool.id)}
          title={tool.label}
        >
          <span className="tool-icon">{tool.icon}</span>
          {tool.label}
        </button>
      ))}
    </div>
  );
};

// Make sure this line is at the end:
export default Toolbar;