import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';



function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const materialsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMaterials = useCallback((search, page) => {
    console.log(`Fetching: search=${search}, page=${page}`);
    axios.get(`/api/list?search=${search}&page=${page}&per_page=${materialsPerPage}`)
      .then((res) => {
        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setMaterials(res.data.data);
          setTotal(res.data.total);
          setTotalPages(Math.ceil(res.data.total / materialsPerPage));
        } else {
          console.error('Error or invalid data:', res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, []);

  useEffect(() => {
    fetchMaterials(searchTerm, currentPage);
  }, [searchTerm, currentPage, fetchMaterials]);

  const handleSearch = (searchValue) => {
    // 更新状态以触发新的搜索
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };
  
  // const handleSearch = (searchValue) => {
  //   // 设置搜索词和页码在同一个更新周期内完成
  //   setSearchTerm(prev => {
  //     // setCurrentPage(1);
  //     return searchValue;
  //   });
  // };
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
    <button key={page} onClick={() => goToPage(page)} disabled={currentPage === page}>
      {page}
    </button>
  ));

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
            <th>Energy Above Hull</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, index) => (
            <tr key={index}>
              <td>{material.material_id !== 'N/A' ? <Link to={`/detail/${material.material_id}`}>{material.material_id}</Link> : 'N/A'}</td>
              <td>{material.formula_pretty}</td>
              <td>{material.elements}</td>
              <td>{material.band_gap !== 'N/A' ? parseFloat(material.band_gap).toFixed(4) : 'N/A'}</td>
              <td>{material.energy_above_hull !== 'N/A' ? parseFloat(material.energy_above_hull).toFixed(4) : 'N/A'}</td>
            </tr>
          ))}
          {materials.length === 0 && <tr><td colSpan="5">No data available</td></tr>}
        </tbody>
      </table>
      <div>{pageNumbers}</div>
      <div>Total Materials: {total}</div>
    </div>
  );
}

export default MaterialsList;
