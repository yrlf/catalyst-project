import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AtomVisualizer = ({ positions, elements }) => {
    const mountRef = useRef(null);
    const cameraRef = useRef(new THREE.PerspectiveCamera(25, 1, 1, 1000));

    useEffect(() => {
        if (!positions || !elements || positions.length === 0 || elements.length === 0) {
            console.error('Positions or elements are undefined or empty.');
            return;
        }

        const scene = new THREE.Scene();
        const camera = cameraRef.current;
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setClearColor(0x888888); // Sets background color to grey

        const resizeRenderer = () => {
            if (mountRef.current) {
                const width = mountRef.current.clientWidth;
                const height = mountRef.current.clientHeight * 2; // Adjust height accordingly
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        };

        mountRef.current.appendChild(renderer.domElement);
        resizeRenderer();
        window.addEventListener('resize', resizeRenderer);

        const colors = {
            Cu: 0xff0000,
            C: 0x00ff00,
            O: 0x0000ff,
            default: 0xaaaaaa  // Default color for elements not listed
        };

        positions.forEach((pos, index) => {
            const element = elements[index] || 'default';
            const color = colors[element] || colors.default;
            const material = new THREE.MeshBasicMaterial({ color });
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(pos.x, pos.y, pos.z);
            scene.add(sphere);
        });

        const controls = new OrbitControls(camera, renderer.domElement);
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
            window.removeEventListener('resize', resizeRenderer);
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
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
        <div className="viewer-container" ref={mountRef} style={{ width: '50%', height: '50%', position: 'relative' }}>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
            <button onClick={handleResetView}>Reset View</button>
        </div>
    );
};

export default AtomVisualizer;
