import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';  // Assuming SearchBar is in the same directory

function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const materialsPerPage = 10;

  const fetchMaterials = (search = '') => {
    axios.get(`/api/list?search=${search}`)
      .then((res) => {
        if (res.data.status === 0 && Array.isArray(res.data.data)) {
          const processedMaterials = res.data.data.map(material => ({
            ...material
          }));
          setMaterials(processedMaterials);
        } else {
          console.error('Error or invalid data:', res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  };

  useEffect(() => {
    fetchMaterials(searchTerm);
  }, [searchTerm]);

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(0); // Reset to the first page upon searching
  };

  const indexOfLastMaterial = (currentPage + 1) * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <h2>Metal-free Catalyst Material Database</h2>
      <p>Contact: Yang Zhou</p>
        <p>Email: yang.zhou@unsw.edu.au </p>


    </div>
  );
}

export default MaterialsList;
