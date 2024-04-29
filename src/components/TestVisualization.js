import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function TestVisualization() {
  return (
    <Canvas style={{ height: '500px' }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'orange'} />
      </mesh>
    </Canvas>
  );
}

export default TestVisualization;
