import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MaterialPropertiesPanel from './MaterialPropertiesPanel';
import AtomVisualizer from './AtomVisualizer';
import { parsePOSCAR } from './parsePOSCAR';
import './Style.css';
const apiBaseUrl = 'http://127.0.0.1:8083'; // This can also be moved to a .env file to manage configurations

function MaterialPage() {
    const { materialId } = useParams();
    const [material, setMaterial] = useState(null);
    const [crystalData, setCrystalData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterialDetails = async () => {
            if (!materialId) return;

            try {
                const response = await axios.get(`${apiBaseUrl}/api/detail`, { params: { id: materialId } });
                const materialDetails = response.data.data;
                if (materialDetails && materialDetails.poscarContent) {
                    const parsedData = parsePOSCAR(materialDetails.poscarContent);
                    setMaterial(materialDetails);
                    setCrystalData(parsedData);
                } else {
                    setMaterial(materialDetails);
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching material details:", err);
                const message = err.response ? err.response.data.message : err.message;
                setError("Failed to fetch material details: " + message);
            }
        };

        fetchMaterialDetails();
    }, [materialId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!material) {
        return <div>Loading material details...</div>;
    }
    console.log(material);
    const properties = {
        'Band Gap': material.band_gap,
        'Pretty Formula': material.formula_pretty,
        'Elements': material.elements,
        
        'Description': material.description,
        // 'POSCAR Content': material.poscarContent || 'No POSCAR content available.'
    };

    return (
        <div>
            <h1>Material ID: {materialId}</h1>
            <MaterialPropertiesPanel properties={properties} />
            {crystalData && (
                <div>
                    <h2>Crystal Structure Visualization</h2>
                    <AtomVisualizer positions={crystalData.positions} elements={crystalData.elements} />
                </div>
            )}
        </div>
    );
}

export default MaterialPage;
