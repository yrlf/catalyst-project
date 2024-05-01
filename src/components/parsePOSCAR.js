import * as THREE from 'three';
export function parsePOSCAR(poscarContent) {
    if (!poscarContent) {
        console.error('No POSCAR content provided.');
        return { positions: [], elements: [] };
    }

    const lines = poscarContent.trim().split('\n');
    const scale = parseFloat(lines[1]);
    const latticeVectors = lines.slice(2, 5).map(line =>
        line.trim().split(/\s+/).map(num => parseFloat(num) * scale)
    );
 

    // Create 3D vectors for the lattice vectors
    const vecA = new THREE.Vector3(...latticeVectors[0]);
    const vecB = new THREE.Vector3(...latticeVectors[1]);
    const vecC = new THREE.Vector3(...latticeVectors[2]);

    const elements = lines[5].trim().split(/\s+/);
    const counts = lines[6].trim().split(/\s+/).map(Number);
    const coordinateStartIndex = 8; // Starting index of atom positions
    let positions = [];

    let totalAtomsProcessed = 0;
    elements.forEach((element, idx) => {
        for (let i = 0; i < counts[idx]; i++) {
            const coords = lines[coordinateStartIndex + totalAtomsProcessed].trim().split(/\s+/).map(parseFloat);
            // Convert fractional coordinates to Cartesian coordinates
            const position = new THREE.Vector3(
                coords[0] * vecA.x + coords[1] * vecB.x + coords[2] * vecC.x,
                coords[0] * vecA.y + coords[1] * vecB.y + coords[2] * vecC.y,
                coords[0] * vecA.z + coords[1] * vecB.z + coords[2] * vecC.z
            );
            positions.push({
                element: element,
                x: position.x,
                y: position.y,
                z: position.z
            });
            totalAtomsProcessed++;
        }
    });

    return { positions, elements };
}
