import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const shapes = [
  () => new THREE.BoxGeometry(),
  () => new THREE.SphereGeometry(0.75, 32, 32),
  () => new THREE.ConeGeometry(0.5, 1, 32),
  () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
  () => new THREE.TorusGeometry(0.4, 0.15, 16, 100),
  () => new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
];

function getRandomColor() {
  return Math.floor(Math.random() * 16777215); // Color aleatorio en formato hexadecimal
}

function ThreeScene() {
  const mountRef = useRef(null);
  const [scene] = useState(new THREE.Scene());
  const [geometry, setGeometry] = useState(() => shapes[0]());
  const [material, setMaterial] = useState(new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    wireframe: true,
  }));

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Crear cámara y renderizador
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Crear malla y añadirla a la escena
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Cambia el tamaño del canvas cuando la ventana cambia de tamaño
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      scene.remove(mesh);
    };
  }, [geometry, material, scene]);

  const changeShape = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)]();
    setGeometry(randomShape);
  };

  const changeColor = () => {
    const newColor = getRandomColor();
    const newMaterial = new THREE.MeshBasicMaterial({ color: newColor, wireframe: true });
    setMaterial(newMaterial);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={changeShape}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "blue",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Change Shape
        </button>
        <button
          onClick={changeColor}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "white",
            backgroundColor: "green",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Change Color
        </button>
      </div>
    </div>
  );
}

export default ThreeScene;
