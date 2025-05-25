'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface Blob3DProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
}

export function Blob3D({
  position = [0, 0, 0],
  scale = 1,
  color = '#3b82f6',
  wireframe = false,
}: Blob3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  // Create sphere geometry with more vertices for better morphing
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    return geo;
  }, []);

  // Animated spring for scale and rotation
  const { rotation, meshScale } = useSpring({
    rotation: [0, 0, 0] as [number, number, number],
    meshScale: scale,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Animation loop for morphing and mouse interaction
  useFrame(state => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mouse interaction
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    // Smooth rotation based on mouse position
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouseY * 0.1,
      0.02
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouseX * 0.1,
      0.02
    );

    // Morphing animation
    const positions = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);

      // Create organic morphing effect
      const noise =
        Math.sin(vertex.x * 2 + time * 0.5) * 0.1 +
        Math.sin(vertex.y * 3 + time * 0.7) * 0.05 +
        Math.sin(vertex.z * 1.5 + time * 0.3) * 0.08;

      vertex.normalize().multiplyScalar(1 + noise);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <animated.mesh ref={meshRef} position={position} scale={meshScale} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.8}
      />
    </animated.mesh>
  );
}
