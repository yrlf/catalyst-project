
//   // Example POSCAR data; ensure this is properly formatted as a string
//   const poscarData = `POSCAR(15)
// 1.0
//     6.9039998055         0.0000000000         0.0000000000
//     0.0000000000         6.9039998055         0.0000000000
//     0.0000000000         0.0000000000        20.4223995209
// Cu    C    O
// 2    1    1
// Direct
//     0.350000000         0.150000000          0.24590007
//     -0.000000000        -0.000000000         0.414590007
//      0.250000000         0.250000000         0.414590007
//     -0.000000000         0.250000000         0.144720002
// `;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MaterialPropertiesPanel from './MaterialPropertiesPanel';
import AtomVisualizer from './AtomVisualizer';
import axios from 'axios';
import './Style.css';


function parsePOSCAR(poscarContent) {
  const lines = poscarContent.trim().split('\n');
  const scalingFactor = parseFloat(lines[1].trim());
  const latticeVectors = lines.slice(2, 5).map(line =>
      line.trim().split(/\s+/).map(num => parseFloat(num) * scalingFactor)
  );
  const elements = lines[5].trim().split(/\s+/);
  const elementCounts = lines[6].trim().split(/\s+/).map(num => parseInt(num, 10));
  const coordinateType = lines[7].trim();
  let positionLines = lines.slice(8, 8 + elementCounts.reduce((a, b) => a + b, 0));

  let positions = [];
  let currentElementIndex = 0;
  let accumulatedCount = 0;

  // Parse positions and assign elements to each position
  for (let i = 0; i < elementCounts.length; i++) {
      const count = elementCounts[i];
      for (let j = 0; j < count; j++) {
          const lineIndex = accumulatedCount + j;
          const coords = positionLines[lineIndex].trim().split(/\s+/).map(num => parseFloat(num));
          positions.push({
              element: elements[i],
              a: coords[0],
              b: coords[1],
              c: coords[2]
          });
      }
      accumulatedCount += count;
  }

  const crystalData = {
      abc: latticeVectors,
      elements,
      elementCounts,
      positions
  };

  return crystalData;
}





function MaterialPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    if (materialId) {
      axios.get(`/api/detail`, { params: { id: materialId } })
        .then(response => {
          setMaterial(response.data.data);
        })
        .catch(error => {
          console.error("Error fetching material details:", error);
        });
    }
  }, [materialId]);

  if (!material) {
    return <div>Loading material details...</div>;
  }

  const properties = {
    'Space Group': material.structure,
    'Band Gap': material.bandGap,
    'Elements': material.elements,
    'Description': material.description,
    'POSCAR Content': material.poscarContent || 'No POSCAR content available.',
  };

  return (
    <div>
      <h1>Material ID: {materialId}</h1>
      <div>
        <h2>Material Properties</h2>
        <ul>
          {Object.entries(properties).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MaterialPage;