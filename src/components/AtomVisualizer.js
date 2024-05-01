import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AtomVisualizer = ({ positions, elements }) => {
    const mountRef = useRef(null);
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    useEffect(() => {
        if (!positions || !elements || positions.length === 0 || elements.length === 0) {
            console.error('Positions or elements are undefined or empty.');
            return;
        }

        const scene = new THREE.Scene();
        const camera = cameraRef.current; // Use camera from the ref
        camera.position.z = 50; // Adjust this value to ensure all atoms are visible initially

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        const colors = {
            Cu: 0xff0000,
            C: 0x00ff00,
            O: 0x0000ff,
            default: 0xaaaaaa  // Default color for elements not listed,
        };

        positions.forEach((pos, index) => {
            const element = pos['element'];
            const color = colors[element] || colors.default;

            const material = new THREE.MeshBasicMaterial({ color });
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(pos.x, pos.y, pos.z);
            scene.add(sphere);
        });

        const controls = new OrbitControls(camera, renderer.domElement); // Correctly reference camera here
        controls.enableZoom = false;

        mountRef.current.addEventListener('mouseenter', () => {
            controls.enableZoom = true;
        });

        mountRef.current.addEventListener('mouseleave', () => {
            controls.enableZoom = false;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
                scene.remove(child);
            });
            controls.dispose();
        };
    }, [positions, elements]);

    const handleZoomIn = () => {
        cameraRef.current.fov *= 0.9;
        cameraRef.current.updateProjectionMatrix();
    };

    const handleZoomOut = () => {
        cameraRef.current.fov /= 0.9;
        cameraRef.current.updateProjectionMatrix();
    };

    const handleResetView = () => {
        cameraRef.current.position.set(0, 0, 10);
        cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
        cameraRef.current.updateProjectionMatrix();
    };

    return (
        <div className="viewer-container" ref={mountRef}>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
            <button onClick={handleResetView}>Reset View</button>
        </div>
    );
};

export default AtomVisualizer;
