import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';

// Define a React component that will represent an atom
const Atom = ({ position, element }) => {
  const color = element === 'C' ? 'black' : 'yellow'; // Color carbon black, sulfur yellow
  return (
    <mesh position={position}>
      <Sphere args={[0.2, 32, 32]}>
        <meshStandardMaterial color={color} />
      </Sphere>
    </mesh>
  );
};

function MaterialVisualization() {
  // Define the crystal structure data with additional atoms for a more filled visualization
  const crystalData = {
    abc: [4.717805, 4.717805, 9.851257], // Lattice constants a, b, and c
    sites: [
      { SP: 'C', a: 0, b: 0, c: 0 },
      { SP: 'C', a: 0.5, b: 0.5, c: 0.5 },
      { SP: 'S', a: 0.818479, b: 0.818479, c: 0.886867 },
      { SP: 'S', a: 0.681521, b: 0.681521, c: 0.386867 },
      { SP: 'S', a: 0.318479, b: 0.318479, c: 0.613133 },
      // Replicate the existing atoms to fill the space more
      { SP: 'C', a: 0, b: 0.5, c: 0 },
      { SP: 'C', a: 0.5, b: 0, c: 0.5 },
      { SP: 'S', a: 0.818479, b: 0.318479, c: 0.886867 },
      { SP: 'S', a: 0.181521, b: 0.681521, c: 0.113133 },
      { SP: 'S', a: 0.681521, b: 0.181521, c: 0.386867 },
      // Add more atoms if necessary
    ],
  };


 // The atoms will be represented by spheres, positioned according to their 'a', 'b', 'c' coordinates
 const atoms = crystalData.sites.map((site, index) => {
    // Convert fractional coordinates to Cartesian
    const position = [
      site.a * crystalData.abc[0],
      site.b * crystalData.abc[1],
      site.c * crystalData.abc[2]
    ];
    return <Atom key={index} position={position} element={site.SP} />;
  });

  // Define camera position
  const cameraPosition = [0, 0, 15]; // Adjust as necessary to fit all atoms

  return (
    <Canvas camera={{ position: cameraPosition }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {atoms}
      <OrbitControls /> {/* Enables camera control: rotate, pan, zoom */}
    </Canvas>
  );
}

export default MaterialVisualization;
