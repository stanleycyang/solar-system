"use client";
import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Planet from "./Planet";
import Controls from "./Controls";
import { PlanetConfig } from "../types";
import * as THREE from "three";

const planets: PlanetConfig[] = [
  {
    name: "mercury",
    orbitRadius: 100,
    speed: 4.1,
    size: 4.2,
    info: {
      diameter: "4,879 km",
      dayLength: "176 Earth days",
      yearLength: "88 Earth days",
      temperature: "-180°C to 430°C",
      description: "The smallest and innermost planet in the Solar System.",
    },
  },
  {
    name: "venus",
    orbitRadius: 140,
    speed: 1.6,
    size: 4.8,
    info: {
      diameter: "12,104 km",
      dayLength: "243 Earth days",
      yearLength: "225 Earth days",
      temperature: "462°C",
      description:
        "Often called Earth's sister planet due to their similar size.",
    },
  },
  {
    name: "earth",
    orbitRadius: 180,
    speed: 1,
    size: 5,
    info: {
      diameter: "12,742 km",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperature: "15°C (average)",
      description: "Our home planet and the only known planet with life.",
    },
  },
  {
    name: "mars",
    orbitRadius: 220,
    speed: 0.5,
    size: 4,
    info: {
      diameter: "6,779 km",
      dayLength: "24 hours 37 minutes",
      yearLength: "687 Earth days",
      temperature: "-63°C (average)",
      description: "The Red Planet, named after the Roman god of war.",
    },
  },
  {
    name: "jupiter",
    orbitRadius: 300,
    speed: 0.08,
    size: 12,
    info: {
      diameter: "139,820 km",
      dayLength: "10 hours",
      yearLength: "12 Earth years",
      temperature: "-110°C (cloud top)",
      description: "The largest planet in our solar system.",
    },
  },
  {
    name: "saturn",
    orbitRadius: 380,
    speed: 0.03,
    size: 10,
    info: {
      diameter: "116,460 km",
      dayLength: "10.7 hours",
      yearLength: "29.5 Earth years",
      temperature: "-140°C",
      description: "Known for its spectacular ring system.",
    },
  },
  {
    name: "uranus",
    orbitRadius: 440,
    speed: 0.01,
    size: 7,
    info: {
      diameter: "50,724 km",
      dayLength: "17 hours",
      yearLength: "84 Earth years",
      temperature: "-195°C",
      description: "The coldest of the gas giants, tilted on its side.",
    },
  },
  {
    name: "neptune",
    orbitRadius: 500,
    speed: 0.006,
    size: 6.8,
    info: {
      diameter: "49,244 km",
      dayLength: "16 hours",
      yearLength: "165 Earth years",
      temperature: "-200°C",
      description: "The windiest planet, with speeds up to 2,100 km/h.",
    },
  },
  {
    name: "pluto",
    orbitRadius: 560,
    speed: 0.004,
    size: 2.8,
    info: {
      diameter: "2,377 km",
      dayLength: "153 hours",
      yearLength: "248 Earth years",
      temperature: "-230°C",
      description: "A dwarf planet in the Kuiper Belt.",
    },
  },
];

export default function SolarSystem() {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);

  return (
    <div className='solar-system-container'>
      <Canvas
        gl={{ antialias: true }}
        camera={{
          position: [0, 150, 400],
          fov: 45,
          near: 0.1,
          far: 10000,
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={50}
          maxDistance={1000}
        />

        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.2} />
        <hemisphereLight
          intensity={0.5}
          color='#ffffff'
          groundColor='#000000'
        />

        {/* Sun */}
        <group>
          <mesh>
            <sphereGeometry args={[20, 128, 64]} />
            <meshBasicMaterial color='#ffd700' />
          </mesh>
          <pointLight intensity={2} distance={1000} decay={2} />
          <mesh>
            <sphereGeometry args={[21, 64, 32]} />
            <meshBasicMaterial
              color='#ff8c00'
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* Enhanced stars */}
        <Stars
          radius={1000}
          depth={100}
          count={7000}
          factor={5}
          saturation={1}
          fade
          speed={1}
        />

        {/* Planets */}
        {planets.map((planet) => (
          <Planet
            key={planet.name}
            config={planet}
            orbitRadius={planet.orbitRadius}
            rotationSpeed={0.002}
            isPaused={isPaused}
            speedMultiplier={speed}
            showOrbits={showOrbits}
          />
        ))}
      </Canvas>

      <Controls
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        speed={speed}
        onSpeedChange={(newSpeed) => setSpeed(newSpeed)}
        showOrbits={showOrbits}
        onOrbitsToggle={() => setShowOrbits(!showOrbits)}
      />
    </div>
  );
}
