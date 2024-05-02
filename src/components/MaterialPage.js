import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MaterialPropertiesPanel from './MaterialPropertiesPanel';
import AtomVisualizer from './AtomVisualizer';
import { parsePOSCAR } from './parsePOSCAR';  // Assuming parsePOSCAR is properly exported
import './Style.css';

function MaterialPage() {
    const { materialId } = useParams();
    const [material, setMaterial] = useState(null);
    const [crystalData, setCrystalData] = useState(null);
    const [error, setError] = useState(null); // State to store any error

    useEffect(() => {
        if (materialId) {
            axios.get(`/api/detail`, { params: { id: materialId } })
                .then(response => {
                    const materialDetails = response.data.data;
                    if (materialDetails && materialDetails.poscarContent) {
                        const parsedData = parsePOSCAR(materialDetails.poscarContent);
                        setMaterial(materialDetails);
                        setCrystalData(parsedData);
                    } else {
                        setMaterial(materialDetails);
                    }
                    setError(null); // Reset error on successful fetch
                })
                .catch(error => {
                    console.error("Error fetching material details:", error);
                    setError("Failed to fetch material details."); // Set error message
                });
        }
    }, [materialId]);

    if (error) {
        return <div>Error: {error}</div>; // Display error message if there is an error
    }

    if (!material) {
        return <div>Loading material details...</div>;
    }

    const properties = {
        // 'Space Group': material.structure,
        'Band Gap': material.bandGap,
        'Elements': material.elements,
        'Description': material.description,
        'POSCAR Content': material.poscarContent || 'No POSCAR content available.'
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
