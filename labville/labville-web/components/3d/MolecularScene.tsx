"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const ATOMS: { pos: [number, number, number]; color: string; r: number }[] = [
  { pos: [0, 0, 0],       color: "#4A9AEA", r: 0.38 },
  { pos: [1.6, 0.4, 0],   color: "#0ABFBC", r: 0.26 },
  { pos: [-1.5, 0.5, 0],  color: "#0ABFBC", r: 0.26 },
  { pos: [0.5, -1.5, 0],  color: "#1E6FD9", r: 0.22 },
  { pos: [-0.6, -1.4, 0], color: "#1E6FD9", r: 0.22 },
  { pos: [0.2, 0, 1.6],   color: "#0E7C7B", r: 0.20 },
];

const BONDS: [number, number][] = [[0,1],[0,2],[0,3],[0,4],[0,5]];

function Bond({ a, b }: { a: [number, number, number]; b: [number, number, number] }) {
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...a),
      new THREE.Vector3(...b),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: "#0ABFBC", transparent: true, opacity: 0.5 });
    return new THREE.Line(geo, mat);
  }, [a, b]);
  return <primitive object={line} />;
}

function OrbitalRing({ radius, tilt }: { radius: number; tilt: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.6;
  });
  return (
    <mesh ref={ref} rotation={tilt as unknown as THREE.Euler}>
      <torusGeometry args={[radius, 0.012, 8, 80]} />
      <meshStandardMaterial color="#1E6FD9" transparent opacity={0.25} />
    </mesh>
  );
}

function Molecule() {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((_, delta) => {
    if (prefersReducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x += delta * 0.12;
  });

  return (
    <group ref={groupRef}>
      {BONDS.map(([ai, bi], i) => (
        <Bond key={i} a={ATOMS[ai].pos} b={ATOMS[bi].pos} />
      ))}
      {ATOMS.map((atom, i) => (
        <mesh key={i} position={atom.pos}>
          <sphereGeometry args={[atom.r, 24, 24]} />
          <meshPhysicalMaterial
            color={atom.color}
            roughness={0.08}
            metalness={0.85}
            envMapIntensity={1.2}
          />
        </mesh>
      ))}
      <OrbitalRing radius={2.0} tilt={[0.4, 0, 0]} />
      <OrbitalRing radius={1.6} tilt={[0, 0.5, 0.8]} />
    </group>
  );
}

export default function MolecularScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 48 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.15} />
        <pointLight position={[3, 4, 3]}   intensity={8}  color="#4A9AEA" />
        <pointLight position={[-3, -2, 2]} intensity={5}  color="#0ABFBC" />
        <pointLight position={[0, 0, 5]}   intensity={2}  color="#ffffff" />
        <Molecule />
      </Canvas>
    </div>
  );
}
