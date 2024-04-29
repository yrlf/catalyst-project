// import React from 'react';
// import { useParams } from 'react-router-dom';
// import MaterialPropertiesPanel from './MaterialPropertiesPanel';
// import AtomVisualizer from './AtomVisualizer';
// import { parsePOSCAR } from './parsePOSCAR';
// import './Style.css';

// function MaterialPage() {
//   const { materialId } = useParams();

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

//   // Parse positions and elements
//   const { positions, elements,  bonds } = parsePOSCAR(poscarData);
  
//   const [inputID, setInputID] = useState('');

//   const properties = {
//     'Formula': 'CuCO3',
//     'Space Group': 'Pm-3m',
//     // ... other properties ...
//   };

//   return (
//     <div>
//       <h1>Material ID: {materialId}</h1>
//       <div>
//         <h1>Crystal Structure Visualization</h1>
//         <AtomVisualizer positions={positions} elements={elements} />
//       </div>
//       <MaterialPropertiesPanel properties={properties} />
//     </div>
//   );
// }

// export default MaterialPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MaterialPropertiesPanel from './MaterialPropertiesPanel';
import AtomVisualizer from './AtomVisualizer';
import axios from 'axios';
import './Style.css';

function MaterialPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState(null);
  console.log(materialId);
  useEffect(() => {
    // Fetch the material details using the materialId
    axios.get(`http://127.0.0.1:8083/api/detail`, { params: { id: materialId } })
      .then(response => {
        // Use the 'data' property from the response
        const materialDetails = response.data.data; // Note the .data.data due to the response structure
        setMaterial(materialDetails);
      })
      .catch(error => {
        console.error("Error fetching material details:", error);
      });
  }, [materialId]);

  // Show loading state until the material data is fetched
  if (!material) {
    return <div>Loading material details...</div>;
  }
  console.log(material);

  // Now, we use the fetched material data
  // This would replace the hard-coded POSCAR data from your initial example
  const properties = {
    'Formula': material.formulaPretty,
    // 'Space Group': material.structure,
    // 'Band Gap': material.bandGap,
    // 'Elements': material.elements,
    // 'Description': material.description,
    // Add other properties that you want to display
  };

  // Uncomment and update the following if you have the actual POSCAR data for visualization
  // const { positions, elements, bonds } = parsePOSCAR(material.poscar);

  return (
    <div>
      <h1>Material ID: {materialId}</h1>
      <div>
        <h1>Crystal Structure Visualization</h1>
        {/* Uncomment below when you have positions and elements for the AtomVisualizer */}
        {/* <AtomVisualizer positions={positions} elements={elements} /> */}
      </div>
      <MaterialPropertiesPanel properties={properties} />
    </div>
  );
}

export default MaterialPage;
