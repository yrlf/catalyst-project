import React, { useState } from 'react';
import axios from 'axios';

function MaterialUpload() {
  const [file, setFile] = useState(null);
  const [materialId, setMaterialId] = useState("");
  const [prettyFormula, setPrettyFormula] = useState("");
  const [elements, setElements] = useState("");
  const [bandGap, setBandGap] = useState("");
  const [structure, setStructure] = useState("");
  const [description, setDescription] = useState("");
  const [poscarId, setPoscarId] = useState("");

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const uploadMaterialDetails = async (currentPoscarId) => {
    const materialData = {
      material_id: materialId,
      formula_pretty: prettyFormula,
      elements: elements,
      bandGap: bandGap,
      structure: structure,
      description: description,
      poscar: currentPoscarId,
      upload_from_page: 1
    };

    try {
      await axios.post('http://127.0.0.1:8083/api/upload', materialData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Material Details Uploaded Successfully');
    } catch (error) {
      console.error('Error uploading material details:', error);
      alert('Error uploading material details');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
  
    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', file);
      fileFormData.append('material_id', materialId);

      try {
        const fileResponse = await axios.post('http://127.0.0.1:8083/api/uploadPOSCAR', fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (fileResponse.data && fileResponse.data.data && fileResponse.data.data.id) {
          const poscarId = fileResponse.data.data.id;
          setPoscarId(poscarId);
          uploadMaterialDetails(poscarId);
          alert('POSCAR File uploaded successfully');
        } else {
          alert('Failed to upload POSCAR file or no ID returned.');
        }
  
      } catch (error) {
        console.error('Error uploading POSCAR file:', error);
        alert('Error uploading POSCAR file');
      }
    } else {
      uploadMaterialDetails(poscarId);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', gap: '10px' }}>
        
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Material ID:</label>
          <input type="text" placeholder="Material ID" value={materialId} onChange={e => setMaterialId(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Pretty Formula:</label>
          <input type="text" placeholder="Pretty Formula (MUST *)" value={prettyFormula} onChange={e => setPrettyFormula(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Elements:</label>
          <input type="text" placeholder="Elements in the structure, e.g., [Element Mn, Element O]" value={elements} onChange={e => setElements(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Band Gap (eV):</label>
          <input type="text" placeholder="Band Gap (eV) e.g., 0.1234" value={bandGap} onChange={e => setBandGap(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Structure:</label>
          <input type="text" placeholder="Structure" value={structure} onChange={e => setStructure(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Description:</label>
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label style={{ fontWeight: 'bold' }}>
            POSCAR File (optional):
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>
        <div>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
  
}

export default MaterialUpload;