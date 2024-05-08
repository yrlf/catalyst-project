import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './AtomVisualizer.css';

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
            H: 0xFFFFFF, // Hydrogen - White
            He: 0xD9FFFF, // Helium - Pale Cyan
            Li: 0xCC80FF, // Lithium - Pale Purple
            Be: 0xC2FF00, // Beryllium - Light Green
            B: 0xFFB5B5, // Boron - Light Pink
            C: 0x0055FF, // Carbon - Deep Blue
            N: 0x3050F8, // Nitrogen - Dark Blue
            O: 0xFF0D0D, // Oxygen - Red
            F: 0x90E050, // Fluorine - Light Green
            Ne: 0xB3E3F5, // Neon - Light Blue
            Na: 0xAB5CF2, // Sodium - Violet
            Mg: 0x8AFF00, // Magnesium - Bright Green
            Al: 0xBFA6A6, // Aluminum - Rosy
            Si: 0xF0C8A0, // Silicon - Light Brown
            P: 0xFF8000, // Phosphorus - Orange
            S: 0xFFFF30, // Sulfur - Yellow
            Cl: 0x1FF01F, // Chlorine - Bright Green
            Ar: 0x80D1E3, // Argon - Pale Blue
            K: 0x8F40D4, // Potassium - Purple
            Ca: 0x3DFF00, // Calcium - Bright Green
            Sc: 0xE6E6E6, // Scandium - Silver
            Ti: 0xBFC2C7, // Titanium - Silver
            V: 0xA6A6AB, // Vanadium - Steel Grey
            Cr: 0x8A99C7, // Chromium - Pale Blue
            Mn: 0x9C7AC7, // Manganese - Pale Purple
            Fe: 0xE06633, // Iron - Rust
            Co: 0xF090A0, // Cobalt - Pink
            Ni: 0x50D050, // Nickel - Light Green
            Cu: 0xC88033, // Copper - Copper
            Zn: 0x7D80B0, // Zinc - Light Gray
            Ga: 0xC28F8F, // Gallium - Rose
            Ge: 0x668F8F, // Germanium - Blue-Green
            As: 0xBD80E3, // Arsenic - Light Purple
            Se: 0xFFA100, // Selenium - Orange
            Br: 0xA62929, // Bromine - Dark Red
            Kr: 0x5CB8D1, // Krypton - Light Blue
            default: 0xAAAAAA  // Default color for elements not listed
        };
        
        

        positions.forEach((pos, index) => {
            const element = pos['element']|| 'default';
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
            <div className="controls-container">
                <button onClick={handleZoomIn}>Zoom In</button>
                <button onClick={handleZoomOut}>Zoom Out</button>
                <button onClick={handleResetView}>Reset View</button>
            </div>
        </div>
    );
};

export default AtomVisualizer;
