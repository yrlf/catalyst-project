import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Setting the base URL for all axios requests
axios.defaults.baseURL = 'http://127.0.0.1:8083';

function MaterialsList() {
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = () => {
    axios.get('/api/list')
      .then((res) => {
        console.log("API Response:", res.data);
        if (Array.isArray(res.data.data)) {
          // Define default structure
          const defaultMaterial = {
            material_id: 'N/A',
            formula_pretty: 'N/A',
            elements: 'N/A',
            bandGap: 'N/A',
            structure: 'N/A'
          };
          // Merge each material with the default structure to ensure all keys exist
          const processedMaterials = res.data.data.map(material => ({
            ...defaultMaterial,
            ...material
          }));
          setMaterials(processedMaterials);
        } else {
          console.error('Data property is not an array:', res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div>
      <h2>Materials Database</h2>
      <table>
        <thead>
          <tr>
            <th>Material ID</th>
            <th>Formula Pretty</th>
            <th>Elements</th>
            <th>Band Gap (eV)</th>
            <th>Structure</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 ? materials.map((material, index) => (
            <tr key={index}>
              <td>{material.material_id !== 'N/A' ? <Link to={`/material/${material.material_id}`}>{material.material_id}</Link> : 'N/A'}</td>
              <td>{material.formula_pretty}</td>
              <td>{material.elements}</td>
              <td>{material.bandGap}</td>
              <td>{material.structure}</td>
            </tr>
          )) : <tr><td colSpan="5">No data available</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsList;
