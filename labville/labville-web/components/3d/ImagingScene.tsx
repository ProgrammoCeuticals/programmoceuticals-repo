"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function ScanPlanes() {
  const groupRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<THREE.Mesh[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const planes = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      y: (i / 6) * 3.2 - 1.6,
      opacity: 0.06 + (i % 2) * 0.04,
    })), []);

  useFrame((state) => {
    if (prefersReducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
    // Animate scan line sweeping up
    planeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.04 + 0.12 * Math.abs(Math.sin(state.clock.elapsedTime * 0.8 + i * 0.5));
    });
  });

  return (
    <group ref={groupRef}>
      {/* Glass body sphere */}
      <mesh>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshPhysicalMaterial
          color="#0ABFBC"
          roughness={0.0}
          metalness={0.0}
          transmission={0.88}
          thickness={1.2}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scan planes */}
      {planes.map((p, i) => (
        <mesh
          key={i}
          position={[0, p.y, 0]}
          ref={(el) => { if (el) planeRefs.current[i] = el; }}
        >
          <planeGeometry args={[2.8, 2.8]} />
          <meshStandardMaterial
            color="#0ABFBC"
            transparent
            opacity={p.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Outer scan ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.025, 12, 120]} />
        <meshStandardMaterial color="#1E6FD9" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.1} transmission={0.6} thickness={0.3} />
      </mesh>
    </group>
  );
}

export default function ImagingScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 46 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]}   intensity={8}  color="#0ABFBC" />
        <pointLight position={[-3, -2, 2]} intensity={5}  color="#1E6FD9" />
        <pointLight position={[0, 0, 5]}   intensity={2}  color="#ffffff" />
        <ScanPlanes />
      </Canvas>
    </div>
  );
}
