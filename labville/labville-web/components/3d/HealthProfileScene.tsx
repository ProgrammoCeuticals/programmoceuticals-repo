"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const RINGS = [
  { radius: 0.9,  tube: 0.018, color: "#1E6FD9", speed: 0.6,  tilt: [0.3, 0, 0]    as [number,number,number], nodes: 4 },
  { radius: 1.5,  tube: 0.014, color: "#4A9AEA", speed: -0.4, tilt: [0, 0.5, 0.4]  as [number,number,number], nodes: 6 },
  { radius: 2.1,  tube: 0.010, color: "#0ABFBC", speed: 0.25, tilt: [0.6, 0.2, 0]  as [number,number,number], nodes: 8 },
];

function OrbitRing({ ring }: { ring: typeof RINGS[0] }) {
  const ringRef  = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nodePositions = useMemo(() =>
    Array.from({ length: ring.nodes }, (_, i) => {
      const a = (i / ring.nodes) * Math.PI * 2;
      return new THREE.Vector3(
        ring.radius * Math.cos(a),
        ring.radius * Math.sin(a),
        0
      );
    }), [ring.radius, ring.nodes]);

  useFrame((_, delta) => {
    if (prefersReducedMotion) return;
    if (ringRef.current)  ringRef.current.rotation.z  += delta * ring.speed;
    if (nodesRef.current) nodesRef.current.rotation.z += delta * ring.speed;
  });

  return (
    <group rotation={ring.tilt as unknown as THREE.Euler}>
      <mesh ref={ringRef}>
        <torusGeometry args={[ring.radius, ring.tube, 8, 100]} />
        <meshStandardMaterial color={ring.color} roughness={0.2} metalness={0.7} transparent opacity={0.7} />
      </mesh>
      <group ref={nodesRef}>
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshPhysicalMaterial color={ring.color} roughness={0.05} metalness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function HealthProfile() {
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (coreRef.current) {
      const s = 1 + 0.06 * Math.sin(state.clock.elapsedTime * 1.8);
      coreRef.current.scale.setScalar(s);
    }
  });

  return (
    <>
      {RINGS.map((r, i) => <OrbitRing key={i} ring={r} />)}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} transmission={0.5} thickness={0.4} />
      </mesh>
    </>
  );
}

export default function HealthProfileScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 4, 3]}   intensity={7}  color="#1E6FD9" />
        <pointLight position={[-3, -2, 2]} intensity={4}  color="#0ABFBC" />
        <HealthProfile />
      </Canvas>
    </div>
  );
}
