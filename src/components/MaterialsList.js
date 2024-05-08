// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import SearchBar from './SearchBar';  // Assuming SearchBar is in the same directory

// function MaterialsList() {
//   const [materials, setMaterials] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const materialsPerPage = 10;

//   const fetchMaterials = (search = '') => {
//     axios.get(`/api/list?search=${search}`)
//       .then((res) => {
//         if (res.data.status === 0 && Array.isArray(res.data.data)) {
//           const processedMaterials = res.data.data.map(material => ({
//             ...material
//           }));
//           setMaterials(processedMaterials);
//         } else {
//           console.error('Error or invalid data:', res.data);
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching data:', err);
//       });
//   };

//   useEffect(() => {
//     fetchMaterials(searchTerm);
//   }, [searchTerm]);

//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
//     setCurrentPage(0); // Reset to the first page upon searching
//   };

//   const indexOfLastMaterial = (currentPage + 1) * materialsPerPage;
//   const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
//   const currentMaterials = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);

//   const goToNextPage = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div>
//       <h2>Materials Database</h2>
//       <SearchBar onSearch={handleSearch} />
//       <table>
//         <thead>
//           <tr>
//             <th>Material ID</th>
//             <th>Formula Pretty</th>
//             <th>Elements</th>
//             <th>Band Gap (eV)</th>
//             <th>Energy Above Hull</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentMaterials.length > 0 ? currentMaterials.map((material, index) => (
//             <tr key={index}>
//               <td>{material.material_id !== 'N/A' ? <Link to={`/detail/${material.material_id}`}>{material.material_id}</Link> : 'N/A'}</td>
//               <td>{material.formula_pretty}</td>
//               <td>{material.element}</td>
//               <td>{material.band_gap !== 'N/A' ? parseFloat(material.band_gap).toFixed(4) : 'N/A'}</td>
//               <td>{material.energy_above_hull !== 'N/A' ? parseFloat(material.energy_above_hull).toFixed(4) : 'N/A'}</td>
//             </tr>
//           )) : <tr><td colSpan="5">No data available</td></tr>}
//         </tbody>
//       </table>
//       <div>
//         <button onClick={goToPreviousPage} disabled={currentPage === 0}>Previous</button>
//         <button onClick={goToNextPage} disabled={currentPage >= Math.ceil(materials.length / materialsPerPage) - 1}>Next</button>
//       </div>
//     </div>
//   );
// }

// export default MaterialsList;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';

function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const materialsPerPage = 10;

  const fetchMaterials = (search = '', page = 1) => {
    axios.get(`/api/list?search=${search}&page=${page}&per_page=${materialsPerPage}`)
      .then((res) => {
        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setMaterials(res.data.data);
          setCurrentPage(res.data.page);
          setTotalPages(Math.ceil(res.data.total / materialsPerPage));
        } else {
          console.error('Error or invalid data:', res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchMaterials('', currentPage);
  }, [currentPage]);

  const handleSearch = (searchValue) => {
    fetchMaterials(searchValue, 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Materials Database</h2>
      <SearchBar onSearch={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Material ID</th>
            <th>Formula Pretty</th>
            <th>Elements</th>
            <th>Band Gap (eV)</th>
            <th>Energy Above Hull (eV)</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 ? materials.map((material, index) => (
            <tr key={index}>
              <td>{material.material_id !== 'N/A' ? <Link to={`/detail/${material.material_id}`}>{material.material_id}</Link> : 'N/A'}</td>
              <td>{material.formula_pretty}</td>
              <td>{material.elements}</td>
              <td>{material.band_gap !== 'N/A' ? parseFloat(material.band_gap).toFixed(4) : 'N/A'}</td>
              <td>{material.energy_above_hull !== 'N/A' ? parseFloat(material.energy_above_hull).toFixed(4) : 'N/A'}</td>
            </tr>
          )) : <tr><td colSpan="5">No data available</td></tr>}
        </tbody>
      </table>
      <div>
        <button onClick={goToPreviousPage} disabled={currentPage <= 1}>Previous</button>
        <button onClick={goToNextPage} disabled={currentPage >= totalPages}>Next</button>
      </div>
    </div>
  );
}

export default MaterialsList;
