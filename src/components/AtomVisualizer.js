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
        const camera = cameraRef.current;
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        const colors = {
            Cu: 0xff0000,
            C: 0x00ff00,
            O: 0x0000ff
        };

        const geometries = [];
        const materials = [];
        const spheres = [];

        positions.forEach((pos, index) => {
            const element = elements[index];
            const color = colors[element] || 0xaaaaaa;
            const material = new THREE.MeshBasicMaterial({ color });
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(pos);
            scene.add(sphere);
            geometries.push(geometry);
            materials.push(material);
            spheres.push(sphere);
        });

        const maxBondLength = 3.5; // Define a maximum bond length
        positions.forEach((pos, i) => {
            positions.slice(i + 1).forEach((otherPos, j) => {
                if (pos.distanceTo(otherPos) < maxBondLength) {
                    const bondGeometry = new THREE.BufferGeometry().setFromPoints([pos, otherPos]);
                    const bondMaterial = new THREE.LineBasicMaterial({ color: 0x999999 });
                    const bond = new THREE.Line(bondGeometry, bondMaterial);
                    scene.add(bond);
                    geometries.push(bondGeometry);
                    materials.push(bondMaterial);
                }
            });
        });

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // return () => {
        //     mountRef.current.removeChild(renderer.domElement);
        //     renderer.dispose();
        //     scene.children.forEach(child => scene.remove(child));
        //     geometries.forEach(geom => geom.dispose());
        //     materials.forEach(mat => mat.dispose());
        //     controls.dispose();
        // };
        return () => {
            if (mountRef.current) {  // 确保引用仍然指向 DOM 元素
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.children.forEach(child => {
                scene.remove(child);
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (child.material instanceof Array) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            controls.dispose();
        };
        
    }, [positions, elements]); // Ensure to include proper dependencies or remove if not needed to run only once

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
            <div className="viewer-buttons">
                <button className="viewer-button" onClick={handleZoomIn}>Zoom In</button>
                <button className="viewer-button" onClick={handleZoomOut}>Zoom Out</button>
                <button className="viewer-button" onClick={handleResetView}>Reset View</button>
            </div>
            {/* ...Three.js canvas will be appended here */}
        </div>
    );
};

export default AtomVisualizer;
