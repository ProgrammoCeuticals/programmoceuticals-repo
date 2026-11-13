"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function BiomarkerHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const markerRefs = useRef<THREE.Mesh[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { s1, s2, markers, bridges } = useMemo(() => {
    const count = 60;
    const strand1 = new Float32Array(count * 3);
    const strand2 = new Float32Array(count * 3);
    const markerData: { pos: THREE.Vector3; color: string }[] = [];
    const bridgeLines: { p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 5;
      const y = t * 5 - 2.5;
      const r = 1.0;

      strand1[i * 3]     = r * Math.cos(angle);
      strand1[i * 3 + 1] = y;
      strand1[i * 3 + 2] = r * Math.sin(angle);

      strand2[i * 3]     = r * Math.cos(angle + Math.PI);
      strand2[i * 3 + 1] = y;
      strand2[i * 3 + 2] = r * Math.sin(angle + Math.PI);

      if (i % 10 === 0) {
        const p1 = new THREE.Vector3(strand1[i*3], y, strand1[i*3+2]);
        const p2 = new THREE.Vector3(strand2[i*3], y, strand2[i*3+2]);
        bridgeLines.push({ p1, p2 });
        // Highlight biomarker nodes
        markerData.push({ pos: p1, color: "#0ABFBC" });
        markerData.push({ pos: p2, color: "#1E6FD9" });
      }
    }
    return { s1: strand1, s2: strand2, markers: markerData, bridges: bridgeLines };
  }, []);

  useFrame((state, delta) => {
    if (prefersReducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.4;
    markerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = 1 + 0.18 * Math.sin(state.clock.elapsedTime * 2 + i * 0.7);
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[s1, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#4A9AEA" size={0.05} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[s2, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#0ABFBC" size={0.05} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>

      {bridges.map((b, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([b.p1, b.p2]);
        const mat = new THREE.LineBasicMaterial({ color: "#1E6FD9", transparent: true, opacity: 0.4 });
        return <primitive key={i} object={new THREE.Line(geo, mat)} />;
      })}

      {markers.map((m, i) => (
        <mesh
          key={i}
          position={m.pos}
          ref={(el) => { if (el) markerRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshPhysicalMaterial color={m.color} roughness={0.05} metalness={0.9} emissive={m.color} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function BiomarkerScene() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={1}>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 4, 3]}   intensity={7}  color="#4A9AEA" />
        <pointLight position={[-3, -2, 2]} intensity={5}  color="#0ABFBC" />
        <BiomarkerHelix />
      </Canvas>
    </div>
  );
}
