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

  // const handleSubmit = async event => {
  //   event.preventDefault();

  //   if (file) {
  //     const fileFormData = new FormData();
  //     fileFormData.append('file', file);

  //     try {
  //       const fileResponse = await axios.post('http://127.0.0.1:8083/api/uploadPOSCAR', fileFormData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       });

  //       if (fileResponse.data && fileResponse.data.data && fileResponse.data.data.id) {
  //         const poscarId = fileResponse.data.data.id;
  //         setPoscarId(poscarId);
  //         uploadMaterialDetails(poscarId); // Upload material details after POSCAR is uploaded
  //         alert('POSCAR File uploaded successfully');
  //       } else {
  //         alert('Failed to upload POSCAR file or no ID returned.');
  //       }

  //     } catch (error) {
  //       console.error('Error uploading POSCAR file:', error);
  //       alert('Error uploading POSCAR file');
  //     }
  //   } else {
  //     uploadMaterialDetails(poscarId); // If no POSCAR file, upload material details with current poscarId (may be empty)
  //   }
  // };
  const handleSubmit = async event => {
    event.preventDefault();
  
    if (file) {
      const fileFormData = new FormData();
      fileFormData.append('file', file);
      fileFormData.append('material_id', materialId);  // Add material_id to FormData

      try {
        const fileResponse = await axios.post('http://127.0.0.1:8083/api/uploadPOSCAR', fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (fileResponse.data && fileResponse.data.data && fileResponse.data.data.id) {
          const poscarId = fileResponse.data.data.id;
          setPoscarId(poscarId);
          uploadMaterialDetails(poscarId); // Upload material details after POSCAR is uploaded
          alert('POSCAR File uploaded successfully');
        } else {
          alert('Failed to upload POSCAR file or no ID returned.');
        }
  
      } catch (error) {
        console.error('Error uploading POSCAR file:', error);
        alert('Error uploading POSCAR file');
      }
    } else {
      uploadMaterialDetails(poscarId); // If no POSCAR file, upload material details with current poscarId (may be empty)
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        POSCAR File (optional):
        <input type="file" onChange={handleFileChange} />
      </label>
      <input type="text" placeholder="Material ID" value={materialId} onChange={e => setMaterialId(e.target.value)} />
      <input type="text" placeholder="Pretty Formula" value={prettyFormula} onChange={e => setPrettyFormula(e.target.value)} />
      <input type="text" placeholder="Elements" value={elements} onChange={e => setElements(e.target.value)} />
      <input type="text" placeholder="Band Gap (eV)" value={bandGap} onChange={e => setBandGap(e.target.value)} />
      <input type="text" placeholder="Structure" value={structure} onChange={e => setStructure(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default MaterialUpload;
