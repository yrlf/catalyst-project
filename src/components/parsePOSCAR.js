import * as THREE from 'three';

export function parsePOSCAR(poscarContent) {
    if (!poscarContent) {
        console.error('Invalid or empty POSCAR content provided.');
        return { positions: [], elements: [], bonds: [] };
    }

    const lines = poscarContent.trim().split('\n');

    if (lines.length < 11) {
        console.error('Insufficient data in POSCAR content.');
        return { positions: [], elements: [], bonds: [] };
    }

    // Parse lattice vectors
    const latticeVectors = [];
    for (let i = 2; i <= 4; i++) {
        const components = lines[i].trim().split(/\s+/).map(Number);
        latticeVectors.push(new THREE.Vector3(...components));
    }

    // Parse element types
    const elements = lines[5].trim().split(/\s+/);

    // Parse atom counts
    const atomCounts = lines[6].trim().split(/\s+/).map(Number);
    const totalAtoms = atomCounts.reduce((sum, num) => sum + num, 0);

    if (lines.length < 8 + totalAtoms) {
        console.error(`Not enough lines for atoms positions: expected ${8 + totalAtoms}, but got ${lines.length}`);
        return { positions: [], elements: [], bonds: [] };
    }

    // Initialize arrays to hold information about atoms
    const atoms = [];
    let currentElementIndex = 0;
    let atomIndex = 0;

    // Parse positions and create atom info
    for (let i = 8; i < 8 + totalAtoms; i++) {
        const fractional = lines[i].trim().split(/\s+/).map(Number);
        const cartesian = new THREE.Vector3(
            fractional[0] * latticeVectors[0].x + fractional[1] * latticeVectors[1].x + fractional[2] * latticeVectors[2].x,
            fractional[0] * latticeVectors[0].y + fractional[1] * latticeVectors[1].y + fractional[2] * latticeVectors[2].y,
            fractional[0] * latticeVectors[0].z + fractional[1] * latticeVectors[1].z + fractional[2] * latticeVectors[2].z
        );

        if (atomIndex >= atomCounts[currentElementIndex]) {
            atomIndex = 0;
            currentElementIndex++;
        }

        atoms.push({
            position: cartesian,
            element: elements[currentElementIndex],
            index: atomIndex
        });

        atomIndex++;
    }

    // Calculate bonds (for demonstration, we simply pair subsequent atoms)
    const bonds = [];
    for (let i = 0; i < atoms.length - 1; i++) {
        const bond = {
            atom1Index: i,
            atom2Index: i + 1,
            distance: atoms[i].position.distanceTo(atoms[i + 1].position)
        };
        bonds.push(bond);
    }

    console.log('Parsed atoms:', atoms);
    console.log('Parsed elements:', elements);
    console.log('Parsed bonds:', bonds);

    // Extract positions from atoms for return
    const positions = atoms.map(atom => atom.position);

    return { positions, elements, bonds };
}
