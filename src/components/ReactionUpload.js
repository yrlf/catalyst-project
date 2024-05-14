import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import SearchBarReaction from './SearchBarReaction';

function ReactionUpload() {
  const [reactantResults, setReactantResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [selectedReactants, setSelectedReactants] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [reactionType, setReactionType] = useState('');
  const reactantInputRef = useRef(null);
  const productInputRef = useRef(null);

  const searchMaterials = useCallback((term, setResult) => {
    if (!term.trim()) {
      setResult([]);
      return;
    }
    axios.get(`/api/list?search=${term}&page=1&per_page=10`)
      .then(res => {
        if (res.data.status === 200 && Array.isArray(res.data.data)) {
          setResult(res.data.data);
        } else {
          console.error('Error or invalid data:', res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);

  const handleSelectReactant = reactant => {
    if (!selectedReactants.some(r => r.material_id === reactant.material_id)) {
      setSelectedReactants(current => [...current, reactant]);
    }
    setReactantResults([]);
    reactantInputRef.current.value = "";
  };

  const handleSelectProduct = product => {
    if (!selectedProducts.some(p => p.material_id === product.material_id)) {
      setSelectedProducts(current => [...current, product]);
    }
    setProductResults([]);
    productInputRef.current.value = "";
  };

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reactionType', reactionType);

    try {
      const response = await axios.post('http://127.0.0.1:8083/api/uploadPOSCAR', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File and reaction type uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const removeReactant = material_id => {
    setSelectedReactants(current => current.filter(r => r.material_id !== material_id));
  };

  const removeProduct = material_id => {
    setSelectedProducts(current => current.filter(p => p.material_id !== material_id));
  };

  return (
    <div>
      <h2>Upload Reaction Details</h2>
      <div>
        Select reactants for the reaction:
        <SearchBarReaction ref={reactantInputRef} placeholder="Search Reactants..." onSearch={(term) => searchMaterials(term, setReactantResults)} />
        <ul>
          {reactantResults.map(reactant => (
            <li key={reactant.material_id}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "lightgrey"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => handleSelectReactant(reactant)}>
              {reactant.formula_pretty}
            </li>
          ))}
        </ul>
      </div>
      <div>
        Select products for the reaction:
        <SearchBarReaction ref={productInputRef} placeholder="Search Products..." onSearch={(term) => searchMaterials(term, setProductResults)} />
        <ul>
          {productResults.map(product => (
            <li key={product.material_id}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "lightgrey"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                onClick={() => handleSelectProduct(product)}>
              {product.formula_pretty}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>POSCAR File (optional):
          <input type="file" onChange={handleFileChange} />
        </label>
        <label>Reaction Type:
          <select value={reactionType} onChange={e => setReactionType(e.target.value)}>
            <option value="">Select a type</option>
            <option value="ORR">Oxygen Reduction Reaction (ORR)</option>
            <option value="HER">Hydrogen Evolution Reaction (HER)</option>
          </select>
        </label>
        <button onClick={handleSubmit}>Upload Reaction and File</button>
      </div>
      <h3>Selected Reactants:</h3>
      <ul>
        {selectedReactants.map(reactant => (
          <li key={reactant.material_id}>
            {reactant.formula_pretty} <button onClick={() => removeReactant(reactant.material_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Selected Products:</h3>
      <ul>
        {selectedProducts.map(product => (
          <li key={product.material_id}>
            {product.formula_pretty} <button onClick={() => removeProduct(product.material_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReactionUpload;
