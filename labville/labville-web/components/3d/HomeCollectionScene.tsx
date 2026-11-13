"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Rising particles to evoke sample being processed
function RisingParticles() {
  const ref = useRef<THREE.Points>(null);
  const { positions, velocities } = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * 3 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      vel[i] = 0.004 + Math.random() * 0.006;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const posRef = useRef(positions.slice());

  useFrame(() => {
    for (let i = 0; i < 60; i++) {
      posRef.current[i * 3 + 1] += velocities[i];
      if (posRef.current[i * 3 + 1] > 1.8) {
        posRef.current[i * 3 + 1] = -1.5;
      }
    }
    if (ref.current) {
      (ref.current.geometry.attributes.position as THREE.BufferAttribute).array.set(posRef.current);
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#0ABFBC" size={0.04} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function SampleTube() {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((state, delta) => {
    if (prefersReducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.position.y = 0.12 * Math.sin(state.clock.elapsedTime * 1.2);
  });

  return (
    <group ref={groupRef}>
      {/* Tube body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 2.2, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#0ABFBC"
          roughness={0.0}
          metalness={0.0}
          transmission={0.85}
          thickness={0.5}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tube cap */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.18, 32]} />
        <meshPhysicalMaterial color="#1E6FD9" roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Liquid inside */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 1.2, 32]} />
        <meshPhysicalMaterial color="#0ABFBC" roughness={0.1} metalness={0.0} transparent opacity={0.45} />
      </mesh>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.015, 8, 80]} />
        <meshStandardMaterial color="#4A9AEA" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function HomeCollectionScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 4, 3]}   intensity={7}  color="#0ABFBC" />
        <pointLight position={[-2, -2, 2]} intensity={4}  color="#1E6FD9" />
        <SampleTube />
        <RisingParticles />
      </Canvas>
    </div>
  );
}
