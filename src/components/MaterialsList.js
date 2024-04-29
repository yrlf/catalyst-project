import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8083';

function MaterialsList() {
  const [materials, setMaterials] = useState([]);  // 确保初始状态为数组

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = () => {
    axios.get('/api/list')
      .then((res) => {
        if (Array.isArray(res.data.data)) {  // 现在我们从res.data.data中获取数组
          setMaterials(res.data.data);  // 将数据设置为res.data.data
        } else {
          console.error('Data property is not an array:', res.data.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };
  

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
          {Array.isArray(materials) ? materials.map((material) => (  // 安全地调用 .map
            <tr key={material.id}>
              <td><Link to={`/material/${material.id}`}>{material.id}</Link></td>
              <td>{material.formulaPretty}</td>
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
