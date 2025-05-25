'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface Blob3DProps {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  wireframe?: boolean;
  onReady?: () => void;
}

export function Blob3D({
  position = [0, 0, 0],
  scale = 1,
  color = '#3b82f6',
  wireframe = false,
  onReady,
}: Blob3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();
  const [isReady, setIsReady] = useState(false);

  // Create sphere geometry with more vertices for better morphing
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    return geo;
  }, []);

  // Animated spring for scale, rotation, and opacity
  const { meshScale, opacity } = useSpring({
    meshScale: isReady ? scale : 0,
    opacity: isReady ? 0.8 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  // Mark as ready after a short delay to ensure smooth loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      onReady?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onReady]);

  // Animation loop for morphing and mouse interaction
  useFrame(state => {
    if (!meshRef.current || !isReady) return;

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
      <animated.meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={opacity}
      />
    </animated.mesh>
  );
}
