import React, { useState } from 'react';
import axios from 'axios';

function MaterialUpload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: '', value: '' }]);
  };

  const handleFieldChange = (index, side, value) => {
    const newFields = additionalFields.map((field, i) => {
      if (i === index) {
        return { ...field, [side]: value };
      }
      return field;
    });
    setAdditionalFields(newFields);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    additionalFields.forEach(field => {
      if (field.key && field.value) {
        formData.append(field.key, field.value);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File Uploaded Successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        File:
        <input type="file" onChange={handleFileChange} />
      </label>
      <br />
      <label>
        Description:
        <input type="text" value={description} onChange={handleDescriptionChange} />
      </label>
      {additionalFields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Property name"
            value={field.key}
            onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={handleAddField}>Add Field</button>
      <br />
      <button type="submit">Upload</button>
    </form>
  );
}

export default MaterialUpload;
