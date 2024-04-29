import React, { useRef, useEffect } from 'react';
import * as $3Dmol from '3dmol';

const CrystalStructureViewer = ({ crystalData }) => {
    console.log(crystalData);
    const viewerRef = useRef(null);
    let viewer = null;  // Store the viewer in a mutable ref-like variable but outside of React state management.

    useEffect(() => {
        if (viewerRef.current && crystalData) {
            try {
                viewer = new $3Dmol.createViewer(viewerRef.current, {
                    backgroundColor: 'red'
                });

                const { abc, angles, sites } = crystalData;
                const cell = {
                    a: abc[0],
                    b: abc[1],
                    c: abc[2],
                    alpha: angles[0],
                    beta: angles[1],
                    gamma: angles[2]
                };

                if (viewer.addUnitCell) {
                    viewer.addUnitCell(cell);
                }

                sites.forEach(site => {
                    viewer.addSphere({
                        center: { x: site.a * abc[0], y: site.b * abc[1], z: site.c * abc[2] },
                        color: site.SP === 'C' ? 'black' : 'yellow',
                        radius: 0.5
                    });
                });

                viewer.zoomTo();
                viewer.render();
            } catch (error) {
                console.error("Error rendering viewer:", error);
            }
        }

        return () => {
            // Properly handle viewer cleanup to prevent memory leaks
            if (viewerRef.current) {
                viewerRef.current.innerHTML = '';  // Clears the inner HTML of the viewer container
            }
        };
    }, [crystalData]);

    return <div ref={viewerRef} style={{ width: '600px', height: '200px'}} />;
};

export default CrystalStructureViewer;
