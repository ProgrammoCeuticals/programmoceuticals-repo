"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

// ─── Cursor tracker ───────────────────────────────────────────────────────────
function useCursorNDC() {
  const cursor = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursor.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return cursor;
}

// ─── Ambient particle cloud ───────────────────────────────────────────────────
function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color("#1E6FD9");
    const c2 = new THREE.Color("#0ABFBC");
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      const c = c1.clone().lerp(c2, t);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

// ─── DNA double helix ─────────────────────────────────────────────────────────
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Strand geometry
  const { strand1Pos, strand2Pos, bridgeData } = useMemo(() => {
    const count = 50;
    const s1 = new Float32Array(count * 3);
    const s2 = new Float32Array(count * 3);
    const bridges: { p1: THREE.Vector3; p2: THREE.Vector3 }[] = [];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 6;
      const y = t * 9 - 4.5;
      const r = 1.2;

      s1[i * 3]     = r * Math.cos(angle);
      s1[i * 3 + 1] = y;
      s1[i * 3 + 2] = r * Math.sin(angle);

      s2[i * 3]     = r * Math.cos(angle + Math.PI);
      s2[i * 3 + 1] = y;
      s2[i * 3 + 2] = r * Math.sin(angle + Math.PI);

      // Cross-bridges every ~8 particles
      if (i % 8 === 0) {
        bridges.push({
          p1: new THREE.Vector3(s1[i * 3], y, s1[i * 3 + 2]),
          p2: new THREE.Vector3(s2[i * 3], y, s2[i * 3 + 2]),
        });
      }
    }
    return { strand1Pos: s1, strand2Pos: s2, bridgeData: bridges };
  }, []);

  useFrame((_, delta) => {
    if (prefersReducedMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
  });

  const strandMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.055,
        sizeAttenuation: true,
        depthWrite: false,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  const strand1Mat = useMemo(() => {
    const m = strandMat.clone();
    m.color = new THREE.Color("#4A9AEA");
    return m;
  }, [strandMat]);

  const strand2Mat = useMemo(() => {
    const m = strandMat.clone();
    m.color = new THREE.Color("#0ABFBC");
    return m;
  }, [strandMat]);

  return (
    <group ref={groupRef}>
      {/* Strand 1 */}
      <points material={strand1Mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand1Pos, 3]} />
        </bufferGeometry>
      </points>

      {/* Strand 2 */}
      <points material={strand2Mat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand2Pos, 3]} />
        </bufferGeometry>
      </points>

      {/* Cross-bridges */}
      {bridgeData.map((b, i) => {
        const pts = [b.p1, b.p2];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? "#1E6FD9" : "#0ABFBC",
          transparent: true,
          opacity: 0.35,
        });
        return <primitive key={i} object={new THREE.Line(geo, mat)} />;
      })}

      {/* Node spheres at bridge endpoints */}
      {bridgeData.map((b, i) => (
        <group key={`node-${i}`}>
          <mesh position={b.p1}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshPhysicalMaterial color="#4A9AEA" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={b.p2}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshPhysicalMaterial color="#0ABFBC" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Camera rig with cursor response ─────────────────────────────────────────
function CameraRig({ cursor }: { cursor: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (cursor.current.x * 1.2 - target.current.x) * 0.04;
    target.current.y += (cursor.current.y * 0.8 - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Scene wrapper ────────────────────────────────────────────────────────────
function HeroScene() {
  const cursor = useCursorNDC();

  return (
    <>
      <CameraRig cursor={cursor} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 6, 4]}   intensity={6}  color="#1E6FD9" />
      <pointLight position={[-4, -4, 2]} intensity={4}  color="#0ABFBC" />
      <pointLight position={[0, 0, 6]}   intensity={2}  color="#ffffff" />

      <DNAHelix />
      <ParticleCloud />
    </>
  );
}

// ─── Mobile fallback — static lightweight version ─────────────────────────────
function HeroSceneMobile() {
  const ref = useRef<THREE.Points>(null);
  const { positions } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 4;
      const y = (i / count) * 6 - 3;
      const strand = i % 2 === 0 ? 0 : Math.PI;
      pos[i * 3]     = 1.2 * Math.cos(angle + strand);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 1.2 * Math.sin(angle + strand);
    }
    return { positions: pos };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 4, 3]} intensity={5} color="#1E6FD9" />
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#4A9AEA" size={0.06} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function HeroParticleField() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, isMobile ? 1 : 1.5]}
        frameloop="always"
      >
        {isMobile ? <HeroSceneMobile /> : <HeroScene />}
      </Canvas>
    </div>
  );
}
