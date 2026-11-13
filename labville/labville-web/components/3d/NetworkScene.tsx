"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Organic node positions — not a cube
const NODES: [number, number, number][] = [
  [0,    0,    0   ],
  [1.8,  0.4,  0.3 ],
  [-1.7, 0.6,  0.2 ],
  [0.4, -1.8,  0.1 ],
  [-0.5, 1.9,  0.0 ],
  [1.2,  1.4, -0.4 ],
  [-1.1,-1.3,  0.5 ],
  [0.2,  0.3,  2.0 ],
  [1.5, -1.0,  0.8 ],
];

// Edges connecting to center and between neighbours
const EDGES: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
  [1,5],[2,4],[3,6],[5,8],[4,7],
];

function NetworkGraph() {
  const groupRef  = useRef<THREE.Group>(null);
  const nodeRefs  = useRef<THREE.Mesh[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const edgeObjects = useMemo(() =>
    EDGES.map(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...NODES[a]),
        new THREE.Vector3(...NODES[b]),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: "#0ABFBC",
        transparent: true,
        opacity: 0.3,
      });
      return new THREE.Line(geo, mat);
    }), []);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x += delta * 0.06;
    }
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = 1 + 0.15 * Math.sin(state.clock.elapsedTime * 1.5 + i * 0.9);
      mesh.scale.setScalar(s);
    });
  });

  const nodeColors = ["#4A9AEA","#0ABFBC","#1E6FD9","#0ABFBC","#4A9AEA","#1E6FD9","#0ABFBC","#4A9AEA","#1E6FD9"];
  const nodeSizes  = [0.22, 0.14, 0.14, 0.12, 0.12, 0.11, 0.11, 0.10, 0.10];

  return (
    <group ref={groupRef}>
      {edgeObjects.map((line, i) => <primitive key={i} object={line} />)}
      {NODES.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
          ref={(el) => { if (el) nodeRefs.current[i] = el; }}
        >
          <sphereGeometry args={[nodeSizes[i], 16, 16]} />
          <meshPhysicalMaterial
            color={nodeColors[i]}
            roughness={0.08}
            metalness={0.85}
            emissive={nodeColors[i]}
            emissiveIntensity={i === 0 ? 0.5 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function NetworkScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]}   intensity={7}  color="#4A9AEA" />
        <pointLight position={[-3, -2, 2]} intensity={4}  color="#0ABFBC" />
        <NetworkGraph />
      </Canvas>
    </div>
  );
}
