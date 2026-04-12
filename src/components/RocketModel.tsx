import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Rocket = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 8;
    group.current.position.y = Math.sin(t / 1.5) / 10;
  });

  return (
    <group ref={group} dispose={null} scale={1.2}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.2} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.5, 1, 32]} />
        <meshStandardMaterial color="#F27D26" metalness={0.1} roughness={0.2} />
      </mesh>

      {/* Fins */}
      {[0, 120, 240].map((angle, i) => (
        <group key={i} rotation={[0, (angle * Math.PI) / 180, 0]}>
          <mesh position={[0.5, -0.7, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.1, 0.8, 0.5]} />
            <meshStandardMaterial color="#F27D26" metalness={0.1} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Window */}
      <mesh position={[0, 0.5, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Window Frame */}
      <mesh position={[0, 0.5, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Engine */}
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const RocketScene = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Float
          speed={1.5} 
          rotationIntensity={0.5} 
          floatIntensity={0.5} 
        >
          <Rocket />
        </Float>

        <Environment preset="city" />
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default RocketScene;
