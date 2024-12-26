import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlanetConfig } from "../types";

interface PlanetProps {
  config: PlanetConfig;
  orbitRadius: number;
  rotationSpeed?: number;
  isPaused?: boolean;
  speedMultiplier?: number;
  showOrbits?: boolean;
}

// Planet colors and properties
const planetMaterials = {
  mercury: {
    color: "#8C8C8C",
    emissive: "#1C1C1C",
    roughness: 0.5,
    metalness: 0.8,
    bumpScale: 0.02,
  },
  venus: {
    color: "#E6B87C",
    emissive: "#4A3829",
    roughness: 0.7,
    metalness: 0.3,
    bumpScale: 0.05,
  },
  earth: {
    color: "#4B6995",
    emissive: "#1B2839",
    roughness: 0.6,
    metalness: 0.2,
    bumpScale: 0.05,
  },
  mars: {
    color: "#C1440E",
    emissive: "#3B1505",
    roughness: 0.7,
    metalness: 0.2,
    bumpScale: 0.08,
  },
  jupiter: {
    color: "#C88B3A",
    emissive: "#46321B",
    roughness: 0.4,
    metalness: 0.1,
    bumpScale: 0.1,
  },
  saturn: {
    color: "#C5AB6E",
    emissive: "#46321B",
    roughness: 0.5,
    metalness: 0.2,
    bumpScale: 0.05,
  },
  uranus: {
    color: "#4FD0E7",
    emissive: "#1B4B52",
    roughness: 0.6,
    metalness: 0.3,
    bumpScale: 0.03,
  },
  neptune: {
    color: "#4B70DD",
    emissive: "#1B2D52",
    roughness: 0.6,
    metalness: 0.3,
    bumpScale: 0.04,
  },
  pluto: {
    color: "#936C5A",
    emissive: "#2D1F1B",
    roughness: 0.8,
    metalness: 0.1,
    bumpScale: 0.02,
  },
};

export default function Planet({
  config,
  orbitRadius,
  rotationSpeed = 0.001,
  isPaused = false,
  speedMultiplier = 1,
  showOrbits = true,
}: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const materialProps =
    planetMaterials[config.name as keyof typeof planetMaterials];

  useFrame((state, delta) => {
    if (!isPaused && meshRef.current && orbitRef.current) {
      // Self rotation
      meshRef.current.rotation.y += rotationSpeed * speedMultiplier;

      // Orbit rotation
      orbitRef.current.rotation.y +=
        (config.speed * delta * speedMultiplier) / 50;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit line with visibility control */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={64}
            array={
              new Float32Array(
                [...Array(65)]
                  .map((_, i) => {
                    const angle = (i / 64) * Math.PI * 2;
                    return [
                      Math.cos(angle) * orbitRadius,
                      0,
                      Math.sin(angle) * orbitRadius,
                    ];
                  })
                  .flat()
              )
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          visible={showOrbits}
          color='#ffffff'
          transparent
          opacity={0.2}
        />
      </line>

      {/* Planet */}
      <mesh ref={meshRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[config.size, 128, 64]} />
        <meshPhysicalMaterial
          {...materialProps}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
          sheen={0.1}
          envMapIntensity={0.5}
        />

        {/* Saturn's rings */}
        {config.name === "saturn" && (
          <group rotation={[Math.PI / 6, 0, 0]}>
            <mesh>
              <ringGeometry args={[config.size * 1.4, config.size * 2.5, 64]} />
              <meshStandardMaterial
                color='#C5AB6E'
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {/* Add surface detail */}
        <mesh scale={[1.001, 1.001, 1.001]}>
          <sphereGeometry args={[config.size, 128, 64]} />
          <meshStandardMaterial
            color={materialProps.color}
            roughness={1}
            metalness={0}
            opacity={0.2}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Enhanced atmosphere effect */}
        {["earth", "venus", "jupiter", "saturn", "uranus", "neptune"].includes(
          config.name
        ) && (
          <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[config.size, 64, 32]} />
            <meshPhysicalMaterial
              color={materialProps.color}
              transparent
              opacity={0.1}
              side={THREE.BackSide}
              clearcoat={1}
              clearcoatRoughness={0}
              envMapIntensity={2}
            />
          </mesh>
        )}
      </mesh>
    </group>
  );
}
