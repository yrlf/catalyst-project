import React from 'react';

function MaterialPropertiesPanel({ properties }) {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', margin: '10px' }}>
      <h3>Material Properties</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(properties).map(([key, value]) => (
          <li key={key} style={{ marginBottom: '10px' }}>
            <strong>{key}:</strong> {value.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MaterialPropertiesPanel;
