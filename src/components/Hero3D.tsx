import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera,
  OrbitControls,
  ContactShadows,
  Environment
} from '@react-three/drei';

function Interface() {
  return (
    <group rotation={[-0.2, -0.4, 0]}>
      {/* Main Interface Plane */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>

      {/* Floating Icons */}
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-1.5, 1, 0.3]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#F27D26" emissive="#F27D26" emissiveIntensity={0.5} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[1.5, -0.8, 0.4]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial color="#90C8C2" />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[0.8, 1.2, 0.5]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#A855F7" />
        </mesh>
      </Float>

      {/* Interface Elements */}
      <mesh position={[-1, 0, 0.1]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshStandardMaterial color="#F3F4F6" />
      </mesh>
      <mesh position={[-1, -0.4, 0.1]}>
        <planeGeometry args={[1.5, 0.2]} />
        <meshStandardMaterial color="#F3F4F6" />
      </mesh>
      
      <mesh position={[1, 0.5, 0.1]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#E5E7EB" />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <Interface />
          <Environment preset="city" />
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
