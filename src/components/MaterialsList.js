import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Setting the base URL for all axios requests
axios.defaults.baseURL = 'http://127.0.0.1:8083';

function MaterialsList() {
  const [materials, setMaterials] = useState([]);  // Initialize materials as an empty array

  // Function to fetch materials data from the API
  // const fetchMaterials = () => {
  //   axios.get('/api/list')
  //     .then((res) => {
  //       console.log("API Response:", res.data); // Logging the API response
  //       if (Array.isArray(res.data.data)) {  // Check if the received data is an array
  //         setMaterials(res.data.data);  // Update the materials state with the fetched data
  //       } else {
  //         console.error('Data property is not an array:', res.data.data);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching data:', err);  // Log any errors during the fetch
  //     });
  // };

  const fetchMaterials = () => {
    axios.get('/api/list')
      .then((res) => {
        console.log("API Response:", res.data); // Logging the API response
        if (Array.isArray(res.data.data)) {  // Check if the received data is an array
          setMaterials(res.data.data);  // Update the materials state with the fetched data
        } else {
          console.error('Data property is not an array:', res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);  // Log any errors during the fetch
      });
};

  // useEffect hook to fetch materials data when the component mounts
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Render the component
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
          {materials.length > 0 ? materials.map((material) => (
            <tr key={material.id}>
              <td><Link to={`/material/${material.id}`}>{material.id}</Link></td>
              <td>{material.prettyFormula}</td>
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
