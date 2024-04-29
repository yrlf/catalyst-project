import React, { useRef, useEffect } from 'react';
import * as $3Dmol from '3dmol';

const MoleculeViewer = ({ smiles }) => {
    const viewerRef = useRef(null);

    useEffect(() => {
        let viewer;

        if (viewerRef.current) {
            // Initialize viewer
            viewer = new $3Dmol.createViewer(viewerRef.current, {
                backgroundColor: 'white'
            });

            if (smiles) {
                // Load a molecule from a SMILES string if provided
                viewer.addModel(smiles, "smiles", {
                    keepH: true
                });
                viewer.setStyle({}, { stick: {} });
                viewer.zoomTo();
                viewer.render();
            }
        }

        return () => {
            // Cleanup
            if (viewer && typeof viewer.destroy === 'function') {
                viewer.destroy();
            }
        };
    }, [smiles]); // Re-run the effect if smiles changes

    return (
        <div ref={viewerRef} style={{ width: '400px', height: '200px' }} />
    );
};

export default MoleculeViewer;
