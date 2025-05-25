'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { Blob3D } from './Blob3D';

interface Scene3DProps {
  className?: string;
  enableControls?: boolean;
  children?: React.ReactNode;
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#3b82f6" />
    </>
  );
}

function FallbackLoader() {
  return (
    <mesh>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} wireframe />
    </mesh>
  );
}

export function Scene3D({ className = '', enableControls = false, children }: Scene3DProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<FallbackLoader />}>
          <SceneLighting />
          {children || <Blob3D />}
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          )}
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
